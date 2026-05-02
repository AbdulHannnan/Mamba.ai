import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { Project } from "../types";
import { dummyGenerations } from "../assets/assets";
import { ImageIcon, Loader2Icon, RefreshCwIcon, VideoIcon } from "lucide-react";
import { GhostButton } from "../components/Buttons";

const Results = () => {
  const { projectId } = useParams();

  const [projectData, setProjectData] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProjectData = async () => {
    setLoading(true);

    setTimeout(() => {
      const foundProject = dummyGenerations.find((project) => project.id === projectId);
      setProjectData(foundProject || null);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    fetchProjectData();
  }, [projectId]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2Icon className="animate-spin size-9 text-indigo-400" />
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;