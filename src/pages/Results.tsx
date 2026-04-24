import { useEffect, useState } from "react";
import type { Project } from "../types";
import { dummyGenerations } from "../assets/assets";
import { Loader2Icon, RefreshCwIcon } from "lucide-react";
import { img } from "framer-motion/client";

const Results = () => {

  const [projectData, setProjectData] = useState<Project>({} as Project);
  const [loading, setLoading] = useState(true);
  const [isgenerating, setIsGenerating] = useState(false);

  const fetchProjectData = async () => {
    setTimeout(() => {
      setProjectData(dummyGenerations[1])
      setLoading(false);
    }, 3000)
  }

  useEffect(() => {
    fetchProjectData();
  },[])

  return loading ?  (
    <div className="h-screen w-full flex items-center justify-center">
      <Loader2Icon className="animate-spin size-9 text-indigo" />
      
    </div>
  ) : (
    <div className="min-h-screen text-white p-6 md:p-12 mt-20">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-medium ">Gererato</h1>
          <link to="/generate" className="btn-secondery text-sm flex items-center gap-2">
          <RefreshCwIcon className="w-h h-4 " />
          <p>New generation</p>
          </link>
        </header>

        {/* {gril} */}
       <div className="grid lg:grid-cols-3 gap-8">
  {/* Main Result Display */}
  <div className="lg:col-span-2 space-y-6">
    <div className="glass-panel inline-block p-2 rounded-2xl">
      <div className={`${projectData?.aspectRatio === "9:16" ? 'aspect-[9/16]' : 'aspect-video'} sm:max-h-200 rounded-xl bg-gray-900 overflow-hidden relative`}>
        {projectData?.generatedVideo ? (
          <video 
            src={projectData.generatedVideo} 
            controls 
            autoPlay 
            loop 
            className="w-full h-full object-cover"
          />
        ) : (
          <img 
            src={projectData?.generatedImage} 
            alt="Generated content"
            className="w-full h-full object-cover" 
          />
        )}
      </div>
    </div>
  </div>

  {/* Sidebar Action */}
  <div className="lg:col-span-1">
     {/* Content goes here */}
  </div>
</div>

      </div>

    </div>
  )
}

export default Results
