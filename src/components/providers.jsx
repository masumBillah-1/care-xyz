'use client'

import { SessionProvider } from 'next-auth/react'
import AuthProvider from '@/contexts/AuthProvider'

export function Providers({ children }) {
  return (
    <SessionProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </SessionProvider>
  )
}