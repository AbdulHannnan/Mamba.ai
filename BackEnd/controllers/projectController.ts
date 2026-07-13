import { Request, Response } from "express";
import * as Sentry from "@sentry/node";
import { prisma } from "../configs/prisma.js";
import { v2 as cloudinary } from "cloudinary";
import {
  GenerateContentConfig,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/genai/web";
import fs, { mkdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import ai from "../configs/ai.js";
import axios from "axios";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const loadImage = (filePath: string, mimeType: string) => {
  return {
    inlineData: {
      data: fs.readFileSync(filePath).toString("base64"),
      mimeType,
    },
  };
};

export const createProject = async (req: Request, res: Response) => {
  const { userId } = req.auth();

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized user." });
  }

  let isCreditDeducted = false;
  let tempProjectId: string | null = null;

  const {
    name = "Untitled Project",
    productName,
    productDescription,
    userPrompt,
    aspectRatio,
    targetLength = 5,
  } = req.body;

  const images: any[] = Array.isArray(req.files) ? req.files : [];

  if (!productName || images.length === 0 || images.length > 2) {
    return res
      .status(400)
      .json({ message: "Please provide a product name and up to 2 images." });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user || user.credits < 5) {
    return res
      .status(401)
      .json({ message: "User not found or insufficient credits." });
  } else {
    await prisma.user
      .update({
        where: { id: userId },
        data: { credits: user.credits - 5 },
      })
      .then(() => {
        isCreditDeducted = true;
      });
  }

  try {
    const uploadImages = await Promise.all(
      images.map(async (image: any) => {
        const result = await cloudinary.uploader.upload(image.path, {
          resource_type: "image",
        });

        fs.unlinkSync(image.path);

        return result.secure_url;
      })
    );

    const project = await prisma.project.create({
      data: {
        name,
        userId,
        productName,
        productDescription,
        userPrompt,
        aspectRatio,
        targetLength: Number(targetLength) || 5,
        uploadedImages: uploadImages,
        isGenerating: true,
      },
    });

    tempProjectId = project.id;

    const model = "gemini-3.1-flash-image-preview";

    const generationConfig: GenerateContentConfig = {
      maxOutputTokens: 3000,
      temperature: 1,
      topP: 0.95,
      responseModalities: ["image"],
      imageConfig: {
        aspectRatio: aspectRatio || "9:16",
        maxOutputImages: 5,
        imageSize: "1K",
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.OFF,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.OFF,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.OFF,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.OFF,
        },
      ],
    } as any;

    const imagebase64 = loadImage(images[0].path, images[0].mimetype);
    const image2base64 = images[1]
      ? loadImage(images[1].path, images[1].mimetype)
      : null;

    const prompt = `Generate a video ad for a product named ${productName} with the following description: ${productDescription}. The video should be approximately ${targetLength} seconds long and should be in ${aspectRatio} aspect ratio. Use the following user prompt for inspiration: ${userPrompt}. Use the following images as references. The video should be engaging and visually appealing, showcasing the product in the best possible way. Please ensure that the video is suitable for social media platforms and adheres to community guidelines. Match lighting, shadows and perspective of the images.`;

    const response: any = await ai.models.generateContent({
      model,
      contents: [
        imagebase64,
        ...(image2base64 ? [image2base64] : []),
        { text: prompt },
      ] as any,
      config: generationConfig,
    });

    if (!response?.candidates?.[0]?.content?.parts) {
      throw new Error("AI generation failed. No content returned.");
    }

    const parts = response.candidates[0].content.parts;

    let finalBuffer: Buffer | null = null;

    for (const part of parts) {
      if (part.inlineData) {
        finalBuffer = Buffer.from(part.inlineData.data, "base64");
      }
    }

    if (!finalBuffer) {
      throw new Error("Failed to generate the Image");
    }

    const base64Image = `data:image/jpeg;base64,${finalBuffer.toString(
      "base64"
    )}`;

    const uploadResult = await cloudinary.uploader.upload(base64Image, {
      resource_type: "image",
    });

    await prisma.project.update({
      where: { id: project.id },
      data: {
        generatedImage: uploadResult.secure_url,
        isGenerating: false,
      },
    });

    res.status(200).json({
      projectId: project.id,
      generatedImage: uploadResult.secure_url,
    });
  } catch (error: any) {
    if (tempProjectId) {
      await prisma.project.update({
        where: { id: tempProjectId },
        data: { isGenerating: false, error: error.message },
      });
    }

    if (isCreditDeducted) {
      await prisma.user.update({
        where: { id: userId },
        data: { credits: { increment: 5 } },
      });
    }

    Sentry.captureException(error);
    res.status(500).json({ message: error.code || error.message });
  }
};

export const createVideo = async (req: Request, res: Response) => {
  const { userId } = req.auth();
  const { projectId } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized user." });
  }

  if (!projectId || typeof projectId !== "string") {
    return res.status(400).json({ message: "Project id is required." });
  }

  let isCreditDeducted = false;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || user.credits < 10) {
      return res
        .status(401)
        .json({ message: "User not found or insufficient credits." });
    } else {
      await prisma.user
        .update({
          where: { id: userId },
          data: { credits: user.credits - 10 },
        })
        .then(() => {
          isCreditDeducted = true;
        });
    }

    const project = await prisma.project.findFirst({
      where: { id: projectId, userId },
    });

    if (!project || project.isGenerating) {
      return res
        .status(400)
        .json({ message: "Project not found or already generating." });
    }

    if (project.generatedVideo) {
      return res
        .status(404)
        .json({ message: "Video already generated for this project." });
    }

    await prisma.project.update({
      where: { id: projectId },
      data: { isGenerating: true },
    });

    const prompt = `Generate a video ad for a product named ${project.productName} with the following description: ${project.productDescription}. The video should be approximately ${project.targetLength} seconds long and should be in ${project.aspectRatio} aspect ratio. Use the following user prompt for inspiration: ${project.userPrompt}. Use the following images as references: ${project.uploadedImages[0]} and ${project.uploadedImages[1]}. The video should be engaging and visually appealing, showcasing the product in the best possible way. Please ensure that the video is suitable for social media platforms and adheres to community guidelines. Match lighting, shadows and perspective of the images.`;

    const model = "veo-3.1-generate-preview";

    if (!project.generatedImage) {
      throw new Error("No reference image found for this project.");
    }

    const image = await axios.get(project.generatedImage, {
      responseType: "arraybuffer",
    });

    const imageBytes = Buffer.from(image.data).toString("base64");

    let operation: any = await ai.models.generateVideos({
      model,
      prompt,
      image: {
        imageBytes,
        mimeType: "image/jpeg",
      },
      config: {
        aspectRatio: project?.aspectRatio || "9:16",
        numberOfVideos: 1,
        resolution: "720p",
      },
    });

    while (!operation.done) {
      console.log("Video generation in progress...");
      await new Promise((resolve) => setTimeout(resolve, 10000));

      operation = await ai.operations.getVideosOperation({
        operation: operation,
      });
    }

    if (!operation.response?.generatedVideos?.[0]?.video) {
      throw new Error("Failed to generate video.");
    }

    const filename = `video_${projectId}_${Date.now()}.mp4`;
    const folderPath = path.join(__dirname, "../generatedVideos");
    const filepath = path.join(folderPath, filename);

    mkdirSync(folderPath, { recursive: true });

    await ai.files.download({
      file: operation.response.generatedVideos[0].video,
      downloadPath: filepath,
    });

    const uploadResult = await cloudinary.uploader.upload(filepath, {
      resource_type: "video",
    });

    await prisma.project.update({
      where: { id: projectId },
      data: { generatedVideo: uploadResult.secure_url, isGenerating: false },
    });

    fs.unlinkSync(filepath);

    res.status(200).json({
      message: "Video generated successfully.",
      projectId: project.id,
      generatedVideo: uploadResult.secure_url,
    });
  } catch (error: any) {
    await prisma.project.updateMany({
      where: { id: projectId, userId },
      data: { isGenerating: false, error: error.message },
    });

    if (isCreditDeducted) {
      await prisma.user.update({
        where: { id: userId },
        data: { credits: { increment: 10 } },
      });
    }

    Sentry.captureException(error);
    res.status(500).json({ message: error.code || error.message });
  }
};

export const getAllPublishedProjects = async (req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      where: { isPublished: true },
    });

    res.status(200).json({ projects });
  } catch (error: any) {
    Sentry.captureException(error);
    res.status(500).json({ message: error.code || error.message });
  }
};

export const deletProject = async (req: Request, res: Response) => {
  try {
    const { userId } = req.auth();
    const { projectId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized user." });
    }

    if (!projectId || typeof projectId !== "string") {
      return res.status(400).json({ message: "Project id is required." });
    }

    const project = await prisma.project.findFirst({
      where: { id: projectId, userId },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not Found" });
    }

    await prisma.project.delete({
      where: { id: projectId },
    });

    res.json({ message: "Project Deleted" });
  } catch (error: any) {
    Sentry.captureException(error);
    res.status(500).json({ message: error.code || error.message });
  }
};