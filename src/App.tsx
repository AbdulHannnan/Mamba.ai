import Navbar from './components/Navbar';
import Home from './pages/Home';
import SoftBackdrop from './components/SoftBackdrop';
import Footer from './components/Footer';
import LenisScroll from './components/lenis';
import { Route, Routes } from 'react-router-dom';
import Generator from './pages/Generator';
import Community from './pages/Community';
import Results from './pages/Results';
import MyGeneration from './pages/MyGeneration';
import Plans from './pages/Plans';
import Loading from './pages/Loading';

function App() {
	return (
		<>
			<SoftBackdrop />
			<LenisScroll />
			<Navbar />
			<Routes>	
			<Route path="/" element={<Home />} />
			<Route path="/generate" element={<Generator />} />
			<Route path="/community" element={<Community />} />
			<Route path="/results:projectId" element={<Results />} />
			<Route path="/mygenerations" element={<MyGeneration />} />
			<Route path="/plans" element={<Plans />} />
			<Route path="/loading" element={<Loading />} />
			
			
			</Routes>
			<Footer />
		</>
	);
}
export default App;