# Care.xyz - Professional Care Services Platform

A comprehensive Next.js-based care services booking platform with integrated payment processing, real-time booking management, and secure authentication.

![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black)
![React](https://img.shields.io/badge/React-19-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![Firebase](https://img.shields.io/badge/Firebase-Auth-orange)
![Stripe](https://img.shields.io/badge/Stripe-Payments-purple)

## 🌟 Features

### Core Functionality
- **Service Booking System**: Book professional care services (Baby Care, Elderly Care, Sick Care)
- **Real-time Payment Processing**: Integrated Stripe payment gateway
- **User Authentication**: Dual authentication system (Firebase + NextAuth)
- **Booking Management**: Track and manage all bookings with status updates
- **Responsive Design**: Mobile-first, fully responsive UI
- **Profile Management**: User profile with booking history

### Technical Features
- **Server-Side Rendering (SSR)**: Optimized performance with Next.js 16
- **MongoDB Integration**: Scalable database with connection pooling
- **Payment Webhooks**: Automated payment confirmation and data storage
- **Error Handling**: Comprehensive error boundaries and fallback systems
- **Toast Notifications**: Real-time user feedback with react-hot-toast
- **Form Validation**: Client and server-side validation
- **Security**: Environment-based configuration, secure API routes

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16.1.1 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS 3.4.1
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **State Management**: React Hooks + Context API

### Backend
- **Runtime**: Node.js 18+
- **API Routes**: Next.js API Routes
- **Database**: MongoDB Atlas
- **ODM**: Native MongoDB Driver
- **Authentication**: 
  - Firebase Authentication (Google Sign-in, Email/Password)
  - NextAuth.js (Credentials, OAuth)

### Payment & Services
- **Payment Gateway**: Stripe
- **Email Service**: Nodemailer (SMTP)
- **Password Hashing**: bcryptjs

### Development Tools
- **Language**: JavaScript (JSX)
- **Linting**: ESLint
- **Package Manager**: npm
- **Version Control**: Git

## 📁 Project Structure

```
care-xyz/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── api/                      # API Routes
│   │   │   ├── auth/                 # Authentication endpoints
│   │   │   ├── bookings/             # Booking management
│   │   │   ├── create-checkout-session/ # Stripe checkout
│   │   │   ├── payment-success/      # Payment confirmation
│   │   │   ├── services/             # Service data
│   │   │   └── users/                # User management
│   │   ├── auth/                     # Auth pages (login, register)
│   │   ├── book/[serviceId]/         # Service booking page
│   │   ├── my-bookings/              # User bookings dashboard
│   │   ├── payment-success/          # Payment confirmation page
│   │   ├── profile/                  # User profile page
│   │   ├── service/[serviceId]/      # Service details page
│   │   ├── layout.jsx                # Root layout
│   │   ├── page.jsx                  # Homepage
│   │   └── globals.css               # Global styles
│   ├── components/                   # React Components
│   │   ├── about.jsx                 # About section
│   │   ├── checkout-form.jsx         # Payment form
│   │   ├── error-boundary.jsx        # Error handling
│   │   ├── footer.jsx                # Footer component
│   │   ├── hero.jsx                  # Hero section with banner
│   │   ├── navbar.jsx                # Navigation with auth
│   │   ├── providers.jsx             # Context providers
│   │   ├── service-detail.jsx        # Service details
│   │   ├── services.jsx              # Services grid
│   │   └── testimonials.jsx          # Customer reviews
│   ├── contexts/                     # React Context
│   │   └── AuthProvider.jsx          # Firebase auth context
│   ├── hooks/                        # Custom Hooks
│   │   └── useAuth.js                # Authentication hook
│   └── lib/                          # Utility Libraries
│       ├── auth.js                   # NextAuth configuration
│       ├── db.connect.js             # MongoDB connection
│       ├── fallback-storage.js       # Offline storage
│       └── firebase.js               # Firebase configuration
├── public/                           # Static Assets
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── .env.local                        # Environment variables (not in git)
├── .env.example                      # Environment template
├── .gitignore                        # Git ignore rules
├── netlify.toml                      # Netlify configuration
├── next.config.ts                    # Next.js configuration
├── package.json                      # Dependencies
├── postcss.config.mjs                # PostCSS configuration
├── tailwind.config.ts                # Tailwind configuration
├── tsconfig.json                     # TypeScript configuration
├── check-payment-data.js             # MongoDB data checker
├── NETLIFY_DEPLOYMENT_GUIDE.md       # Deployment instructions
├── PAYMENT_TESTING_GUIDE.md          # Payment testing guide
├── FIXES_APPLIED.md                  # Technical fixes log
└── README.md                         # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- MongoDB Atlas account
- Firebase project
- Stripe account

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd care-xyz
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual credentials:
```env
# Database
DATABASE_URL=your_mongodb_connection_string

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key

# Email (Optional)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your_email@gmail.com
EMAIL_SERVER_PASSWORD=your_app_password
EMAIL_FROM=your_email@gmail.com
```

4. **Run development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for production**
```bash
npm run build
```

6. **Start production server**
```bash
npm start
```

## 📊 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  contact: String,
  nidNo: String,
  image: String,
  provider: String, // 'credentials', 'google', 'firebase'
  bookingHistory: Array,
  lastBooking: String,
  lastPayment: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Bookings Collection
```javascript
{
  _id: ObjectId,
  serviceId: String,
  serviceName: String,
  userEmail: String,
  paymentId: ObjectId,
  stripeSessionId: String,
  totalAmount: Number,
  status: String, // 'pending', 'confirmed', 'completed', 'cancelled'
  paymentStatus: String, // 'pending', 'paid', 'failed'
  date: String,
  time: String,
  duration: Number,
  location: String,
  contactNumber: String,
  specialInstructions: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Payments Collection
```javascript
{
  _id: ObjectId,
  userEmail: String,
  serviceId: String,
  serviceName: String,
  amount: Number,
  currency: String,
  paymentStatus: String, // 'paid', 'pending', 'failed'
  paymentMethod: String, // 'stripe'
  stripeSessionId: String,
  paidAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Services Collection
```javascript
{
  _id: ObjectId,
  id: String,
  name: String,
  description: String,
  price: Number,
  category: String,
  features: String (JSON array),
  image: String,
  available: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Authentication Flow

### Firebase Authentication
1. User registers/logs in via Firebase (Google or Email/Password)
2. Firebase returns user credentials
3. User data synced to MongoDB
4. Session managed via Firebase Auth Context

### NextAuth Authentication
1. User logs in via credentials
2. NextAuth validates against MongoDB
3. JWT token generated
4. Session managed via NextAuth

### Dual Auth Support
- Both authentication methods work simultaneously
- APIs support both Firebase and NextAuth sessions
- User email used as primary identifier

## 💳 Payment Flow

1. **Service Selection**: User selects a care service
2. **Booking Form**: User fills booking details (date, time, location)
3. **Stripe Checkout**: User redirected to Stripe payment page
4. **Payment Processing**: Stripe processes payment securely
5. **Webhook/Callback**: Payment confirmation received
6. **Data Storage**: 
   - Payment record saved to MongoDB
   - Booking record created
   - User profile updated
7. **Confirmation**: User redirected to success page
8. **Email Notification**: Confirmation email sent (optional)

### Test Payment
Use Stripe test card:
- **Card Number**: 4242 4242 4242 4242
- **Expiry**: Any future date
- **CVC**: Any 3 digits
- **ZIP**: Any 5 digits

## 🎨 Available Services

1. **Baby Care Service** (৳150/hour)
   - Experienced childcare professionals
   - Background verified caregivers
   - Age-appropriate activities
   - Meal preparation and feeding

2. **Elderly Care Service** (৳200/hour)
   - Trained elderly care specialists
   - Medication management
   - Mobility assistance
   - Companionship and social interaction

3. **Sick People Care Service** (৳250/hour)
   - Medically trained caregivers
   - Post-operative care
   - Chronic condition management
   - Medication administration

## 🧪 Testing

### Test MongoDB Connection
```bash
node check-payment-data.js
```

### Check Payment Data
```bash
node check-payment-data.js
```

### Run Development Server
```bash
npm run dev
```

### Build Production
```bash
npm run build
```

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/[...nextauth]` - NextAuth endpoints
- `GET /api/users/check` - Check if user exists
- `POST /api/users/firebase-sync` - Sync Firebase user to MongoDB

### Bookings
- `GET /api/bookings?email=user@example.com` - Get user bookings
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/status` - Update booking status

### Payments
- `POST /api/create-checkout-session` - Create Stripe checkout
- `POST /api/payment-success` - Process payment confirmation
- `GET /api/admin/payments` - Get all payments (admin)

### Services
- `GET /api/services/[serviceId]` - Get service details

### Users
- `PUT /api/users/update-profile` - Update user profile

## 🌐 Deployment

### Netlify Deployment

1. **Connect Repository**
   - Push code to GitHub
   - Connect GitHub repo to Netlify

2. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: 18

3. **Add Environment Variables**
   - Add all variables from `.env.local` to Netlify dashboard

4. **Deploy**
   - Netlify automatically builds and deploys

See [NETLIFY_DEPLOYMENT_GUIDE.md](./NETLIFY_DEPLOYMENT_GUIDE.md) for detailed instructions.

## 🔧 Configuration

### MongoDB Connection
- Connection pooling: 50 max connections
- Timeout: 30 seconds
- Retry logic enabled
- Compression enabled (zlib)

### Stripe Configuration
- API Version: 2024-12-18.acacia
- Payment methods: Card
- Currency: USD
- Webhook support ready

### Firebase Configuration
- Authentication methods: Google, Email/Password
- Firestore: Not used (MongoDB instead)
- Storage: Not used

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Check DATABASE_URL in environment variables
- Verify MongoDB Atlas allows connections from your IP
- Check connection timeout settings

### Payment Not Saving
- Verify Stripe webhook is configured
- Check payment-success API logs
- Run `node check-payment-data.js` to verify data

### Authentication Issues
- Clear browser cookies and localStorage
- Verify Firebase configuration
- Check NEXTAUTH_URL matches your domain

### Build Errors
- Delete `.next` folder and rebuild
- Clear npm cache: `npm cache clean --force`
- Reinstall dependencies: `rm -rf node_modules && npm install`

## 📈 Performance Optimizations

- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic route-based code splitting
- **Lazy Loading**: Components loaded on demand
- **Connection Pooling**: MongoDB connection reuse
- **Caching**: Static page generation where possible
- **Compression**: Gzip compression enabled

## 🔒 Security Features

- **Environment Variables**: Sensitive data in .env files
- **Password Hashing**: bcryptjs with salt rounds
- **HTTPS Only**: Secure connections enforced
- **CSRF Protection**: Built-in Next.js protection
- **SQL Injection Prevention**: MongoDB parameterized queries
- **XSS Protection**: React automatic escaping
- **Rate Limiting**: Can be added via middleware

## 📝 License

This project is private and proprietary.

## 👥 Contributors

- Development Team: Care.xyz

## 📞 Support

For support, email support@care.xyz or contact through the website.

## 🎯 Future Enhancements

- [ ] Real-time chat with caregivers
- [ ] Video call integration
- [ ] Advanced booking calendar
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Admin dashboard
- [ ] Rating and review system
- [ ] Automated email notifications
- [ ] SMS notifications
- [ ] Subscription packages
- [ ] Referral program
- [ ] Analytics dashboard

## 📚 Documentation

- [Netlify Deployment Guide](./NETLIFY_DEPLOYMENT_GUIDE.md)
- [Payment Testing Guide](./PAYMENT_TESTING_GUIDE.md)
- [Technical Fixes Log](./FIXES_APPLIED.md)

---

**Built with ❤️ using Next.js, React, MongoDB, Firebase, and Stripe**

**Version**: 1.0.0  
**Last Updated**: January 6, 2026
