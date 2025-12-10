# 🐾 Pet Realm

> A comprehensive e-commerce platform for pet supplies and services across the Maldives

Pet Realm connects pet owners with local shops, veterinary clinics, and pet service providers throughout the Maldivian atolls and islands. Built with modern web technologies and designed specifically for the unique geographic and business needs of the Maldives.

[![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](CHANGELOG.md)
[![Next.js](https://img.shields.io/badge/Next.js-15.1-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-Proprietary-red.svg)](#license)

---

## ✨ Features

### For Customers
- **Browse & Search** - Discover pet supplies and services across the Maldives
- **Shopping Cart** - Easy cart management with single-shop validation
- **Order Tracking** - Real-time order status with detailed timeline
- **Flexible Delivery** - Choose pickup or delivery based on shop availability
- **Email Notifications** - Stay updated on order status changes
- **Profile Management** - Manage your account and order history

### For Shop Owners
- **Shop Setup** - Multi-step wizard to get your shop online quickly
- **Product Management** - Create, edit, and manage products with multiple images
- **Dashboard** - Track revenue, orders, and key metrics
- **Delivery Zones** - Configure custom delivery areas and fees
- **Payment Verification** - Review and verify receipt uploads
- **Order Management** - Process orders with status tracking

### Platform Features
- **Secure Authentication** - Email verification and password reset
- **Maldivian Location System** - Atoll and island-based addressing
- **Responsive Design** - Optimized for mobile, tablet, and desktop
- **Image Management** - Up to 5 images per product with R2 cloud storage
- **Receipt-Based Payments** - Manual payment verification via receipt upload
- **Multi-Region Support** - Delivery across different atolls and islands

---

## Quick Start

### Prerequisites

- Node.js 18+ and pnpm
- PostgreSQL database
- Resend API key (for emails)
- Cloudflare R2 bucket (for image storage)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MystSugar/pet-realm.git
   cd pet-realm
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/pet_realm"
   
   # NextAuth
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   
   # Email (Resend)
   RESEND_API_KEY="re_xxxxxxxxxxxxx"
   EMAIL_FROM="Pet Realm <noreply@yourdomain.com>"
   
   # Cloudflare R2 Storage
   R2_ACCOUNT_ID="your-r2-account-id"
   R2_ACCESS_KEY_ID="your-r2-access-key"
   R2_SECRET_ACCESS_KEY="your-r2-secret-key"
   R2_BUCKET_NAME="pet-realm-receipts"
   R2_PUBLIC_URL="https://your-r2-public-url.com"
   
   # R2 Shop Images
   R2_SHOP_IMAGES_BUCKET_NAME="pet-realm-shop-images"
   R2_SHOP_IMAGES_PUBLIC_URL="https://your-shop-images-url.com"
   
   # App
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   # Push schema to database
   pnpm prisma db push
   
   # Or run migrations
   pnpm prisma migrate deploy
   
   # Generate Prisma client
   pnpm prisma generate
   ```

5. **Seed the database (optional)**
   ```bash
   pnpm db:seed
   ```

6. **Run the development server**
   ```bash
   pnpm dev
   ```

7. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🏗️ Project Structure

```
pet-realm/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.ts                # Database seeding
│   └── migrations/            # Database migrations
├── public/
│   └── uploads/               # Local file uploads (dev only)
├── src/
│   ├── app/                   # Next.js app directory
│   │   ├── api/              # API routes
│   │   │   ├── auth/         # Authentication endpoints
│   │   │   ├── cart/         # Shopping cart endpoints
│   │   │   ├── checkout/     # Order creation
│   │   │   ├── orders/       # Order management
│   │   │   ├── products/     # Product endpoints
│   │   │   ├── shop/         # Shop management (seller)
│   │   │   ├── shops/        # Shop listing (public)
│   │   │   └── user/         # User profile endpoints
│   │   ├── auth/             # Auth pages (signin, register, etc.)
│   │   ├── shop/             # Seller dashboard pages
│   │   ├── marketplace/      # Product browsing
│   │   ├── cart/             # Shopping cart page
│   │   ├── checkout/         # Checkout page
│   │   ├── orders/           # Order history
│   │   └── ...               # Other pages
│   ├── components/           # React components
│   │   ├── auth/            # Auth forms
│   │   ├── cart/            # Cart components
│   │   ├── checkout/        # Checkout flow
│   │   ├── layouts/         # Layout components
│   │   ├── marketplace/     # Product listing
│   │   ├── orders/          # Order displays
│   │   ├── products/        # Product cards
│   │   ├── shop/            # Seller components
│   │   ├── ui/              # Reusable UI components
│   │   └── ...
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.ts      # Authentication hook
│   │   ├── useCart.ts      # Shopping cart hook
│   │   └── ...
│   ├── lib/                 # Utility libraries
│   │   ├── auth.ts         # NextAuth configuration
│   │   ├── prisma.ts       # Prisma client
│   │   ├── email.ts        # Email utilities
│   │   ├── validations/    # Zod schemas
│   │   └── utils/          # Helper functions
│   ├── types/              # TypeScript types
│   └── middleware.ts       # Next.js middleware
├── CHANGELOG.md            # Version history
├── package.json            # Dependencies
└── README.md              # This file
```

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 15.1 with App Router |
| **Language** | TypeScript 5 |
| **Database** | PostgreSQL with Prisma ORM 6.19 |
| **Authentication** | NextAuth.js (JWT sessions) |
| **Styling** | Tailwind CSS 4 |
| **Email** | Resend API |
| **Storage** | Cloudflare R2 (S3-compatible) |
| **Validation** | Zod |
| **UI Components** | Radix UI |
| **Package Manager** | pnpm |

---

## 📊 Database Schema

### Core Models
- **User** - Customer, Seller, or Admin accounts
- **Shop** - Shop profiles and settings
- **Product** - Product listings with images and details
- **Order** - Customer orders with status tracking
- **OrderItem** - Individual items in orders
- **CartItem** - Shopping cart items
- **ContactSubmission** - Contact form submissions

### Authentication Models (NextAuth)
- **Account** - OAuth accounts
- **Session** - Database sessions (currently using JWT)
- **VerificationToken** - Email verification tokens

---

## 🔐 Authentication Flow

1. **Registration**
   - User signs up with email, phone, and ID verification
   - Email verification token sent
   - Account remains unverified until email confirmed

2. **Email Verification**
   - Click link in verification email
   - Token validated and marked as verified
   - Account activated

3. **Sign In**
   - Email/password authentication
   - JWT token created (30-day expiry)
   - Stored in HTTP-only cookie

4. **Password Reset**
   - Request reset via email
   - Reset token sent to email
   - New password set via token link

---

## 🛒 E-commerce Flow

### Customer Journey
```
Browse Marketplace → View Product → Add to Cart → Checkout → 
Upload Receipt → Seller Verifies → Order Status Updates → Delivered/Picked Up
```

### Seller Journey
```
Setup Shop → Add Products → Receive Order → Verify Payment → 
Update Status → Fulfill Order
```

### Order States
1. **PENDING** - Order placed, awaiting receipt upload
2. **CONFIRMED** - Receipt verified, order confirmed
3. **PREPARING** - Shop preparing the order
4. **READY** - Ready for pickup
5. **OUT_FOR_DELIVERY** - Out for delivery
6. **DELIVERED** - Successfully delivered
7. **PICKED_UP** - Customer picked up order
8. **CANCELLED** - Order cancelled

---

## 🚢 Deployment

### Environment Setup
1. Set up PostgreSQL database (e.g., Supabase, Railway, Neon)
2. Configure R2 buckets in Cloudflare
3. Get Resend API key for email
4. Set all environment variables

### Build & Deploy
```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

### Recommended Platforms
- **Vercel** - Optimized for Next.js
- **Railway** - Easy database + app hosting
- **Fly.io** - Global edge deployment

---

## 🧪 Development

### Available Scripts
```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm db:seed      # Seed database with sample data
```

### Database Commands
```bash
# Generate Prisma client
pnpm prisma generate

# Create migration
pnpm prisma migrate dev --name your_migration_name

# Apply migrations
pnpm prisma migrate deploy

# Open Prisma Studio
pnpm prisma studio

# Reset database (dev only)
pnpm prisma migrate reset
```

---

See [CHANGELOG.md](CHANGELOG.md) for version history and [GitHub Issues](https://github.com/MystSugar/pet-realm/issues) for planned features.

---

## 📖 Learning Goals

This project serves as a comprehensive learning experience for:
- Modern Next.js 15 development with App Router
- TypeScript and type-safe development
- Database design and Prisma ORM
- Authentication and authorization patterns
- E-commerce platform architecture
- Cloud storage and email services
- GitHub workflows and versioning
- Project management and documentation

---

## 🤝 Contributing

This is currently a personal learning project. Contributions are not being accepted at this time, but feel free to fork and adapt for your own learning!

---

## 📄 License

Proprietary - All rights reserved. This is a personal learning project.

---

## 👨‍💻 Author

**MystSugar**
- GitHub: [@MystSugar](https://github.com/MystSugar)

---
