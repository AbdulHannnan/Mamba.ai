import type {Project} from "../types"
import React, { useState, useEffect } from 'react';
import {dummyGenerations} from "../assets/assets"
import { Loader2Icon } from 'lucide-react';
import ProjectCard from '../components/ProjectCard';

const MyGeneration = () => {

  const [Generation , setGeneration] = useState<Project[]>([]);
  const [loading, setloading] = useState(true);

  const fetchMyGeneration = async () => {
  setTimeout(() => { setGeneration(dummyGenerations); setloading(false) }, 1000)
  }

  useEffect(() => {
   fetchMyGeneration();
  }, [])

  return loading ?(
     <div className='flex items-center justify-center min-h-screen'>
      <Loader2Icon className='size-7 animate-spin text-indigo-400'/>
    </div>
  ):(
     <div className = "min-h-screen text-white p-6 md:p-12 my-20">
      <div className='max-w-6xl mx-auto'>

        <header className='mb-12'>
          <h1 className='text-3xl md:text-4xl font-semibold mb-4'>My Generations</h1>
          <p className='text-gray-400'>This is My Generation page that are build with Full Stack Software Engineer Abdul Hannan </p>
        </header>

        {/* Generations list */}

        <div className='columns-1 sm:columns-2 lg:columns-3 gap-4'>
          {Generation.map((gen) => ( <div> <ProjectCard key={gen.id} gen={gen}  setGeneration={setGeneration}/>
           </div>))}
        </div>
      </div>
    </div>
  )
}

export default MyGeneration
