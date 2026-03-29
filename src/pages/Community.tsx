import  { useEffect, useState } from 'react'
import type { Project } from '../types';
import { dummyGenerations } from '../assets/assets';
import { div } from 'framer-motion/client';
import { Loader2Icon } from 'lucide-react';

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
      <div className='max-w-6xl mx-auto'></div>

    </div>
  )
}

export default Community
