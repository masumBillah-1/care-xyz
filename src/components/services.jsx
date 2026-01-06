import Link from 'next/link'
import { Baby, Users, Stethoscope, ArrowRight } from 'lucide-react'

const services = [
  {
    id: 'baby-care',
    name: 'Baby Care Service',
    description: 'Professional babysitting and childcare services for your little ones. Our trained caregivers provide safe, nurturing care.',
    price: 150,
    icon: Baby,
    features: [
      'Experienced childcare professionals',
      'Background verified caregivers',
      'Age-appropriate activities',
      'Meal preparation and feeding',
      'Emergency care protocols',
      '24/7 support available'
    ],
    color: 'blue'
  },
  {
    id: 'elderly-care',
    name: 'Elderly Care Service',
    description: 'Compassionate care for elderly family members. Our caregivers provide assistance with daily activities and companionship.',
    price: 200,
    icon: Users,
    features: [
      'Trained elderly care specialists',
      'Medication management',
      'Mobility assistance',
      'Companionship and social interaction',
      'Personal hygiene assistance',
      'Health monitoring'
    ],
    color: 'green'
  },
  {
    id: 'sick-care',
    name: 'Sick People Care Service',
    description: 'Specialized care for individuals recovering from illness or managing chronic conditions. Professional medical support at home.',
    price: 250,
    icon: Stethoscope,
    features: [
      'Medically trained caregivers',
      'Post-operative care',
      'Chronic condition management',
      'Medication administration',
      'Physical therapy assistance',
      'Doctor coordination'
    ],
    color: 'purple'
  }
]

const colorClasses = {
  blue: {
    bg: 'bg-blue-50',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    button: 'bg-blue-600 hover:bg-blue-700'
  },
  green: {
    bg: 'bg-green-50',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    button: 'bg-green-600 hover:bg-green-700'
  },
  purple: {
    bg: 'bg-purple-50',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    button: 'bg-purple-600 hover:bg-purple-700'
  }
}

export function Services() {
  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Our Care Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from our range of professional care services designed to meet your family's specific needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const Icon = service.icon
            const colors = colorClasses[service.color]
            
            return (
              <div key={service.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className={`${colors.bg} p-6 rounded-t-xl`}>
                  <div className={`w-16 h-16 ${colors.iconBg} rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className={`h-8 w-8 ${colors.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="text-2xl font-bold text-gray-900">
                    ৳{service.price} <span className="text-sm font-normal text-gray-600">per hour</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Service Features:</h4>
                  <ul className="space-y-2 mb-6">
                    {service.features.slice(0, 4).map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2 flex-shrink-0"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Link
                    href={`/service/${service.id}`}
                    className={`w-full inline-flex items-center justify-center px-6 py-3 ${colors.button} text-white font-semibold rounded-lg transition-colors group`}
                  >
                    View Details & Book
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Need a custom care solution? We're here to help.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-blue-600 hover:text-blue-600 transition-colors"
          >
            Contact Us for Custom Care
          </Link>
        </div>
      </div>
    </section>
  )
}