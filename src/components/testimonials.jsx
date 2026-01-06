import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: 'Sarah Ahmed',
    location: 'Dhaka',
    service: 'Baby Care Service',
    rating: 5,
    comment: 'Care.xyz provided excellent babysitting service for my 2-year-old. The caregiver was professional, caring, and my daughter loved spending time with her. Highly recommended!',
    image: '/images/testimonial-1.jpg'
  },
  {
    id: 2,
    name: 'Mohammad Rahman',
    location: 'Chittagong',
    service: 'Elderly Care Service',
    rating: 5,
    comment: 'My elderly father needed daily care assistance, and Care.xyz connected us with a wonderful caregiver. The service is reliable, and the caregiver treats my father with respect and kindness.',
    image: '/images/testimonial-2.jpg'
  },
  {
    id: 3,
    name: 'Fatima Khan',
    location: 'Sylhet',
    service: 'Sick People Care Service',
    rating: 5,
    comment: 'After my mother\'s surgery, we needed professional home care. The caregiver from Care.xyz was knowledgeable about post-operative care and helped my mother recover comfortably at home.',
    image: '/images/testimonial-3.jpg'
  }
]

const stats = [
  { number: '500+', label: 'Happy Families' },
  { number: '1000+', label: 'Care Hours Provided' },
  { number: '50+', label: 'Verified Caregivers' },
  { number: '4.9/5', label: 'Average Rating' }
]

export function Testimonials() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Families Across Bangladesh
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            See what our satisfied customers have to say about our care services.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-gray-50 rounded-xl p-6 relative">
              <div className="absolute top-4 right-4">
                <Quote className="h-8 w-8 text-blue-200" />
              </div>
              
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg mr-4">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.location}</p>
                </div>
              </div>

              <div className="flex items-center mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
              </div>

              <p className="text-gray-700 mb-4 leading-relaxed">
                "{testimonial.comment}"
              </p>

              <div className="text-sm text-blue-600 font-medium">
                {testimonial.service}
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-blue-50 rounded-2xl p-8 lg:p-12">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              Ready to Experience Quality Care?
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Join hundreds of satisfied families who trust Care.xyz for their care needs. 
              Book your service today and experience the difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/#services"
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Book Care Service Now
              </a>
              <a
                href="/auth/register"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
              >
                Create Account
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}