import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import SpiralGallery from '../components/SpiralGallery/SpiralGallery'
import SeamlessIntegration from '../components/SeamlessIntegration'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <div className="app">
      <Navbar />
      <Hero />
      <SpiralGallery />
      <SeamlessIntegration />
      <Footer />
    </div>
  )
}
