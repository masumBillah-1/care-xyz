const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://care-xyz:xPD0SNeb5WJNhTNH@myserverdb.wwgfr6w.mongodb.net/?appName=MyServerDB";
const dbname = "care-xyz";

const sampleServices = [
  {
    name: 'Baby Care Service',
    description: 'Professional babysitting and childcare services for your little ones. Our trained caregivers provide safe, nurturing care.',
    price: 150,
    category: 'childcare',
    features: [
      'Experienced childcare professionals',
      'Background verified caregivers',
      'Age-appropriate activities',
      'Meal preparation and feeding',
      'Emergency care protocols',
      '24/7 support available'
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Elderly Care Service',
    description: 'Compassionate care for elderly family members. Our caregivers provide assistance with daily activities and companionship.',
    price: 200,
    category: 'elderly',
    features: [
      'Trained elderly care specialists',
      'Medication management',
      'Mobility assistance',
      'Companionship and social interaction',
      'Personal hygiene assistance',
      'Health monitoring'
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Sick People Care Service',
    description: 'Specialized care for individuals recovering from illness or managing chronic conditions. Professional medical support at home.',
    price: 250,
    category: 'medical',
    features: [
      'Medically trained caregivers',
      'Post-operative care',
      'Chronic condition management',
      'Medication administration',
      'Physical therapy assistance',
      'Doctor coordination'
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function seedDatabase() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db(dbname);
    
    // Clear existing services
    await db.collection('services').deleteMany({});
    console.log('🗑️ Cleared existing services');
    
    // Insert sample services
    const result = await db.collection('services').insertMany(sampleServices);
    console.log(`✅ Inserted ${result.insertedCount} services`);
    
    // List inserted services
    const services = await db.collection('services').find({}).toArray();
    console.log('📋 Services in database:');
    services.forEach(service => {
      console.log(`- ${service.name} (₹${service.price}/hour)`);
    });
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

seedDatabase();