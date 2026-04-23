import { useEffect, useState } from "react";
import type { Project } from "../types";
import { dummyGenerations } from "../assets/assets";
import { Loader2Icon } from "lucide-react";

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
    <div></div>
  )
}

export default Results
