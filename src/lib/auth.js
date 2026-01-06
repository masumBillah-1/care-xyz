import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { userCollection } from '@/lib/db.connect'
import bcrypt from 'bcryptjs'

export const authOptions = {
  providers: [
    // Only add Google provider if credentials are configured
    ...(process.env.GOOGLE_CLIENT_ID && 
        process.env.GOOGLE_CLIENT_ID !== 'your-google-client-id-from-console' ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      })
    ] : []),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const user = await Promise.race([
            (await userCollection()).findOne({
              email: credentials.email
            }),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Database query timeout')), 10000)
            )
          ])

          if (!user || !user.password) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/auth/login'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id
      }
      return session
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          // Check if user exists in MongoDB with timeout
          const existingUser = await Promise.race([
            (await userCollection()).findOne({ email: user.email }),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Database query timeout')), 10000)
            )
          ])
          
          if (!existingUser) {
            // Create new user for Google sign-in
            const newUser = {
              name: user.name,
              email: user.email,
              image: user.image,
              provider: 'google',
              createdAt: new Date(),
              updatedAt: new Date()
            }
            
            const result = await Promise.race([
              (await userCollection()).insertOne(newUser),
              new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Database insert timeout')), 10000)
              )
            ])
            user.id = result.insertedId.toString()
          } else {
            user.id = existingUser._id.toString()
          }
          
          return true
        } catch (error) {
          console.error('Error during Google sign-in:', error)
          return false
        }
      }
      return true
    }
  }
}