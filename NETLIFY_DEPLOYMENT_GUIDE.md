# Netlify Deployment Guide - Care.xyz

## 📋 Pre-Deployment Checklist

### ✅ Files Ready
- `netlify.toml` - Netlify configuration file created
- `.env.local` - Environment variables (DO NOT commit to Git)
- Build successful - `npm run build` completed

## 🚀 Deployment Steps

### Option 1: Deploy via Netlify CLI (Recommended)

#### Step 1: Install Netlify CLI
```bash
npm install -g netlify-cli
```

#### Step 2: Login to Netlify
```bash
netlify login
```

#### Step 3: Initialize Netlify Site
```bash
cd care-xyz
netlify init
```

#### Step 4: Deploy
```bash
netlify deploy --prod
```

---

### Option 2: Deploy via Netlify Dashboard (Easy)

#### Step 1: Create Git Repository
1. Go to GitHub/GitLab/Bitbucket
2. Create a new repository
3. Push your code:
```bash
cd care-xyz
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_REPO_URL
git push -u origin main
```

#### Step 2: Connect to Netlify
1. Go to https://app.netlify.com/
2. Click "Add new site" → "Import an existing project"
3. Choose your Git provider (GitHub/GitLab/Bitbucket)
4. Select your repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Node version**: 18

#### Step 3: Add Environment Variables
In Netlify Dashboard → Site settings → Environment variables, add:

```
DATABASE_URL=mongodb+srv://care-xyz:xPD0SNeb5WJNhTNH@myserverdb.wwgfr6w.mongodb.net/?appName=MyServerDB
NEXTAUTH_URL=https://your-site-name.netlify.app
NEXTAUTH_SECRET=your-secret-key-here-change-this-in-production
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC0b6Hu6_0VQRvnezgJpYjiA8k-8t_XNFY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=carexyz-253f3.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=carexyz-253f3
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=carexyz-253f3.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=754017153248
NEXT_PUBLIC_FIREBASE_APP_ID=1:754017153248:web:a2220c8ddeadb148fc2085
STRIPE_SECRET_KEY=your_stripe_secret_key_here
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=mb6517640@gmail.com
EMAIL_SERVER_PASSWORD=sorq ggeh obnv ybvl
EMAIL_FROM=mb6517640@gmail.com
```

**⚠️ IMPORTANT**: Replace `NEXTAUTH_URL` with your actual Netlify URL after deployment!

#### Step 4: Deploy
Click "Deploy site" button

---

### Option 3: Manual Deploy (Drag & Drop)

#### Step 1: Build Locally
```bash
npm run build
```

#### Step 2: Create Deploy Folder
The build creates a `.next` folder - this is what you'll deploy.

#### Step 3: Deploy to Netlify
1. Go to https://app.netlify.com/drop
2. Drag and drop the `.next` folder
3. Wait for deployment to complete

**Note**: This method doesn't support environment variables easily. Use Option 1 or 2 instead.

---

## ⚙️ Post-Deployment Configuration

### 1. Update NEXTAUTH_URL
After deployment, update the environment variable:
```
NEXTAUTH_URL=https://your-actual-site-name.netlify.app
```

### 2. Update Stripe Redirect URLs
In your Stripe Dashboard:
1. Go to Settings → Checkout settings
2. Add your Netlify URL to allowed redirect URLs:
   - `https://your-site-name.netlify.app/payment-success`
   - `https://your-site-name.netlify.app/book/*`

### 3. Update Firebase Authorized Domains
In Firebase Console:
1. Go to Authentication → Settings → Authorized domains
2. Add your Netlify domain:
   - `your-site-name.netlify.app`

### 4. Test Your Deployment
- ✅ Homepage loads
- ✅ Login/Register works
- ✅ Firebase authentication works
- ✅ Service booking works
- ✅ Stripe payment redirects correctly
- ✅ Payment data saves to MongoDB
- ✅ My Bookings page shows data

---

## 🐛 Common Issues & Solutions

### Issue 1: Build Fails
**Solution**: Check build logs in Netlify dashboard. Common causes:
- Missing dependencies
- Environment variables not set
- Node version mismatch

### Issue 2: "Module not found" errors
**Solution**: Make sure all dependencies are in `package.json`:
```bash
npm install
```

### Issue 3: Environment variables not working
**Solution**: 
- Make sure they're added in Netlify dashboard
- Redeploy after adding variables
- Check variable names match exactly

### Issue 4: Firebase authentication fails
**Solution**: Add Netlify domain to Firebase authorized domains

### Issue 5: Stripe redirects fail
**Solution**: 
- Update `NEXTAUTH_URL` to your Netlify URL
- Add Netlify URL to Stripe allowed redirects

### Issue 6: MongoDB connection timeout
**Solution**: 
- Check MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- Or add Netlify's IP ranges to whitelist

---

## 📊 Monitoring Your Site

### Netlify Dashboard
- View deployment logs
- Check build status
- Monitor site analytics
- View function logs (for API routes)

### MongoDB Atlas
- Monitor database connections
- Check query performance
- View stored data

### Stripe Dashboard
- Monitor payments
- Check webhook logs
- View customer data

---

## 🔒 Security Checklist

- ✅ Environment variables set in Netlify (not in code)
- ✅ `.env.local` added to `.gitignore`
- ✅ MongoDB connection string secured
- ✅ Stripe secret key not exposed
- ✅ Firebase config secured
- ✅ NEXTAUTH_SECRET is strong and unique

---

## 🔄 Continuous Deployment

Once connected to Git:
1. Make changes to your code
2. Commit and push to Git
3. Netlify automatically rebuilds and deploys
4. Check deployment status in Netlify dashboard

---

## 📞 Support

If you encounter issues:
1. Check Netlify build logs
2. Check browser console for errors
3. Check server logs in Netlify Functions
4. Verify all environment variables are set
5. Test locally first with `npm run build` and `npm start`

---

## 🎯 Quick Deploy Commands

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
cd care-xyz
netlify deploy --prod
```

---

**Good luck with your deployment! 🚀**
