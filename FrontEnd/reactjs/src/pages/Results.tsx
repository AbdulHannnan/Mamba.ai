import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { Project } from "../types";
import { ImageIcon, Loader2Icon, RefreshCwIcon, SparkleIcon, VideoIcon } from "lucide-react";
import { GhostButton, PrimaryButton } from "../components/Buttons";
import { useAuth, useUser } from "@clerk/react";
import api from "../configs/axios";
import toast from "react-hot-toast";

const Results = () => {
  const { projectId } = useParams();
  const {getToken} = useAuth();
  const {user , isLoaded} = useUser();
  const navigate = useNavigate();

  const [projectData, setProjectData] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchProjectData = async () => {
  if (!projectId) return;

  setLoading(true);

  try {
    const token = await getToken();

    const { data } = await api.get(`api/user/projects/${projectId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setProjectData(data.project);
    setIsGenerating(data.project.isGenerating);
  } catch (error: any) {
    toast.error(error?.response?.data?.message || error.message);
    console.log(error);
  } finally {
    setLoading(false);
  }
};

const handleGenerateVideo = async () => {
  setIsGenerating(true);

  try {
    const token = await getToken();

    const { data } = await api.post(
      "api/project/video",
      { projectId },
      {
        headers: {
         Authorization: `Bearer ${token}`,
        },
      }
    );

    const videoUrl = data.generatedVideo;

    setProjectData((prev) =>
      prev
        ? {
            ...prev,
            generatedVideo: videoUrl,
            isGenerating: false,
          }
        : prev
    );

    toast.success(data.message || "Video generated successfully");
    setIsGenerating(false);
  } catch (error: any) {
    toast.error(error?.response?.data?.message || error.message);
    console.log(error);
    setIsGenerating(false);
  }
};

useEffect(() => {
  if (user && projectId) {
    fetchProjectData();
  } else if (isLoaded && !user) {
    navigate("/");
  }
}, [user, isLoaded, projectId, navigate]);
  // Fetch Project in Every 10 secounds 
  useEffect(()=>{
    if(user && isGenerating){
      const interval = setInterval(()=> {
        fetchProjectData()
      }, 10000)
      return ()=> clearInterval(interval)
    }
  }, [user, isGenerating ])

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2Icon className="animate-spin size-9 text-indigo-500" />
      </div>
    );
  }

  if (!projectData) {
    return (
      <div className="min-h-screen text-white p-6 md:p-12 mt-20">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl font-semibold mb-4">Project not found</h1>
          <Link to="/mygenerations" className="text-indigo-400 hover:underline">
            Back to My Generations
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white p-6 md:p-12 mt-20">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-medium">{projectData.productName}</h1>

          <Link to="/generate" className="btn-secondery text-sm flex items-center gap-2">
            <RefreshCwIcon className="w-4 h-4" />
            <p>New generation</p>
          </Link>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel inline-block p-2 rounded-2xl">
              <div
                className={`${
                  projectData.aspectRatio === "9:16" ? "aspect-9/16" : "aspect-video"
                } sm:max-h-200 rounded-xl bg-gray-900 overflow-hidden relative`}
              >
                {projectData.generatedVideo ? (
                  <video
                    src={projectData.generatedVideo}
                    controls
                    autoPlay
                    loop
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={projectData.generatedImage}
                    alt={projectData.productName}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="text-xl font-semibold mb-4">Action</h3>

              <div className="flex flex-col gap-3">
                {projectData.generatedImage && (
                  <a href={projectData.generatedImage} download>
                    <GhostButton className="w-full justify-center rounded-md py-3">
                      <ImageIcon className="size-4.5" />
                      <p>Download Image</p>
                    </GhostButton>
                  </a>
                )}

                {projectData.generatedVideo && (
                  <a href={projectData.generatedVideo} download>
                    <GhostButton className="w-full justify-center rounded-md py-3">
                      <VideoIcon className="size-4.5" />
                      <p>Download Video</p>
                    </GhostButton>
                  </a>
                )}
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="text-xl font-semibold mb-3">Prompt</h3>
              <p className="text-gray-300 text-sm">{projectData.userPrompt}</p>
            </div>

                {/* Generate video button */}
                <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <VideoIcon  className="size-24" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Video Magic</h3>
                  <p className="text-gray-400 text-sm mb-6">Generate the video</p>
                  {!projectData.generatedVideo ? (
                    <PrimaryButton onClick={handleGenerateVideo}disabled={isGenerating} className="w-full">
                      {isGenerating ? (
                        <> Generating Video  </>
                      ) : (<> <SparkleIcon className="size-4.5" />generate video </> )}
                     </PrimaryButton>
                  ) : ( <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-center text-sm font-medium">Video generated Succesfuly</div>)}
                </div>


          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;