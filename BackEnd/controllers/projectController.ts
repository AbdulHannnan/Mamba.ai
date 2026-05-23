import { Request, Response } from "express";
import * as Sentry from "@sentry/node";
import { prisma } from "../configs/prisma.js"; 
import { v2 as cloudinary } from "cloudinary";
import { GenerateContentConfig, HarmBlockThreshold, HarmCategory } from "@google/genai/web";
import fs from "fs";
import path from "path";
import ai from "../configs/ai.js";

const loadImage = (path:string , mimeType:string)=>{
    reurn {
        inlineData :{
            data : fs.readFileSync(path).toString('base64'),
            mimeType : 
        }
    }
}

export const createProject = async (req: Request, res: Response) => {

    let projectTemplate: string;
    const { userId } = req.auth();
    let isCreditDeducted = false;

    const {name="Untitled Project", productName, productDescription, userPrompt , aspectRatio , targetLeangth = 5 } = req.body;

    const images: any  = req.files;
    if (images && images.length > 2 || !productName) {
        return res.status(400).json({ message: "Please provide a product name and up to 2 images." });
 }

 const user = await prisma.user.findUnique({ where: { id: userId } });
 if (!user || user.credits < 5) {
    return res.status(401).json({ message: "User not found or insufficient credits." });
 }else{
    // deduct creadit for user generateion
        await prisma.user.update({
            where: { id: userId },
            data: { credits: user.credits - 5 }
        }).then(() => {
            isCreditDeducted = true
        });
 }
    try {
            let uploadImages = await Promise.all(images.map((image: any) => {
                let result = cloudinary.uploader.upload(image.path, {
                    {resource_type: "image"});
                    return result.secure_url;
                })
            );

           const project = await prisma.project.create({
            data : {
                name,
                userId,
                productName,
                productDescription,
                userPrompt,
                aspectRatio,
                targetLeangth,
               images: uploadImages,
               isGenerating: true,
               isCreditDeducted
            }
           })

           TempProjectId = project.id;

           const model = "gemini-3.1-flash-image-preview"

           const generationConfig : GenerateContentConfig = {
                maxOutputTokens: 3000,
                temperature : 1,
                topP : 0.95,
                responseModalities:['image'],
                imageConfig : {
                    aspectRatio : [aspectRatio] || '9:16',
                    maxOutputImages : 5,
                    imageSize : '1kb',
                },
                SafetySettings : [{
                    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                    threshold: HarmBlockThreshold.OFF
                },
                {
                    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                    threshold: HarmBlockThreshold.OFF},
                     {
                    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                    threshold: HarmBlockThreshold.OFF},
                     {
                    category: HarmCategory.HARM_CATEGORY_IMAGE_HATE,
                    threshold: HarmBlockThreshold.OFF}
            ]

           }

        //    images to base64 AI Structure 

        const imagebase64 = loadImage(Images[0].path, images[0].mimetype)
        const image2base64 = loadImage(Images[1].path, images[1].mimetype)

        const prompt = `Generate a video ad for a product named ${productName} with the following description: ${productDescription}. The video should be approximately ${targetLeangth} seconds long and should be in ${aspectRatio} aspect ratio. Use the following user prompt for inspiration: ${userPrompt}. Use the following images as references: ${imagebase64} and ${image2base64}. The video should be engaging and visually appealing, showcasing the product in the best possible way. Please ensure that the video is suitable for social media platforms and adheres to community guidelines.Match lighting, shadows and perpective of the images.`


        //  Generate the images using the AI model 

        const response : any = await ai.models.generateContent({
            model,
            contents : [imagebase64, image2base64 , prompt],
            config : generationConfig,
        });

        if(!response?.candidates?.[0]?.content?.parts){
            throw new Error("AI generation failed. No content returned.");
        }
        const parts = response.candidates[0].content.parts;

        let finalBuffer = Buffer | null = null

        for (const part of parts) {
            if(part.inlineData){
                finalBuffer = Buffer.from(part.inlineData.data, 'base64');
            }
        }

        if(!finalBuffer){
            throw new Error("Failed to generate the Image");
        }
        const base64Image = data:image/jpeg;base64,${finalBuffer.toString('base64')};

            // Save the generated image to Cloudinary

            const uploadResult = await cloudinary.uploader.upload(base64Image, {
                resource_type: "image",
            });

            // Storing the it in Database

            await prisma.project.update({
                where : { id : project.id },
                data : {
                    generatedVideo : uploadResult.secure_url,
                    isGenerating : false
                }
            })

            // sending the response 

            res.status(200).json({
                projectId : project.id,
                generatedVideo : uploadResult.secure_url
            })

    }catch (error: any) {


        if (tempProjectId) {
            await prisma.project.update({
                where: { id: tempProjectId },
                data: { isGenerating: false , error: error.message}
            });
        }

        if (isCreditDeducted) {
            // add credit back to user if there is any error
            await prisma.user.update({
                where: { id: userId },
                data: { credits: { increment: 5 } }
            }); 
        }


        Sentry.captureException(error);
        res.status(500).json({ message: error.code || error.message });
    }
}





export const createVideo = async (req: Request, res: Response) => {

    const { userId } = req.auth();
        const { projectId } = req.body;

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || user.credits < 10) {
            return res.status(401).json({ message: "User not found or insufficient credits." });
        }else{
            // deduct creadit for user generateion
                await prisma.user.update({
                    where: { id: userId },
                    data: { credits: user.credits - 10 }
                }).then(() => {
                    isCreditDeducted = true
                });
         try {
            const project = await prisma.project.findUnique({ where: { id: projectId , include: { user: true } } });
            if(!project || project.isGenerating){
                return res.status(400).json({ message: "Project not found or already generating." });
            }
            if(project.generatedVideo){
                return res.status(404).json({message : "Video already generated for this project."});
            }

            await prisma.project.update(
                {where : { id : projectId }, 
                data : { isGenerating : true }
            });

            const prompt = `Generate a video ad for a product named ${project.productName} with the following description: ${project.productDescription}. The video should be approximately ${project.targetLeangth} seconds long and should be in ${project.aspectRatio} aspect ratio. Use the following user prompt for inspiration: ${project.userPrompt}. Use the following images as references: ${project.images[0]} and ${project.images[1]}. The video should be engaging and visually appealing, showcasing the product in the best possible way. Please ensure that the video is suitable for social media platforms and adheres to community guidelines.Match lighting, shadows and perpective of the images.`

            // call the AI model to generate the video

            const model = "veo-3.1-generate-preview"

            if(!project.generatedImage){
                throw new Error("No reference image found for this project.");
            }

    }catch (error: any) {
        Sentry.captureException(error);
        res.status(500).json({ message: error.code || error.message });
    }
}

export const getAllPublishedProjects = async (req: Request, res: Response) => {
    try {

    }catch (error: any) {
        Sentry.captureException(error);
        res.status(500).json({ message: error.code || error.message });
    }
}

export const deletProject = async (req: Request, res: Response) => {
    try {

    }catch (error: any) {
        Sentry.captureException(error);
        res.status(500).json({ message: error.code || error.message });
    }
}