import { UploadIcon, X as XIcon } from "lucide-react"; // Import XIcon correctly
import type { UploadZoneProps } from "../types";

const UploadZone = ({ label, file, onClear, onChange }: UploadZoneProps) => {
  return (
    <div className="relative group">
      <div
        className={`relative h-64 rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center bg-white/5 p-6 ${
          file ? "border-green-500" : "border-gray-500 group-hover:border-gray-300"
        }`}
      >
        {file ? (
          <>
            {/* Fixed inset-0 and h-full */}
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              className="absolute inset-0 w-full h-full object-cover rounded-xl opacity-60"
            />

            {/* Fixed inset-0 and items-center */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-xl backdrop-blur-sm">
              <button
                type="button"
                onClick={onClear} // Added =
                className="p-2 rounded-full bg-white/10 hover:bg-red-500/20 text-white hover:text-red-400 transition-colors"
              >
                <XIcon className="w-6 h-6" /> {/* Fixed syntax and capitalization */}
              </button>
            </div>

            <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-md p-3 rounded-lg border border-white/10 ">
              <p className="text-white text-lg font-semibold truncate ">
                {file.name}
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 ">
              <UploadIcon className="w-8 h-8 text-gray-400 group-hover:text-violet-400 transition-colors " />
            </div>
            <h3 className="text-lg font-semibold mb-2 ">{label}</h3>
            <p className=" text-sm text-gray-400 text-center max-w-[200px] ">
              Drag and drop your file here or click to Upload
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={onChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default UploadZone;