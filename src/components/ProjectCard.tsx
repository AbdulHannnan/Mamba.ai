import type React from "react"
import type { Project } from "../types"
import { useNavigate } from "react-router-dom"
import { useState } from "react";
// DELETED: import { img } from "framer-motion/client"; (Used standard <img> tag instead)
import { Loader2Icon } from "lucide-react";
import { div } from "framer-motion/client";

function ProjectCard({ gen, setGen, forComunity = false }: { gen: Project, setGen: React.Dispatch<React.SetStateAction<Project[]>>, forComunity?: boolean }) {

    const navigate = useNavigate();
    const [menueOpen, setMenueOpen] = useState(false);

    return (
        <div key={gen.id} className="mb-4 break-inside-avoid">
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition group relative">
                
                {/* 1. Preview Container */}
                {/* FIX: Use aspect-[9/16] (arbitrary value syntax) if you need that specific ratio in older Tailwind, or use aspect-video */}
                <div className={`${gen?.aspectRatio === '9:16' ? `aspect-[9/16]` : `aspect-video`} relative overflow-hidden bg-black/20`}>
                    
                    {/* 2. Main Media (Image/Video) */}
                    {gen.generatedImage && (
                        <img 
                            src={gen.generatedImage} 
                            alt={gen.productName} 
                            // FIX: Changed 'insert-0' to 'inset-0' so it fills the container. 
                            // FIX: Added 'h-full' to ensure proper display.
                            className={`absolute inset-0 w-full h-full object-cover transition duration-500 ${gen.generatedVideo ? 'group-hover:opacity-0' : 'group-hover:scale-105'}`} 
                        />
                    )}

                    {gen.generatedVideo && (
                        <video 
                            src={gen.generatedVideo} 
                            muted 
                            loop 
                            playsInline 
                            // FIX: Changed 'insert-0' to 'inset-0'. 
                            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition duration-500" 
                            onMouseEnter={(e) => { e.currentTarget.play() }}
                            onMouseLeave={(e) => { e.currentTarget.pause() }} 
                        />
                    )}

                    {(!gen.generatedImage && !gen.generatedVideo) && (
                        // FIX: Changed 'insert-0' to 'inset-0'.
                        <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-black/20"> 
                            <Loader2Icon className="size-7 animate-spin text-white/50" /> 
                        </div>
                    )}

                    {/* 3. Status Badges (Top Left) */}
                    {/* FIX: Removed nested content. This container is now ONLY for the top-left badges. */}
                    <div className="absolute left-3 top-3 flex gap-2 items-center pointer-events-none">
                        {gen.isGenerating && (
                            <span className="text-[10px] px-2 py-1 bg-yellow-600/50 backdrop-blur-sm rounded-full text-white">Generating</span>
                        )}
                        {gen.isPublished && (
                            <span className="text-[10px] px-2 py-1 bg-green-600/50 backdrop-blur-sm rounded-full text-white">Published</span>
                        )}
                    </div>

                    {/* 4. Small Circles (Bottom Right) */}
                    {/* FIX: Moved this container completely OUTSIDE the "Status Badge" container. 
                        It is now properly positioned in the bottom-right corner. */}
                    <div className="absolute right-3 bottom-3 flex items-center">
                        {/* FIX: Added optional chaining (?) in case uploadImages is missing. */}
                        {gen.uploadImages?.[0] && (
                            <img 
                                src={gen.uploadImages[0]} 
                                alt="Product Source" 
                                // FIX: Defined size (w-12 h-12), made it object-cover, and added border/shadow for visibility.
                                className="w-12 h-12 object-cover rounded-full border-2 border-white/20 shadow-xl" 
                            />
                        )}
                        {gen.uploadImages?.[1] && (
                            <img 
                                src={gen.uploadImages[1]} 
                                alt="Model Source" 
                                className="w-12 h-12 object-cover rounded-full border-2 border-white/20 shadow-xl -ml-6" 
                            />
                        )}
                    </div>

                </div>

                {/* 5. Details Section (Simplified for display) */}
                <div className="p-3">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                    <h3 className="font-medium text-lg mb-1">{gen.productName}</h3>
                    <p className="text-sm text-gray-400">Created : {new Date(gen.createdAt).toLocaleDateString()}</p>
                    {gen.updatedAt && (
                        <p className="text-xs text-gray-500 mt-1">Updated : {new Date(gen.updatedAt).toLocaleDateString()}</p>
                    )}
                </div>

                    <div className="text-right ">
                        <div className="mt-2 flex flex-col items-end gap-1">
                            <span className="text-xs text-white px-2 py-1 bg-white/5 rounded-full">Aspect : {gen.aspectRatio}</span>
                        </div>
                    </div>
               </div>

                        {/* Product Description */}
                        {gen.productDescription && (
                            <div className="mt-2">
                                <p className="text-xs text-gray-500 mb-1">Description </p>
                                <div className="text-sm text-gray-300 bg-white/3 p-2 rounded-md wrap-break-word ">{gen.productDescription}</div>
                            </div>
                        )}


                        {/* USer Prompt */}

                          {gen.userPrompt && (
                            <div className="mt-2">
                               
                                  <div className="text-xs text-gray-300">{gen.userPrompt}</div>
                            </div>
                        )}

                </div>
            </div> 
        </div>
    )
}

export default ProjectCard