import Title from "../components/Title"
import UploadZone from "../components/UploadZone"


const Generator = () => {
  return (
    <div className="min-h-screen text-white p-6 md-12 mt-22">
      <form className="max-w-4xl mx-auto mb-40">
      <Title  heading= 'Create the Mamba Image' description="Lets make something beast"/> 

      <div className="flex gap-20 mx-sm:flex-col items-start justify-between">

        {/* left column */}
              <div className="flex flex-col w-full sm:max-w-60 gap-8 mt-8 mb-12">
             
            <UploadZone label=" Product Image" file={} onClear={} onChange={}/>
                
                </div>


          {/* right column     */}
              <div><p>Right </p></div>
      </div>

      </form>
    </div>
  )
}

export default Generator
