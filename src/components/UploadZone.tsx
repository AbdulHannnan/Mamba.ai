import type { UploadZoneProps } from "../types"

const UploadZone = ({label , file , onClear , onChange} : UploadZoneProps) => {
  return (
    <div className="relative group">

        <div className={`relative h-64 rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center bg-white/2 p-6 ${file ? "border-green-500" : "border-gray-500 group-hover:border-gray-300"}`}>

        {file ? (
            <> 
            <img src={URL.createObjectURL(file)} alt="preview" className="absolute insert-0 w-full h-fll object-cover rounded-xl opacity-60 " />

            <div className="absolute insert-0 flex itenms-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-xl backdrop-blur-sm">
                <button type="button" onClick{onClear} className="p-2 rounded-full bg-white/10 hover:bg-red-500/20 text-white hover:text-red-400 transition-colors">
                    <XIcon className="W-6 h-6/>
                </button>
            </div>

            <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-md p-3 rounded-lg border border-white/10 ">
                <p className="text-white text-lg font-semibold">{file.name}</p>
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
