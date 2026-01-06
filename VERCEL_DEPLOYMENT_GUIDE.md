# Vercel Deployment Guide - Care.xyz

## 🚀 Quick Deploy Steps

### Step 1: Vercel এ Sign Up/Login করুন
1. যান: https://vercel.com/
2. **"Sign Up"** অথবা **"Login"** click করুন
3. **GitHub** দিয়ে login করুন (recommended)

### Step 2: New Project তৈরি করুন
1. Dashboard এ **"Add New..."** → **"Project"** click করুন
2. **"Import Git Repository"** section এ যান
3. আপনার GitHub account select করুন
4. **"masumBillah-1/care-xyz"** repository খুঁজুন
5. **"Import"** button click করুন

### Step 3: Project Configure করুন

Vercel automatically detect করবে:
- ✅ Framework: **Next.js**
- ✅ Root Directory: `./`
- ✅ Build Command: `npm run build`
- ✅ Output Directory: `.next`
- ✅ Install Command: `npm install`

**কিছু change করার দরকার নেই!**

### Step 4: Environment Variables Add করুন

**"Environment Variables"** section এ scroll করুন এবং এই variables গুলো add করুন:

```env
DATABASE_URL=mongodb+srv://care-xyz:xPD0SNeb5WJNhTNH@myserverdb.wwgfr6w.mongodb.net/?appName=MyServerDB

NEXTAUTH_URL=https://your-project-name.vercel.app
NEXTAUTH_SECRET=your-secret-key-here-change-this-in-production

NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC0b6Hu6_0VQRvnezgJpYjiA8k-8t_XNFY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=carexyz-253f3.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=carexyz-253f3
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=carexyz-253f3.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=754017153248
NEXT_PUBLIC_FIREBASE_APP_ID=1:754017153248:web:a2220c8ddeadb148fc2085

STRIPE_SECRET_KEY=your_stripe_secret_key

EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your_email@gmail.com
EMAIL_SERVER_PASSWORD=your_app_password
EMAIL_FROM=your_email@gmail.com
```

**⚠️ Important:**
- `NEXTAUTH_URL` প্রথমে temporary রাখুন, deployment এর পর actual URL দিয়ে update করবেন
- সব variables এর জন্য **"Production"** select করুন

### Step 5: Deploy করুন
1. সব settings check করুন
2. **"Deploy"** button click করুন
3. Build process শুরু হবে (2-3 মিনিট লাগবে)
4. ✅ Deployment successful হলে আপনার live URL পাবেন!

---

## 🔧 Post-Deployment Configuration

### 1. NEXTAUTH_URL Update করুন

Deployment successful হলে:
1. আপনার Vercel URL copy করুন (যেমন: `https://care-xyz-abc123.vercel.app`)
2. Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
3. `NEXTAUTH_URL` খুঁজুন এবং **Edit** click করুন
4. Value update করুন আপনার actual Vercel URL দিয়ে
5. **Save** করুন
6. **Deployments** tab এ যান → Latest deployment → **...** → **Redeploy**

### 2. Firebase Authorized Domain Add করুন

1. Firebase Console এ যান: https://console.firebase.google.com/
2. আপনার project select করুন
3. **Authentication** → **Settings** → **Authorized domains**
4. **Add domain** click করুন
5. আপনার Vercel domain add করুন: `care-xyz-abc123.vercel.app`
6. **Add** click করুন

### 3. Stripe Redirect URLs Update করুন

1. Stripe Dashboard এ যান: https://dashboard.stripe.com/
2. **Settings** → **Checkout settings**
3. **Redirect URLs** section এ scroll করুন
4. Add করুন:
   - `https://your-vercel-url.vercel.app/payment-success`
   - `https://your-vercel-url.vercel.app/book/*`
5. **Save** করুন

### 4. MongoDB Atlas Network Access

1. MongoDB Atlas এ যান: https://cloud.mongodb.com/
2. **Network Access** → **IP Access List**
3. **Add IP Address** click করুন
4. **Allow Access from Anywhere** select করুন (0.0.0.0/0)
5. অথবা Vercel এর IP ranges add করুন
6. **Confirm** click করুন

---

## ✅ Testing Your Live Site

আপনার Vercel URL এ গিয়ে test করুন:

### Homepage Test
- [ ] Homepage load হচ্ছে
- [ ] Banner image দেখাচ্ছে
- [ ] Services section দেখাচ্ছে
- [ ] Navigation কাজ করছে

### Authentication Test
- [ ] Register page open হচ্ছে
- [ ] Email/Password দিয়ে register করা যাচ্ছে
- [ ] Google Sign-in কাজ করছে
- [ ] Login করা যাচ্ছে
- [ ] Profile page access করা যাচ্ছে

### Booking Test
- [ ] Service details page open হচ্ছে
- [ ] Booking form fill করা যাচ্ছে
- [ ] "Pay with Stripe" button কাজ করছে
- [ ] Stripe checkout page এ redirect হচ্ছে

### Payment Test
- [ ] Test card দিয়ে payment করা যাচ্ছে
- [ ] Payment success page এ redirect হচ্ছে
- [ ] Booking confirmation দেখাচ্ছে

### Database Test
- [ ] My Bookings page এ data দেখাচ্ছে
- [ ] MongoDB এ payment data save হচ্ছে
- [ ] User profile update হচ্ছে

---

## 🔄 Automatic Deployments

এখন থেকে:
- যখনই আপনি GitHub এ code push করবেন
- Vercel automatically নতুন deployment তৈরি করবে
- Build successful হলে live site update হবে

### Preview Deployments
- যেকোনো branch এ push করলে preview URL পাবেন
- Pull Request তৈরি করলে automatic preview deployment হবে
- Main branch এ merge করলে production deployment হবে

---

## 🎯 Custom Domain Setup (Optional)

যদি নিজের domain থাকে:

1. Vercel Dashboard → Your Project → **Settings** → **Domains**
2. **Add** button click করুন
3. আপনার domain name লিখুন (যেমন: `care.xyz`)
4. Vercel DNS records দেখাবে
5. আপনার domain provider এ গিয়ে DNS records add করুন:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```
6. DNS propagation এর জন্য 24-48 ঘন্টা wait করুন
7. ✅ Domain active হলে HTTPS automatic enable হবে

---

## 📊 Monitoring & Analytics

### Vercel Dashboard Features:
- **Deployments**: সব deployment history দেখুন
- **Analytics**: Visitor statistics দেখুন
- **Logs**: Runtime logs check করুন
- **Speed Insights**: Performance metrics দেখুন

### Check Logs:
1. Vercel Dashboard → Your Project → **Deployments**
2. যেকোনো deployment click করুন
3. **Build Logs** দেখুন build errors এর জন্য
4. **Function Logs** দেখুন runtime errors এর জন্য

---

## 🐛 Common Issues & Solutions

### Issue 1: Build Failed
**Solution:**
- Build logs check করুন
- Environment variables সব add করেছেন কিনা check করুন
- Local এ `npm run build` করে test করুন

### Issue 2: Environment Variables Not Working
**Solution:**
- Variable names সঠিক আছে কিনা check করুন
- "Production" environment select করেছেন কিনা check করুন
- Redeploy করুন variables add/update করার পর

### Issue 3: Firebase Authentication Failed
**Solution:**
- Vercel domain Firebase authorized domains এ add করেছেন কিনা check করুন
- Firebase config variables সঠিক আছে কিনা check করুন

### Issue 4: Stripe Payment Redirect Failed
**Solution:**
- `NEXTAUTH_URL` সঠিক Vercel URL দিয়ে update করেছেন কিনা check করুন
- Stripe redirect URLs add করেছেন কিনা check করুন

### Issue 5: MongoDB Connection Timeout
**Solution:**
- MongoDB Atlas Network Access এ 0.0.0.0/0 allow করেছেন কিনা check করুন
- `DATABASE_URL` সঠিক আছে কিনা check করুন
- Function logs check করুন connection errors এর জন্য

---

## 🎉 Success!

আপনার Care.xyz platform এখন live! 🚀

**Next Steps:**
1. ✅ সব features test করুন
2. ✅ Friends/family কে share করুন feedback এর জন্য
3. ✅ Custom domain add করুন (optional)
4. ✅ Analytics monitor করুন
5. ✅ Regular updates push করুন

**Your Live URL:** `https://your-project-name.vercel.app`

---

## 📞 Support

- Vercel Documentation: https://vercel.com/docs
- Vercel Community: https://github.com/vercel/vercel/discussions
- Next.js Documentation: https://nextjs.org/docs

---

**Congratulations on your deployment! 🎊**
