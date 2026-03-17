import type { UploadZoneProps } from "../types"

const UploadZone = ({label , file , onClear , onChange} : UploadZoneProps) => {
  return (
    <div className="relative group">

        <div className={`relative h-64 rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center bg-white/2 p-6 ${file ? "border-green-500" : "border-gray-500 group-hover:border-gray-300"}`}>

        {file ? (
            <> 
            <img src={URL.createObjectURL(file)} alt="preview" className="absolute insert-0 w-full h-fll object-cover rounded-xl opacity-60 " />
            <div>
                <button>
                    <XIcon/>
                </button>
            </div>
            </>
        ): (
            <></>
        )}
        
        </div>
      
    </div>
  )
}

export default UploadZone
