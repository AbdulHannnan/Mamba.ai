import React, { useState } from "react"; // Added useState import
import Title from "../components/Title";
import UploadZone from "../components/UploadZone";
import {  Loader2Icon, RectangleVerticalIcon, Wand2Icon } from "lucide-react";
import { RectangleHorizontalIcon } from "lucide-react";
import { PrimaryButton } from "../components/Buttons";

const Generator = () => {
  // Fixed typos from 'ocnst' to 'const'
  const [name, setname] = useState('');
  const [productName, setproductName] = useState('');
  const [productDescription, setproductDescription] = useState('');
  const [AspectRatio, setAspectRatio] = useState('9:16');
  
  // Fixed 'Fil' to 'File'
  const [ProductImage, setProductImage] = useState<File | null>(null);
  const [ModelImage, setModelImage] = useState<File | null>(null);
  const [userPrompt, setuserPrompt] = useState('');
  const [isGenerating, setisGenerating] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'product' | 'model') => {
    // Fixed .length[0] to .length > 0
    if (e.target.files && e.target.files.length > 0) {
      if (type === 'product') {
        setProductImage(e.target.files[0]);
      } else {
        setModelImage(e.target.files[0]);
      }
    } // Properly closed the if statement and function
  };

  const handleGenerate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen text-white p-6 md-12 mt-22">
      <form onSubmit={handleGenerate} className="max-w-4xl mx-auto mb-40">
        <Title heading='Create the Mamba Image' description="Lets make something beast" />

        <div className="flex gap-20 mx-sm:flex-col items-start justify-between">
          {/* left column */}
          <div className="flex flex-col w-full sm:max-w-60 gap-8 mt-8 mb-12">
            <UploadZone 
              label=" Product Image" 
              file={ProductImage} 
              onClear={() => setProductImage(null)} 
              onChange={(e) => handleFileChange(e, 'product')} 
            />
            <UploadZone 
              label=" Model Image" 
              file={ModelImage} 
              onClear={() => setModelImage(null)} 
              onChange={(e) => handleFileChange(e, 'model')} 
            />
          </div>

          {/* right column */}
          <div className="w-full">
            <div className="mb-4 text-gray-300">
              <label htmlFor="name" className="block text-sm mb-4">Project Name</label>
              <input type="text"  id="name" value={name} onChange={(e)=> setname(e.target.value)} placeholder="Name your Project" required className="w-full bg-white/3 rounded-lg border-2 p-4 text-sm border-voilet-200/10 focus:border-voilet-500/50 outline-none transition-all"/>
            </div>

          <div className="mb-4 text-gray-300">
              <label htmlFor="productName" className="block text-sm mb-4">Product Name</label>
              <input type="text"  id="productName" value={productName} onChange={(e)=> setproductName(e.target.value)} placeholder="Enter the Name of Product" required className="w-full bg-white/3 rounded-lg border-2 p-4 text-sm border-voilet-200/10 focus:border-voilet-500/50 outline-none transition-all"/>
            </div>


             <div className="mb-4 text-gray-300">
              <label htmlFor="productDescription" className="block text-sm mb-4">Product Description <span className="text-xs text-violet-400">optional</span></label>
              <textarea  id="productDescription" rows={4} value={productDescription} onChange={(e)=> setproductDescription(e.target.value)} placeholder="Enter the Description of the Product" className="w-full bg-white/3 rounded-lg border-2 p-4 text-sm border-voilet-200/10 focus:border-voilet-500/50 outline-none resize-none transition-all"/>
            </div>


            <div className="mb-4 text-gray-300">
              <label className="block text-sm mb-4">Aspect Ratio</label>
              <div className="flex gap-3">
               <RectangleVerticalIcon onClick={()=> setAspectRatio(`9:16`)} className={`p-2.5 size-13 bg-white/6 rounded transition-all ring-2 ring-transparent cursor-pointer ${AspectRatio === '9:16' ? 'ring-violet-500/50 bg-white/10 ' : ''}`} />

                <RectangleHorizontalIcon onClick={()=> setAspectRatio(`16:9`)} className={`p-2.5 size-13 bg-white/6 rounded transition-all ring-2 ring-transparent cursor-pointer ${AspectRatio === '16:9' ? 'ring-violet-500/50 bg-white/10 ' : ''}`} />
              </div>
            </div>


               <div className="mb-4 text-gray-300">
              <label htmlFor="userPrompt" className="block text-sm mb-4">User Prompt  <span className="text-xs text-violet-400">optional</span></label>
              <textarea  id="userPrompt" rows={4} value={userPrompt} onChange={(e)=> setuserPrompt(e.target.value)} placeholder="Describe the image you want to be" className="w-full bg-white/3 rounded-lg border-2 p-4 text-sm border-voilet-200/10 focus:border-voilet-500/50 outline-none resize-none transition-all"/>
            </div>

            </div>
        </div>

        <div className="flex justify-center  mt-10">
          <PrimaryButton disabled={isGenerating} className="px-10 py-3 rounded-md disabled:opacity-70 disabled:cursor-not-allowed"> {isGenerating ? (<><Loader2Icon className="size-5 animate-spin"/>Generating...</>) : (<> <Wand2Icon className="size-5" /> Generate Image </>)} </PrimaryButton>
        </div>

      </form>
    </div>
  );
};

export default Generator;