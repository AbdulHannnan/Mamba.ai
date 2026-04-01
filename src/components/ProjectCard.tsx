import type React from "react"
import type { Project } from "../types"
import { useNavigate } from "react-router-dom"
import { useState } from "react";
import { img } from "framer-motion/client";


function ProjectCard({gen , setGen , forComunity = false } : {gen : Project , setGen:React.Dispatch<React.SetStateAction<Project[]>> , forComunity?:boolean}) {

     const navigate = useNavigate();
     const [menueOpen , setMenueOpen] = useState(false); 
    
  return (
    <div key={gen.id} className="mb-4 break-inside-avoid">
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition group  ">
        
        
        {/* preview */}

        <div className={`${gen?. aspectRatio ==='9:17' ? `aspect-9/16` : `aspect-video`} relative overdlow-hidden `}>

            {gen.generatedImage && ( <img src={gen.generatedImage} alt={gen.productName} className={`absolute insert-0 w-full object-cover transition duration-500 ${gen.generatedVideo ? 'hover:opacity-0' : 'group-hover:scale-105'}`} /> )}


            {gen.generatedVideo && (<video src={gen.generatedVideo} muted loop playsInline className="absolute insert-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition duration-500 " onMouseEnter={(e)=>{e.currentTarget.play()}}
                onMouseLeave={(e)=>{e.currentTarget.pause()}}   
                />)}

        </div>


        {/* details  */}
        <div></div>
        
        </div> 
      
    </div>
  )
}

export default ProjectCard
