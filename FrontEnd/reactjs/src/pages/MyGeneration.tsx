import type {Project} from "../types"
import { useState, useEffect } from 'react';
import { Loader2Icon } from 'lucide-react';
import ProjectCard from '../components/ProjectCard';
import { PrimaryButton } from "../components/Buttons";
import { useAuth, useUser } from "@clerk/react";
import { useNavigate } from "react-router-dom";
import api from "../configs/axios";
import toast from "react-hot-toast";

const MyGeneration = () => {

  const {user, isLoaded} = useUser()
  const {getToken} = useAuth()
  const navigate = useNavigate()



  const [Generation , setGeneration] = useState<Project[]>([]);
  const [loading, setloading] = useState(true);

  const fetchMyGeneration = async () => {
  try {
        const token = await getToken();
        const {data} = await api.get('/api/user/projects' , {
          headers : {Authorization: `Bearer ${token}`}
        })
        setGeneration(data.projects)
        setloading(false)
  } catch (error : any) {
    toast.error(error?.response?.data?.message || error.message);
    console.log(error)
  }
  }

  useEffect(() => {
    if(user){
 fetchMyGeneration();
    }else if(isLoaded && !user){
      navigate('/')
    }
 }, [user])

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

            {Generation.length == 0 &&(
              <div className="text-center py-20 bg-white/5 rounded-xl border border-white/10 ">
                <h3 className="text-xl font-medium mb-2"> No Gernation Yet </h3>
                <p className="text-gray-400 mb-6 ">There is no Generation Cuurrently </p>
                <PrimaryButton onClick={()=> window.location.href = '/generate'}>Create new Generations </PrimaryButton>
              </div>
            )}

      </div>
    </div>
  )
}

export default MyGeneration
