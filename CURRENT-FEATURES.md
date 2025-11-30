# 🎯 Pet Realm - Core Features

**Focus**: Customer/Seller journey without admin complexity

## 🚀 Development Plan

1. **Landing & Discovery**: Enhanced homepage → marketplace → product pages
2. **Shopping Flow**: Cart → checkout → payment → order tracking
3. **Seller Tools**: Shop setup → product management → order processing
4. **Polish**: UI/UX improvements → notifications → user profiles

## 🔐 Core APIs (28 endpoints)

### Authentication

- Register/Login with email verification
- Password reset and account management
- NextAuth.js with 15-day sessions

### Shop Management

- Multi-step shop setup wizard
- Shop profile and storefront pages
- Maldivian location system (Atoll/Island)

### Products

- CRUD operations with image upload
- Category system and stock management
- Marketplace listing with search/filters

### E-commerce

- Shopping cart with session persistence
- Order creation and status tracking
- Payment via receipt upload system

### Utilities

- Product/shop search
- Contact form
- Category management

## 🏗️ Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind
- **Database**: PostgreSQL with Prisma (7 models)
- **Auth**: NextAuth.js + Resend email
- **Validation**: Zod schemas

## 📦 Database Models

`User`, `Shop`, `Product`, `Order`, `OrderItem`, `CartItem`, `ContactSubmission`

---

**Moved to FUTURE-FEATURES.md**: Admin systems, shop verification, hybrid user modes, advanced analytics
