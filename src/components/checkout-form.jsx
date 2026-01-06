'use client'

import { useState } from 'react'
import {
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js'
import { CreditCard, Lock } from 'lucide-react'
import toast from 'react-hot-toast'

export function CheckoutForm({ clientSecret, onSuccess, amount }) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)
    const loadingToast = toast.loading('Processing payment...')

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
        redirect: 'if_required'
      })

      if (error) {
        if (error.type === 'card_error' || error.type === 'validation_error') {
          toast.error(error.message || 'Payment failed', { id: loadingToast })
        } else {
          toast.error('An unexpected error occurred', { id: loadingToast })
        }
      } else {
        toast.success('Payment successful!', { id: loadingToast })
        onSuccess()
      }
    } catch (error) {
      toast.error('Payment processing failed', { id: loadingToast })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Security Notice */}
      <div className="flex items-center space-x-2 text-sm text-gray-600 bg-green-50 p-3 rounded-md">
        <Lock className="w-4 h-4 text-green-600" />
        <span>Your payment information is secure and encrypted</span>
      </div>

      {/* Payment Element */}
      <div className="p-4 border border-gray-200 rounded-md">
        <PaymentElement 
          options={{
            layout: 'tabs'
          }}
        />
      </div>

      {/* Payment Summary */}
      <div className="bg-blue-50 p-4 rounded-md">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-blue-900">Total Amount:</span>
          <span className="text-lg font-bold text-blue-900">৳{amount}</span>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <CreditCard className="w-5 h-5 mr-2" />
        {isLoading ? 'Processing...' : `Pay ৳${amount}`}
      </button>

      {/* Payment Methods Info */}
      <div className="text-center text-xs text-gray-500">
        <p>We accept all major credit and debit cards</p>
        <p className="mt-1">Powered by Stripe - Your payment is secure</p>
      </div>
    </form>
  )
}