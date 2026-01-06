import { CheckCircle, Heart, Shield, Clock } from 'lucide-react'

export function About() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Care.xyz?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We are committed to making caregiving easy, secure, and accessible for everyone. 
            Our platform connects families with trusted, professional caregivers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Verified Caregivers</h3>
                  <p className="text-gray-600">
                    All our caregivers undergo thorough background checks and verification processes 
                    to ensure the safety and security of your loved ones.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Flexible Scheduling</h3>
                  <p className="text-gray-600">
                    Book care services according to your schedule - hourly, daily, or long-term arrangements. 
                    We adapt to your family's needs.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Heart className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Compassionate Care</h3>
                  <p className="text-gray-600">
                    Our caregivers are trained to provide not just professional care, but also 
                    emotional support and companionship to your family members.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Our Mission</h4>
              <p className="text-gray-600">
                To bridge the gap between families who need care services and professional caregivers, 
                creating a trusted platform that ensures quality, reliability, and peace of mind for everyone involved.
              </p>
            </div>
          </div>

          {/* Features List */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">What We Offer</h3>
            <div className="space-y-4">
              {[
                'Professional baby care and babysitting services',
                'Elderly care and companionship',
                'Specialized care for sick or recovering individuals',
                'Emergency care support available 24/7',
                'Transparent pricing with no hidden fees',
                'Easy online booking and payment system',
                'Regular updates and communication',
                'Insurance coverage for all services'
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}