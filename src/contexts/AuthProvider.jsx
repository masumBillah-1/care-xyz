import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  sendPasswordResetEmail, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut 
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { FallbackStorage } from '../lib/fallback-storage';
import toast from 'react-hot-toast';

const googleProvider = new GoogleAuthProvider()

const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null)
  const [mongoUser, setMongoUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Firebase Email/Password Registration
  const registerUser = async (email, password, userData = {}) => {
    setLoading(true)
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      
      // Try to save to MongoDB, but don't fail registration if it doesn't work
      try {
        await saveUserToMongoDB({
          uid: result.user.uid,
          email: result.user.email,
          name: userData.name || '',
          contact: userData.contact || '',
          nidNo: userData.nidNo || '',
          provider: 'email',
          createdAt: new Date(),
          updatedAt: new Date()
        })
      } catch (mongoError) {
        console.warn('MongoDB sync failed during registration:', mongoError)
        // Don't throw error, Firebase registration was successful
      }
      
      return result
    } catch (error) {
      throw error
    }
  }

  // Firebase Email/Password Sign In
  const signInUser = (email, password) => {
    setLoading(true)
    return signInWithEmailAndPassword(auth, email, password)
  }

  // Firebase Google Sign In with MongoDB sync
  const signInGoogle = async () => {
    setLoading(true)
    try {
      console.log('🔑 Starting Google sign-in...')
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user
      
      console.log('🔑 Google sign-in successful for:', user.email)
      
      // Try to sync with MongoDB, but don't fail if it doesn't work
      try {
        const existingUser = await checkUserInMongoDB(user.email)
        
        if (!existingUser) {
          console.log('👤 New Google user, saving to MongoDB:', user.email)
          // New user - try to save to MongoDB
          const saveResult = await saveUserToMongoDB({
            uid: user.uid,
            email: user.email,
            name: user.displayName || '',
            image: user.photoURL || '',
            provider: 'google',
            createdAt: new Date(),
            updatedAt: new Date()
          })
          
          if (saveResult?.fallback) {
            toast.success('Welcome to Care.xyz! (Working offline)')
          } else if (saveResult?.success) {
            toast.success('Welcome to Care.xyz!')
          } else {
            toast.success('Welcome to Care.xyz! (Data saved locally)')
          }
        } else {
          console.log('👤 Existing Google user:', user.email)
          toast.success('Welcome back!')
        }
      } catch (mongoError) {
        console.warn('❌ MongoDB sync failed, but Firebase auth succeeded:', mongoError)
        // Still save to localStorage
        FallbackStorage.saveUser({
          uid: user.uid,
          email: user.email,
          name: user.displayName || '',
          image: user.photoURL || '',
          provider: 'google',
          createdAt: new Date(),
          updatedAt: new Date()
        })
        toast.success('Signed in successfully! (Working offline)')
      }
      
      return result
    } catch (error) {
      console.error('❌ Google sign-in failed:', error)
      throw error
    }
  }

  // Password Reset
  const forgetPassword = (email) => {
    return sendPasswordResetEmail(auth, email)
  }

  // Logout
  const logOut = () => {
    setLoading(true)
    return signOut(auth)
  }

  // Save user to MongoDB
  const saveUserToMongoDB = async (userData) => {
    try {
      console.log('💾 Attempting to save user to MongoDB:', userData.email)
      
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 8000) // Increased timeout
      
      const response = await fetch('/api/users/firebase-sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        console.warn('❌ MongoDB sync failed with status:', response.status)
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.warn('❌ Error details:', errorData)
        
        // Save to localStorage as fallback
        FallbackStorage.saveUser(userData)
        return { success: false, fallback: true, error: errorData }
      }
      
      const result = await response.json()
      console.log('✅ MongoDB sync successful:', result)
      
      // Also save to localStorage for offline access
      FallbackStorage.saveUser(userData)
      return result
    } catch (error) {
      // Handle AbortError specifically
      if (error.name === 'AbortError') {
        console.warn('⏰ MongoDB sync timed out, using fallback storage')
      } else {
        console.error('💥 MongoDB save error:', error)
      }
      // Save to localStorage as fallback
      FallbackStorage.saveUser(userData)
      return { success: false, fallback: true, error: error.message }
    }
  }

  // Check if user exists in MongoDB
  const checkUserInMongoDB = async (email) => {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout
      
      const response = await fetch(`/api/users/check?email=${encodeURIComponent(email)}`, {
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        // Fallback to localStorage
        return FallbackStorage.getUser(email)
      }
      
      const data = await response.json()
      return data.found ? data.user : null
    } catch (error) {
      // Handle AbortError specifically
      if (error.name === 'AbortError') {
        console.warn('MongoDB check timed out, using fallback')
      } else {
        console.error('MongoDB check error:', error)
      }
      // Fallback to localStorage
      return FallbackStorage.getUser(email)
    }
  }

  // Fetch MongoDB user data when Firebase user changes
  const fetchMongoUser = async (email) => {
    if (!email) return null
    
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout
      
      const response = await fetch(`/api/users/check?email=${encodeURIComponent(email)}`, {
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        console.warn('MongoDB user fetch failed:', response.status)
        // Fallback to localStorage
        return FallbackStorage.getUser(email)
      }
      
      const data = await response.json()
      const mongoUser = data.found ? data.user : null
      
      // Cache user data in localStorage for offline access
      if (mongoUser) {
        FallbackStorage.saveUser(mongoUser)
      }
      
      return mongoUser
    } catch (error) {
      // Handle AbortError specifically
      if (error.name === 'AbortError') {
        console.warn('MongoDB user fetch timed out, using fallback')
      } else {
        console.error('Error fetching MongoDB user:', error)
      }
      // Always fallback to localStorage
      return FallbackStorage.getUser(email)
    }
  }

  // Firebase auth state listener
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)
      
      if (currentUser) {
        // Fetch MongoDB user data
        const mongoUserData = await fetchMongoUser(currentUser.email)
        setMongoUser(mongoUserData)
      } else {
        setMongoUser(null)
      }
      
      setLoading(false)
      console.log('Firebase Auth State Changed:', currentUser)
    })
    
    return () => {
      unSubscribe()
    }
  }, [])

  const authInfo = {
    user,
    mongoUser,
    loading,
    registerUser,
    signInUser,
    signInGoogle,
    logOut,
    forgetPassword
  }

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;