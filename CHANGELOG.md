# Changelog

All notable changes to Pet Realm will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.1.0] - 2025-12-10

### 🎉 Initial Development Release

Pet Realm is a comprehensive e-commerce platform for pet supplies and services in the Maldives, connecting pet owners with local shops across atolls and islands.

### ✨ Features

#### Authentication & User Management
- Email/password registration with verification system
- Email verification with token expiry and resend capability
- Secure password reset flow with email tokens
- User profile management (view and edit)
- Account settings with password change
- NextAuth.js integration with JWT sessions (30-day expiry)
- Role-based access control (Customer/Seller)

#### Shop Management
- Multi-step shop setup wizard
- Shop profile with Maldivian location system (Atoll/Island)
- Shop storefront pages with product listings
- Shop directory (browse all shops)
- Comprehensive shop settings:
  - Basic info (name, description, logo, banner)
  - Location details (atoll, island, address)
  - Business hours configuration
  - Bank account details for payments
  - Delivery zones with custom fees
- Seller dashboard with key metrics:
  - Total revenue and order statistics
  - Recent orders overview
  - Quick access to shop management
- Shop categories: Pet Store, Veterinary Clinic, Grooming, Training, Boarding

#### Product Management
- Create products with multiple images (up to 5)
- Edit product details and pricing
- Delete products with soft delete support
- Image upload to R2 cloud storage
- Stock management with availability toggle
- Category system: Food, Toys, Healthcare, Accessories, Live Animals, Grooming, Training
- Live animal details: breed, age, gender, weight, vaccination status
- Product listing page for sellers
- Product detail pages with image gallery
- Similar product suggestions
- Low stock threshold tracking

#### E-commerce Flow
- Marketplace with search and category filters
- Product search by name
- Category-based filtering
- Shopping cart functionality:
  - Add items to cart
  - Update quantities
  - Remove items
  - Single-shop cart validation
  - Cart persistence (localStorage + database)
- Checkout process:
  - Delivery type selection (Pickup/Delivery)
  - Delivery details for shipping orders
  - Delivery zone validation
  - Delivery fee calculation based on zone
  - Order summary with itemized breakdown
- Order management:
  - Order creation with unique order numbers
  - Receipt upload system (R2 storage)
  - Order status tracking (9 states):
    - Pending → Confirmed → Preparing → Ready/Out for Delivery → Delivered/Picked Up
    - Cancelled state
  - Order timeline with timestamps for each status
  - Payment verification by sellers
  - Customer order history with search and filters
  - Seller order management interface
  - Detailed order views for both customers and sellers
  - Seller contact information on customer order pages

#### Pages & User Interface
- Homepage with hero section, categories, and featured products
- About page with mission, vision, values, and story
- Contact page with form submission
- Terms & Conditions page
- Privacy Policy page
- Responsive design for mobile, tablet, and desktop
- Active navigation state indicators
- Loading states and skeleton screens
- Toast notifications for user actions
- Error handling with user-friendly messages

#### Technical Implementation
- **48 API endpoints** with comprehensive functionality:
  - 9 Authentication endpoints
  - 12 Shop management endpoints  
  - 8 Product endpoints
  - 6 Cart endpoints
  - 5 Order endpoints
  - 5 User profile endpoints
  - 3 Utility endpoints (health, contact, categories)
- Zod validation on all API routes
- Prisma ORM with PostgreSQL database
- 7 database migrations tracking schema evolution
- R2 cloud storage for receipts and product images
- Email service integration with Resend API
- Middleware for authentication and route protection
- TypeScript throughout with strict type safety
- Comprehensive error handling with custom error classes
- Input sanitization and validation

#### Database Schema
- **7 core models**: User, Shop, Product, Order, OrderItem, CartItem, ContactSubmission
- **NextAuth models**: Account, Session, VerificationToken
- Soft delete support across models
- Decimal precision for currency fields
- JSONB for flexible data (business hours, delivery zones)
- Proper indexing and relationships
- Unique constraints for data integrity

---

## [0.8.0] - Development Milestones

### Added
- Order status timestamp tracking
- Timeline display in order detail pages
- Seller contact details card for customers
- Unified email template design
- Active navigation indicators in headers
- Delivery zone validation in checkout

### Fixed
- Responsive design issues across all pages
- Order ID overflow on mobile devices
- Receipt modal sizing on small screens
- Footer jumping due to inconsistent min-heights
- Profile page order totals not displaying
- Password reset flow with async searchParams (Next.js 15)
- Image management buttons hidden on mobile (hover-only)
- Tab navigation scrolling on mobile
- Prisma client regeneration after migrations

### Changed
- Next.js 15.1 with App Router
- Async searchParams handling
- Image buttons always visible (below image)
- Scrollable tab navigation for better mobile UX

---

## Database Migrations

### 20251204161457 - Order Status Timestamps
Added timestamp tracking for order lifecycle:
- `confirmedAt`, `preparingAt`, `readyAt`
- `outForDeliveryAt`, `deliveredAt`, `pickedUpAt`, `cancelledAt`

### 20251130064411 - Add Tax Field
Added `tax` field to Order model for GST calculations

### 20251128080239 - Restructure Business Hours and Delivery
Restructured business hours and delivery zone storage using JSONB

### 20251127183551 - Add Verified Payment Status
Added payment verification fields:
- `receiptVerifiedAt`, `receiptVerifiedBy`, `receiptNotes`

### 20251125190845 - Add Shop Bank Fields
Added bank account fields to Shop model for payment processing

### 20251114092157 - Add NextAuth Models
Added NextAuth.js authentication models (Account, Session, VerificationToken)

### 20251107160645 - Initial Schema
Initial database schema with core models

---

## Tech Stack

- **Framework**: Next.js 15.1 with App Router
- **Language**: TypeScript 5
- **Database**: PostgreSQL with Prisma ORM 6.19
- **Authentication**: NextAuth.js with JWT sessions
- **Styling**: Tailwind CSS 4
- **Email**: Resend API
- **Storage**: Cloudflare R2 (AWS S3-compatible)
- **Validation**: Zod schemas
- **UI Components**: Radix UI primitives
- **Package Manager**: pnpm

---

## Known Limitations

- No payment gateway integration (manual receipt verification via upload only)
- Users can only be Customer OR Seller, not both (mode switching planned for v0.5.0)
- No product or shop reviews/ratings (planned for v0.4.0)
- Customers cannot cancel orders after placement (planned for v0.5.0)
- Single delivery address per order (address book planned for v0.3.0)
- No search autocomplete or suggestions (planned for v0.2.0)
- No social login options (email/password only) (planned for v0.2.0)
- JWT sessions cannot be instantly revoked (considering database sessions in v0.5.0)

---

## Security

- Password hashing with bcrypt
- Email verification required for account activation
- HTTP-only cookies for session tokens
- CSRF protection via NextAuth
- Input validation and sanitization on all endpoints
- SQL injection prevention via Prisma parameterized queries
- Environment variable protection for sensitive data
- Soft delete for data retention and recovery

---

## Performance Considerations

- Image optimization via Next.js Image component
- Lazy loading for marketplace products
- Database query optimization with proper indexes
- JWT sessions (no database lookups on every request)
- R2 cloud storage for fast asset delivery
- Skeleton loading states for perceived performance

---

## Future Roadmap

Detailed feature planning and issue tracking available on [GitHub Projects](https://github.com/MystSugar/pet-realm/projects).

---

## Contributing

This is a personal learning project focused on understanding GitHub workflows, versioning, and professional development practices.

---

## License

Proprietary - All rights reserved

---

**Note**: This project is under active development. Features and functionality may change between versions.
