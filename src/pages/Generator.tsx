import React, { useState } from "react"; // Added useState import
import Title from "../components/Title";
import UploadZone from "../components/UploadZone";

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
            <div className="mb-4 ">
              <label htmlFor="name" className="block text-sm mb-4">Prodject Name</label>
              <input type="text"  id="name" value={name} onCanPlay={(e)=> setname(e.target.value)} placeholder="Name your Project" required className="w-full bg-white/3 rounded-lg border-2 p-4 text-sm border-voilet-200/10 focus:border-voilet-500/50 outline-none transition-all"/>
            </div>

          <div className="mb-4 text-gray-300">
              <label htmlFor="productName" className="block text-sm mb-4">Product Name</label>
              <input type="text"  id="productName" value={productName} onCanPlay={(e)=> setproductName(e.target.value)} placeholder="Enter the Name of Product" required className="w-full bg-white/3 rounded-lg border-2 p-4 text-sm border-voilet-200/10 focus:border-voilet-500/50 outline-none transition-all"/>
            </div>


             <div className="mb-4 text-gray-300">
              <label htmlFor="productDescription" className="block text-sm mb-4">Product Description <span className="text-xs text-violet-400">optional</span></label>
              <textarea  id="productDescription" rows={4} value={productDescription} onChange={(e)=> setproductDescription(e.target.value)} placeholder="Enter the Description of the Product" className="w-full bg-white/3 rounded-lg border-2 p-4 text-sm border-voilet-200/10 focus:border-voilet-500/50 outline-none resize-none transition-all"/>

            </div>


            </div>
        </div>
      </form>
    </div>
  );
};

export default Generator;