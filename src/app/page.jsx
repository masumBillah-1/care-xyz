import { Hero } from '@/components/hero'
import { About } from '@/components/about'
import { Services } from '@/components/services'
import { Testimonials } from '@/components/testimonials'

export default function Home() {
  return (
    <div>
      <Hero />
      <About />
      <Services />
      <Testimonials />
    </div>
  )
}