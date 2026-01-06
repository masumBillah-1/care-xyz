import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';

const uri = process.env.DATABASE_URL
const dbname = process.env.DBNAME || "care-xyz"

// Collection names
const collections = {
    users: "users",
    services: "services", 
    bookings: "bookings",
    payments: "payments"
}

// Create a MongoClient with optimized connection options
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  maxPoolSize: 50, // Increased pool size for better concurrency
  serverSelectionTimeoutMS: 30000, // 30 seconds - much longer timeout
  socketTimeoutMS: 45000, // 45 seconds socket timeout
  connectTimeoutMS: 30000, // 30 seconds connection timeout
  maxIdleTimeMS: 60000, // 60 seconds idle time
  retryWrites: true,
  retryReads: true,
  heartbeatFrequencyMS: 10000, // Check connection health every 10s
  minPoolSize: 5, // Maintain minimum connections for faster queries
  compressors: ['zlib'], // Enable compression for faster data transfer
});

let isConnected = false;
let connectionPromise = null;

// Connect to MongoDB with retry logic and connection caching
export const connectDB = async () => {
    if (isConnected && client.topology && client.topology.isConnected()) {
        return client;
    }
    
    // If connection is already in progress, wait for it
    if (connectionPromise) {
        return connectionPromise;
    }
    
    connectionPromise = (async () => {
        try {
            console.log("🔄 Attempting to connect to MongoDB...");
            console.log("🔗 Connection URI:", uri ? uri.substring(0, 30) + '...' : 'NOT SET');
            
            // Connect with much longer timeout (30 seconds)
            await Promise.race([
                client.connect(),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Connection timeout after 30 seconds')), 30000)
                )
            ]);
            
            // Test the connection with ping
            await Promise.race([
                client.db("admin").command({ ping: 1 }),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Ping timeout after 10 seconds')), 10000)
                )
            ]);
            
            isConnected = true;
            console.log("✅ Connected to MongoDB successfully");
            console.log("📊 Database name:", dbname);
            return client;
        } catch (error) {
            console.error("❌ MongoDB connection error:", error.message);
            console.error("❌ Full error:", error);
            isConnected = false;
            connectionPromise = null; // Reset promise for retry
            
            // Don't throw error, let the app continue with fallback
            console.log("⚠️ Continuing with fallback data due to connection issue");
            return null;
        }
    })();
    
    return connectionPromise;
}

// Get database connection with auto-connect
export const getDB = async () => {
    try {
        if (!isConnected) {
            const connection = await connectDB();
            if (!connection) {
                throw new Error('Database connection failed');
            }
        }
        return client.db(dbname);
    } catch (error) {
        console.error("❌ Failed to get database:", error.message);
        throw error;
    }
}

// Get specific collection with auto-connect
export const getCollection = async (collectionName) => {
    try {
        if (!isConnected) {
            const connection = await connectDB();
            if (!connection) {
                throw new Error('Database connection failed');
            }
        }
        return client.db(dbname).collection(collectionName);
    } catch (error) {
        console.error(`❌ Failed to get collection ${collectionName}:`, error.message);
        throw error;
    }
}

// Collection helpers with better error handling and graceful fallback
export const userCollection = async () => {
    try {
        const connection = await connectDB();
        if (!connection) {
            throw new Error('Database connection not available');
        }
        return connection.db(dbname).collection(collections.users);
    } catch (error) {
        console.error("❌ Failed to get user collection:", error.message);
        throw error;
    }
};

export const serviceCollection = async () => {
    try {
        const connection = await connectDB();
        if (!connection) {
            throw new Error('Database connection not available');
        }
        return connection.db(dbname).collection(collections.services);
    } catch (error) {
        console.error("❌ Failed to get service collection:", error.message);
        throw error;
    }
};

export const bookingCollection = async () => {
    try {
        const connection = await connectDB();
        if (!connection) {
            throw new Error('Database connection not available');
        }
        return connection.db(dbname).collection(collections.bookings);
    } catch (error) {
        console.error("❌ Failed to get booking collection:", error.message);
        throw error;
    }
};

export const paymentCollection = async () => {
    try {
        const connection = await connectDB();
        if (!connection) {
            throw new Error('Database connection not available');
        }
        return connection.db(dbname).collection(collections.payments);
    } catch (error) {
        console.error("❌ Failed to get payment collection:", error.message);
        throw error;
    }
};

// Export ObjectId for use in other files
export { ObjectId };

// Legacy function for backward compatibility
export const dbconect = async (cname) => {
    try {
        if (!isConnected) {
            const connection = await connectDB();
            if (!connection) {
                throw new Error('Database connection failed');
            }
        }
        return client.db(dbname).collection(cname);
    } catch (error) {
        console.error(`❌ Failed to connect to collection ${cname}:`, error.message);
        throw error;
    }
}