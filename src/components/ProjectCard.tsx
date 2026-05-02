import type React from "react";
import type { Project } from "../types";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  EllipsisIcon,
  ImageIcon,
  Loader2Icon,
  PlaySquareIcon,
  Share2Icon,
  Trash2Icon,
} from "lucide-react";
import { GhostButton, PrimaryButton } from "./Buttons";

function ProjectCard({
  gen,
  setGeneration,
  forComunity = false,
}: {
  gen: Project;
  setGeneration: React.Dispatch<React.SetStateAction<Project[]>>;
  forComunity?: boolean;
}) {
  const navigate = useNavigate();
  const [menueOpen, setMenueOpen] = useState(false);

  const handleDelete = (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project? This action cannot be undone."
    );

    if (!confirmDelete) return;

    setGeneration((prev) => prev.filter((project) => project.id !== id));
  };

  const togglePublish = async (projectId: string) => {
    setGeneration((prev) =>
      prev.map((project) =>
        project.id === projectId
          ? { ...project, isPublished: !project.isPublished }
          : project
      )
    );
  };

  return (
    <div className="mb-4 break-inside-avoid">
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition group relative">
        <div
          className={`${
            gen.aspectRatio === "9:16" ? "aspect-9/16" : "aspect-video"
          } relative overflow-hidden bg-black/20`}
        >
          {gen.generatedImage && (
            <img
              src={gen.generatedImage}
              alt={gen.productName}
              className={`absolute inset-0 w-full h-full object-cover transition duration-500 ${
                gen.generatedVideo
                  ? "group-hover:opacity-0"
                  : "group-hover:scale-105"
              }`}
            />
          )}

          {gen.generatedVideo && (
            <video
              src={gen.generatedVideo}
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition duration-500"
              onMouseEnter={(e) => e.currentTarget.play()}
              onMouseLeave={(e) => e.currentTarget.pause()}
            />
          )}

          {!gen.generatedImage && !gen.generatedVideo && (
            <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-black/20">
              <Loader2Icon className="size-7 animate-spin text-white/50" />
            </div>
          )}

          <div className="absolute left-3 top-3 flex gap-2 items-center pointer-events-none">
            {gen.isGenerating && (
              <span className="text-[10px] px-2 py-1 bg-yellow-600/50 backdrop-blur-sm rounded-full text-white">
                Generating
              </span>
            )}

            {gen.isPublished && (
              <span className="text-[10px] px-2 py-1 bg-green-600/50 backdrop-blur-sm rounded-full text-white">
                Published
              </span>
            )}
          </div>

          {!forComunity && (
            <div
              onMouseDownCapture={() => setMenueOpen(true)}
              onMouseLeave={() => setMenueOpen(false)}
              className="absolute right-3 top-3 sm:opacity-0 group-hover:opacity-100 transition flex items-center gap-2"
            >
              <div className="absolute top-3 right-3">
                <EllipsisIcon className="ml-auto bg-black/10 rounded-full p-1 size-7" />
              </div>

              <div className="flex flex-col items-end w-32 text-sm">
                <ul
                  className={`text-xs ${
                    menueOpen ? "block" : "hidden"
                  } overflow-hidden right-0 w-40 bg-black/50 backdrop-blur text-white border border-gray-500/50 rounded-lg shadow-md mt-2 py-1 z-10`}
                >
                  {gen.generatedImage && (
                    <a
                      href={gen.generatedImage}
                      download
                      className="flex gap-2 items-center px-4 py-2 hover:bg-black/10 cursor-pointer"
                    >
                      <ImageIcon size={14} /> Download Image
                    </a>
                  )}

                  {gen.generatedVideo && (
                    <a
                      href={gen.generatedVideo}
                      download
                      className="flex gap-2 items-center px-4 py-2 hover:bg-black/10 cursor-pointer"
                    >
                      <PlaySquareIcon size={14} /> Download Video
                    </a>
                  )}

                  {(gen.generatedImage || gen.generatedVideo) && (
                    <button
                      onClick={() =>
                        navigator.share({
                          url: gen.generatedVideo || gen.generatedImage,
                          title: gen.productName,
                          text: gen.productDescription,
                        })
                      }
                      className="w-full flex gap-2 items-center px-4 py-2 hover:bg-black/10 cursor-pointer"
                    >
                      <Share2Icon size={14} /> Share
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(gen.id)}
                    className="w-full flex gap-2 items-center px-4 py-2 hover:bg-red-950/10 text-red-400 cursor-pointer"
                  >
                    <Trash2Icon size={14} /> Delete
                  </button>
                </ul>
              </div>
            </div>
          )}

          <div className="absolute right-3 bottom-3 flex items-center">
            {gen.uploadedImages?.[0] && (
              <img
                src={gen.uploadedImages[0]}
                alt="Product Source"
                className="w-12 h-12 object-cover rounded-full border-2 border-white/20 shadow-xl"
              />
            )}

            {gen.uploadedImages?.[1] && (
              <img
                src={gen.uploadedImages[1]}
                alt="Model Source"
                className="w-12 h-12 object-cover rounded-full border-2 border-white/20 shadow-xl -ml-6"
              />
            )}
          </div>
        </div>

        <div className="p-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-medium text-lg mb-1">{gen.productName}</h3>
              <p className="text-sm text-gray-400">
                Created: {new Date(gen.createdAt || "").toLocaleDateString()}
              </p>
            </div>

            <div className="text-right">
              <div className="mt-2 flex flex-col items-end gap-1">
                <span className="text-xs text-white px-2 py-1 bg-white/5 rounded-full">
                  Aspect: {gen.aspectRatio}
                </span>
              </div>
            </div>
          </div>

          {gen.productDescription && (
            <div className="mt-2">
              <p className="text-xs text-gray-500 mb-1">Description</p>
              <div className="text-sm text-gray-300 bg-white/3 p-2 rounded-md wrap-break-words">
                {gen.productDescription}
              </div>
            </div>
          )}

          {gen.userPrompt && (
            <div className="mt-2">
              <div className="text-xs text-gray-300">{gen.userPrompt}</div>
            </div>
          )}

          {!forComunity && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              <GhostButton
                className="text-xs justify-center"
                onClick={() => {
                  navigate(`/result/${gen.id}`);
                  window.scrollTo(0, 0);
                }}
              >
                View Details
              </GhostButton>

              <PrimaryButton
                onClick={() => togglePublish(gen.id)}
                className="text-xs justify-center rounded-md"
              >
                {gen.isPublished ? "Unpublish" : "Publish"}
              </PrimaryButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;