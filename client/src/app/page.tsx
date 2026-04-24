import { Navbar } from "@/components/shared/Navbar"
import { Footer } from "@/components/shared/Footer"
import { HeroSection } from "@/components/sections/HeroSection"
import { ProblemSection } from "@/components/sections/ProblemSection"
import { ProductWalkthrough } from "@/components/sections/ProductWalkthrough"
import { ResumeVersioningSection } from "@/components/sections/ResumeVersioningSection"

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ProblemSection />
        <ProductWalkthrough />
        <ResumeVersioningSection />
      </main>
      <Footer />
    </>
  )
}
