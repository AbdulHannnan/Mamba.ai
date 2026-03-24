import Title from "../components/Title"
import UploadZone from "../components/UploadZone"


const Generator = () => {

  ocnst [name , setname ] = useState('')
  const [productName , setproductName ] = useState('')
  const [productDescription , setproductDescription ] = useState('')
  const [AspectRatio , setAspectRatio ] = useState('9:16')
  const [ProductImage , setProductImage ] = useState<Fil | null >(null)
  const [ModelImage , setModelImage ] = useState<Fil | null >(null)
    ocnst [userPrompt , setuserPrompt ] = useState('')
    ocnst [isGenerating , setisGenerating ] = useState(false)

    const handleFileChange = (e : React.ChangeEvent<HTMLInputElement> , type : 'product' | 'model') =>{
      if(e.target.files && e.target.files.length[0]){
        if(type === 'product') setProductImage(e.target.files[0]);
        else setModelImage(e.target.files[0]);
        {
}

const handleGenerate = async (e : React.FormEvent<HTMLFormElement>) =>{
  e.preventDefault();

}

  return (
    <div className="min-h-screen text-white p-6 md-12 mt-22">
      <form onSubmit={handleGenerate} className="max-w-4xl mx-auto mb-40">
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
