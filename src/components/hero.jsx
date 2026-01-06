import Link from 'next/link'
import { ArrowRight, Shield, Clock, Users } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Trusted Care Services for Your
                <span className="text-blue-600"> Loved Ones</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Professional, reliable, and compassionate care services for children, elderly, and family members. 
                Book trusted caregivers with just a few clicks.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/#services"
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors group"
              >
                Book Care Service
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/#about"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-blue-600 hover:text-blue-600 transition-colors"
              >
                Learn More
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-2">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">100%</div>
                <div className="text-sm text-gray-600">Verified Caregivers</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-2">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">24/7</div>
                <div className="text-sm text-gray-600">Support Available</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-2">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">500+</div>
                <div className="text-sm text-gray-600">Happy Families</div>
              </div>
            </div>
          </div>

          {/* Banner Image */}
          <div className="relative">
            <div className="relative z-10 rounded-2xl shadow-2xl overflow-hidden h-[500px]">
              <img 
                src="https://lirp.cdn-website.com/6810ec4b/dms3rep/multi/opt/photoInsurance1-1920w.jpg"
                alt="Professional Care Services"
                className="w-full h-full object-cover"
              />
              {/* Overlay badge */}
              <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Certified Care</h3>
                    <p className="text-sm text-gray-600">Trusted Professionals</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-200 rounded-full opacity-50 blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-200 rounded-full opacity-30 blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  )
}