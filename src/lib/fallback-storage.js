// Fallback storage system when MongoDB is not available

export const FallbackStorage = {
  // Save user data to localStorage
  saveUser: (userData) => {
    try {
      const key = `user_${userData.email}`
      localStorage.setItem(key, JSON.stringify({
        ...userData,
        lastUpdated: new Date().toISOString()
      }))
      return true
    } catch (error) {
      console.error('Failed to save user to localStorage:', error)
      return false
    }
  },

  // Get user data from localStorage
  getUser: (email) => {
    try {
      const key = `user_${email}`
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('Failed to get user from localStorage:', error)
      return null
    }
  },

  // Update user data in localStorage
  updateUser: (email, updateData) => {
    try {
      const existing = FallbackStorage.getUser(email)
      if (existing) {
        const updated = {
          ...existing,
          ...updateData,
          lastUpdated: new Date().toISOString()
        }
        return FallbackStorage.saveUser(updated)
      }
      return false
    } catch (error) {
      console.error('Failed to update user in localStorage:', error)
      return false
    }
  },

  // Check if user exists in localStorage
  userExists: (email) => {
    return FallbackStorage.getUser(email) !== null
  },

  // Clear user data
  clearUser: (email) => {
    try {
      const key = `user_${email}`
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error('Failed to clear user from localStorage:', error)
      return false
    }
  },

  // Get all cached users (for debugging)
  getAllUsers: () => {
    try {
      const users = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith('user_')) {
          const data = localStorage.getItem(key)
          if (data) {
            users.push(JSON.parse(data))
          }
        }
      }
      return users
    } catch (error) {
      console.error('Failed to get all users from localStorage:', error)
      return []
    }
  }
}