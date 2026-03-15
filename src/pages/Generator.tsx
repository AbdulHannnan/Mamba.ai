import Title from "../components/Title"

const Generator = () => {
  return (
    <div className="min-h-screen text-white p-6 md-12 mt-22">
      <form className="max-w-4xl mx-auto mb-40">
      <Title  heading= 'Create the Mamba Image' description="Lets make something beast"/> 

      <div>
              <div><p>Left </p></div>
              <div><p>Right </p></div>
      </div>

      </form>
    </div>
  )
}

export default Generator
