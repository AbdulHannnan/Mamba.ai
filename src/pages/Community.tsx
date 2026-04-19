import  { useEffect, useState } from 'react'
import type { Project } from '../types';
import { dummyGenerations } from '../assets/assets';
import { div } from 'framer-motion/client';
import { Loader2Icon } from 'lucide-react';
import ProjectCard from '../components/ProjectCard';

const Community = () => {
  const [Projects , setProjects] = useState<Project[]>([]);
  const [Loading, setLoading] = useState(true);

  const fetchProjects = async () => {
  setTimeout(() => { setProjects(dummyGenerations); setLoading(false) }, 3000)
  }

  useEffect(() => {
    fetchProjects();
  }, [])

  return Loading ?(
    <div className='flex items-center justify-center min-h-screen'>
      <Loader2Icon className='size-7 animate-spin text-indigo-400'/>
    </div>
  ) : (

    <div className='min-h-screen text-white p-6 md:p-12 my-20'>
      <div className='max-w-6xl mx-auto'>

        <header className='mb-12'>
          <h1 className='text-3xl md:text-4xl font-semibold mb-4'>Community</h1>
          <p className='text-gray-400'>This is community page that are build with Full Stack Software Engineer Abdul Hannan </p>
        </header>

        {/* projectlist */}

        <div className='columns-1 sm:columns-2 lg:columns-3 gap-4'>
          {Projects.map((project) => ( <div> <ProjectCard key={project.id} gen={project}  setGen={setProjects} forComunity={true}/> </div>))}
        </div>
      </div>
    </div>
  )
}

export default Community
