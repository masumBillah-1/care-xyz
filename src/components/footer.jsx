import Link from 'next/link'
import { Heart, Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">Care.xyz</span>
            </div>
            <p className="text-gray-300 mb-4">
              Providing reliable and trusted care services for children, elderly, and family members. 
              Making caregiving easy, secure, and accessible for everyone.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300">+880 1234-567890</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300">info@care.xyz</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300">Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#services" className="text-gray-300 hover:text-white transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="text-gray-300 hover:text-white transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="text-gray-300 hover:text-white transition-colors">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li className="text-gray-300">Baby Care Service</li>
              <li className="text-gray-300">Elderly Care Service</li>
              <li className="text-gray-300">Sick People Care Service</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © 2024 Care.xyz. All rights reserved. Made with ❤️ for better care services.
          </p>
        </div>
      </div>
    </footer>
  )
}