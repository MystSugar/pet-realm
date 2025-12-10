# GitHub Issues - Pet Realm

> Complete list of features, enhancements, and bugs organized by version milestone

This document serves as a reference for creating GitHub Issues. Each item should be created as a separate issue with the labels, priority, and size indicated.

---

## 🏷️ Label Guide

### Priority
- `P0-critical` - Blocking issues, production down
- `P1-high` - Important features for next release
- `P2-medium` - Nice to have, not blocking
- `P3-low` - Future consideration

### Size (Time Estimate)
- `XS` - < 2 hours
- `S` - 2-4 hours  
- `M` - 1-2 days
- `L` - 3-5 days
- `XL` - 1+ weeks

### Type
- `feature` - New functionality
- `enhancement` - Improvement to existing feature
- `bug` - Something broken
- `docs` - Documentation
- `chore` - Maintenance, refactoring

### Area
- `auth` - Authentication/Authorization
- `shop` - Shop management
- `orders` - Order system
- `products` - Product management
- `ui` - User interface
- `api` - Backend API
- `database` - Database schema

---

## 📋 v0.2.0 - Search & Authentication

**Milestone**: v0.2.0  
**Target**: Q1 2025  
**Theme**: Improve product discovery and login options

---

### 🔍 Search & Discovery

#### Issue #1: Search Dropdown with Autocomplete Suggestions
**Labels**: `feature`, `P1-high`, `L`, `ui`, `api`  
**User Story**: As a customer, I want to see product suggestions as I type in the search box so I can quickly find what I'm looking for.

**Acceptance Criteria**:
- [ ] Dropdown appears after typing 2+ characters
- [ ] Shows top 5 matching products with images and prices
- [ ] Click suggestion to go directly to product page
- [ ] Keyboard navigation (arrow keys, enter)
- [ ] Debounced API calls (300ms)
- [ ] Empty state when no results
- [ ] "View all results" link at bottom

**Technical Notes**:
- Create `/api/products/suggestions` endpoint
- Use fuzzy search on product name
- Cache recent searches
- Mobile-responsive dropdown

---

#### Issue #2: Price Range Filter in Marketplace
**Labels**: `feature`, `P2-medium`, `M`, `ui`, `api`  
**User Story**: As a customer, I want to filter products by price range so I can find items within my budget.

**Acceptance Criteria**:
- [ ] Min and max price input fields
- [ ] Slider UI for visual price selection
- [ ] "Apply" button to filter results
- [ ] Clear filter button
- [ ] Update URL params for shareable links
- [ ] Display active filter badge
- [ ] Validate min < max

**Technical Notes**:
- Update `/api/products` to accept `minPrice`/`maxPrice` query params
- Add Prisma query filters
- Use Radix Slider component

---

#### Issue #3: Advanced Search Filters
**Labels**: `enhancement`, `P2-medium`, `M`, `ui`, `api`  
**User Story**: As a customer, I want more filtering options so I can narrow down my search effectively.

**Acceptance Criteria**:
- [ ] "In Stock Only" toggle
- [ ] Sort by: Price (Low/High), Date Added, Name
- [ ] Filter by shop location (atoll/island)
- [ ] Filter panel responsive on mobile
- [ ] Clear all filters button
- [ ] Filter count badge

**Technical Notes**:
- Extend `/api/products` query params
- Add sorting logic in Prisma query
- Persist filters in URL

---

#### Issue #4: Search History
**Labels**: `enhancement`, `P3-low`, `S`, `ui`  
**User Story**: As a customer, I want to see my recent searches so I can quickly repeat common searches.

**Acceptance Criteria**:
- [ ] Store last 10 searches in localStorage
- [ ] Display below search bar when focused
- [ ] Click to search again
- [ ] Delete individual searches
- [ ] Clear all history button

**Technical Notes**:
- Client-side only (localStorage)
- No backend changes needed

---

#### Issue #5: Trending Products Section
**Labels**: `feature`, `P3-low`, `L`, `ui`, `api`  
**User Story**: As a customer, I want to see what products are popular so I can discover trending items.

**Acceptance Criteria**:
- [ ] "Trending Now" section on homepage
- [ ] Based on views/orders in last 7 days
- [ ] Show top 8 products
- [ ] Update daily via cron job
- [ ] Mobile carousel

**Technical Notes**:
- Add `viewCount` to Product model
- Create trending calculation endpoint
- Cache results for 24 hours

---

### 🔐 Authentication Enhancements

#### Issue #6: Google OAuth Login
**Labels**: `feature`, `P1-high`, `L`, `auth`, `api`  
**User Story**: As a user, I want to sign in with Google so I can avoid creating another password.

**Acceptance Criteria**:
- [ ] "Continue with Google" button on signin page
- [ ] OAuth flow with Google
- [ ] Auto-create account if new user
- [ ] Link to existing account if email matches
- [ ] Profile picture from Google
- [ ] Handle OAuth errors gracefully

**Technical Notes**:
- Add Google provider to NextAuth config
- Set up Google Cloud Console OAuth client
- Store OAuth account in Account model
- Update UI with Google branding guidelines

---

#### Issue #7: Facebook OAuth Login
**Labels**: `feature`, `P1-high`, `L`, `auth`, `api`  
**User Story**: As a user, I want to sign in with Facebook so I can use my existing social account.

**Acceptance Criteria**:
- [ ] "Continue with Facebook" button
- [ ] OAuth flow with Facebook
- [ ] Same account linking logic as Google
- [ ] Handle permission errors
- [ ] Facebook branding compliance

**Technical Notes**:
- Add Facebook provider to NextAuth
- Set up Meta for Developers app
- Test with Facebook app review requirements

---

#### Issue #8: Apple Sign In
**Labels**: `feature`, `P3-low`, `L`, `auth`, `api`  
**User Story**: As an iOS user, I want to sign in with Apple ID for privacy and convenience.

**Acceptance Criteria**:
- [ ] "Sign in with Apple" button
- [ ] Works on iOS, macOS, and web
- [ ] Handle private email relay
- [ ] Compliance with Apple guidelines

**Technical Notes**:
- Requires Apple Developer account
- More complex setup than Google/Facebook
- Consider for iOS app version

---

### 📍 Multiple Delivery Addresses

#### Issue #9: Address Book Management
**Labels**: `feature`, `P1-high`, `L`, `ui`, `api`, `database`  
**User Story**: As a customer, I want to save multiple delivery addresses so I can easily ship to different locations.

**Acceptance Criteria**:
- [ ] Create `Address` model in database
- [ ] User profile page "My Addresses" section
- [ ] Add new address form
- [ ] Edit existing addresses
- [ ] Delete addresses
- [ ] Set default address
- [ ] Address validation (atoll/island)
- [ ] Label addresses (Home, Work, etc.)

**Technical Notes**:
- New Prisma model: `Address` (one-to-many with User)
- Fields: label, atoll, island, address, phone, isDefault
- API endpoints: CRUD for addresses
- Unique constraint on isDefault per user

---

#### Issue #10: Select Address During Checkout
**Labels**: `enhancement`, `P1-high`, `M`, `ui`, `api`  
**User Story**: As a customer, I want to choose from my saved addresses during checkout instead of typing it each time.

**Acceptance Criteria**:
- [ ] Checkout shows saved addresses as cards
- [ ] Radio buttons to select address
- [ ] "Use a different address" option
- [ ] Show address details clearly
- [ ] Pre-select default address
- [ ] Validate against shop delivery zones

**Technical Notes**:
- Update checkout UI
- Modify `/api/checkout` to accept `addressId`
- Backward compatible with manual address entry

---

#### Issue #11: Quick Add Address in Checkout
**Labels**: `enhancement`, `P2-medium`, `M`, `ui`  
**User Story**: As a customer, I want to add a new address without leaving checkout if I don't have one saved.

**Acceptance Criteria**:
- [ ] "+ Add New Address" button in checkout
- [ ] Modal with address form
- [ ] Save to address book checkbox
- [ ] Immediately usable after saving

**Technical Notes**:
- Reuse address form component
- Modal overlay with Radix Dialog

---

### 📧 Email Notifications

#### Issue #12: Order Confirmation Email
**Labels**: `feature`, `P1-high`, `M`, `api`  
**User Story**: As a customer, I want to receive an email when my order is confirmed so I know the shop received it.

**Acceptance Criteria**:
- [ ] Email sent when order status → CONFIRMED
- [ ] Include order number, items, total
- [ ] Shop contact details
- [ ] Link to order tracking page
- [ ] Professional email template

**Technical Notes**:
- Trigger in `/api/shop/orders/[id]/status`
- Use Resend API
- Create reusable order email template

---

#### Issue #13: Order Status Update Emails
**Labels**: `feature`, `P1-high`, `M`, `api`  
**User Story**: As a customer, I want email updates when my order status changes so I stay informed.

**Acceptance Criteria**:
- [ ] Email for: PREPARING, READY, OUT_FOR_DELIVERY, DELIVERED
- [ ] Status-specific messages
- [ ] Estimated delivery time (if available)
- [ ] Tracking link
- [ ] Shop contact for questions

**Technical Notes**:
- Trigger on status updates
- Different templates per status
- Queue system for reliability (consider Bull/BullMQ)

---

#### Issue #14: Receipt Verification Email
**Labels**: `feature`, `P2-medium`, `S`, `api`  
**User Story**: As a customer, I want confirmation when my payment receipt is verified so I know payment is accepted.

**Acceptance Criteria**:
- [ ] Email when receipt verified
- [ ] Show verified amount
- [ ] Next steps (order will be prepared)
- [ ] Receipt image reference

**Technical Notes**:
- Trigger in `/api/shop/orders/[id]/verify-payment`
- Include receipt URL or reference number

---

#### Issue #15: Welcome Email Series
**Labels**: `enhancement`, `P3-low`, `M`, `api`  
**User Story**: As a new user, I want helpful emails after signing up to learn about the platform.

**Acceptance Criteria**:
- [ ] Welcome email immediately after verification
- [ ] Tips email after 1 day
- [ ] Feature highlights after 3 days
- [ ] Unsubscribe option

**Technical Notes**:
- Schedule with cron job or email service automation
- Track email opens/clicks (optional analytics)

---

### 💰 GST Tax System (8%)

#### Issue #16: Enable 8% Tax Calculation
**Labels**: `feature`, `P1-high`, `M`, `api`  
**User Story**: As a customer, I want to see the 8% GST tax applied to my orders as per Maldivian law.

**Acceptance Criteria**:
- [ ] Apply 8% tax to all products
- [ ] Calculate: subtotal × 0.08
- [ ] Display tax line item in checkout
- [ ] Store tax amount in Order model
- [ ] Show tax in order details

**Technical Notes**:
- Update `/api/checkout` to calculate tax
- Tax = subtotal × 0.08
- Round to 2 decimals (MVR)
- No need for tax categories (all products are 8%)

---

#### Issue #17: Tax Display on Orders
**Labels**: `enhancement`, `P1-high`, `S`, `ui`  
**User Story**: As a customer, I want to see the tax breakdown on my order.

**Acceptance Criteria**:
- [ ] Order summary shows:
  - Subtotal
  - Tax (8%)
  - Delivery fee
  - **Total**
- [ ] Clearly labeled "GST (8%)"
- [ ] Format currency properly (MVR)

**Technical Notes**:
- Update checkout and order detail components
- Show: "Tax (8%): MVR X.XX"

---

#### Issue #18: Remove Tax Configuration (Not Needed)
**Labels**: `chore`, `P3-low`, `XS`  
**Description**: Tax rate is fixed at 8% by law, no need for admin configuration panel.

**Note**: If tax rate changes in future, update as code change with proper testing.

---

### ⭐ Reviews & Ratings

#### Issue #20: Product Review System
**Labels**: `feature`, `P1-high`, `XL`, `database`, `api`, `ui`  
**User Story**: As a customer, I want to leave reviews on products I've purchased so I can help other buyers.

**Acceptance Criteria**:
- [ ] Review model: rating (1-5), comment, userId, productId, orderId
- [ ] Only customers who purchased can review
- [ ] One review per product per user
- [ ] Edit/delete own reviews
- [ ] Display reviews on product page
- [ ] Average rating calculation
- [ ] Star rating display
- [ ] Sort reviews: Most Recent, Highest Rated, Lowest Rated
- [ ] Helpful votes on reviews (optional)

**Technical Notes**:
- New Prisma model: `ProductReview`
- Composite unique index: (userId, productId)
- Validation: order must be DELIVERED or PICKED_UP
- Calculate avgRating in Product model (or computed)

---

#### Issue #21: Shop Rating System
**Labels**: `feature`, `P2-medium`, `L`, `database`, `api`, `ui`  
**User Story**: As a customer, I want to rate shops based on my overall experience.

**Acceptance Criteria**:
- [ ] ShopReview model: rating, comment, userId, shopId, orderId
- [ ] Rate after order completion
- [ ] Categories: Product Quality, Service, Delivery Speed
- [ ] Shop page shows average rating
- [ ] Display recent reviews
- [ ] Shop responds to reviews (optional)

**Technical Notes**:
- Similar to product reviews
- Aggregate ratings by category
- Display on shop page prominently

---

#### Issue #22: Review Moderation
**Labels**: `enhancement`, `P3-low`, `L`, `admin`  
**User Story**: As a platform admin, I want to moderate reviews to remove inappropriate content.

**Acceptance Criteria**:
- [ ] Report review button
- [ ] Admin review moderation panel
- [ ] Hide/unhide reviews
- [ ] Ban users for abuse
- [ ] Automated profanity filter

**Technical Notes**:
- Requires admin dashboard (v2.0.0)
- Consider third-party moderation API

---

### 🐛 Bug Fixes & Polish

#### Issue #23: Fix Tax Field Always Zero
**Labels**: `bug`, `P1-high`, `S`, `api`  
**Description**: Tax field in orders is always 0 because there's no calculation logic.

**Steps to Reproduce**:
1. Place an order
2. Check order details
3. Tax shows 0.00

**Expected**: Tax should be 8% of subtotal (or based on product categories once implemented)

**Fix**: Blocked by Issue #16 and #17

---

#### Issue #24: Session Expiry Not Configurable
**Labels**: `enhancement`, `P2-medium`, `S`, `auth`, `api`  
**Description**: JWT sessions use NextAuth default (30 days), not explicitly set.

**Acceptance Criteria**:
- [ ] Add `maxAge` to JWT options in `auth.ts`
- [ ] Set to 30 days explicitly (or make configurable)
- [ ] Document in README

**Technical Notes**:
```typescript
session: { 
  strategy: "jwt",
  maxAge: 30 * 24 * 60 * 60, // 30 days
}
```

---

#### Issue #25: Cart localStorage Sync Issues
**Labels**: `bug`, `P2-medium`, `M`, `ui`, `api`  
**Description**: Cart uses both localStorage and database, sometimes out of sync.

**Acceptance Criteria**:
- [ ] Merge logic: database as source of truth
- [ ] Sync localStorage on page load
- [ ] Clear localStorage on logout
- [ ] Handle race conditions

---

#### Issue #26: Mobile Product Images Not Responsive
**Labels**: `bug`, `P2-medium`, `S`, `ui`  
**Description**: Product images in gallery don't scale properly on small screens.

**Fix**: Use Next.js Image with responsive sizes

---

#### Issue #27: Order Number Generation Collision Risk
**Labels**: `bug`, `P1-high`, `M`, `api`  
**Description**: Order numbers use timestamp-based generation, potential collisions.

**Solution**: Use UUID or increment with database sequence

---

---

## 📋 v1.1.0 - User Experience Improvements

**Milestone**: v1.1.0  
**Target**: Q2 2025  
**Theme**: Enhanced usability and flexibility

---

### 🔄 Account Mode Switching

#### Issue #28: Hybrid User Account Support
**Labels**: `feature`, `P1-high`, `XL`, `database`, `api`, `ui`  
**User Story**: As a user with a shop, I want to switch between Customer and Seller modes without separate accounts.

**Acceptance Criteria**:
- [ ] Remove accountType enforcement
- [ ] Add `currentMode` to session state
- [ ] Mode toggle in header (when user has shop)
- [ ] Switch between Customer and Seller headers
- [ ] Redirect to appropriate dashboard
- [ ] Persist last mode preference
- [ ] Different navigation based on mode
- [ ] Cart works in customer mode only

**Technical Notes**:
- Update User model: `currentMode` field
- Middleware checks mode instead of accountType
- Session includes both role and currentMode
- UI changes based on mode, not role

---

#### Issue #29: Switch to Database Sessions
**Labels**: `enhancement`, `P2-medium`, `L`, `auth`, `api`, `database`  
**User Story**: As a developer, I want database sessions so mode switching updates immediately without re-login.

**Acceptance Criteria**:
- [ ] Change NextAuth strategy to "database"
- [ ] Use Session model from Prisma
- [ ] Update callbacks to use database
- [ ] Migrate existing JWT users
- [ ] Session cleanup cron job
- [ ] Test performance impact

**Technical Notes**:
- Update `auth.ts`: `session: { strategy: "database" }`
- Requires Prisma adapter fully configured
- Expiry: 30 days, cleanup old sessions weekly

---

#### Issue #30: Mode Indicator UI
**Labels**: `enhancement`, `P2-medium`, `S`, `ui`  
**User Story**: As a user, I want to clearly see which mode I'm in so I don't get confused.

**Acceptance Criteria**:
- [ ] Badge showing current mode
- [ ] Different color schemes per mode
- [ ] Breadcrumb mode indicator
- [ ] Confirmation modal when switching

**Technical Notes**:
- Customer mode: Blue/default theme
- Seller mode: Green/teal theme
- Use Tailwind CSS variables for dynamic theming

---

### 📊 Better Filtering & Search

#### Issue #31: Persistent Filter Preferences
**Labels**: `enhancement`, `P3-low`, `M`, `ui`  
**User Story**: As a customer, I want my filter preferences saved so I don't have to reapply them.

**Acceptance Criteria**:
- [ ] Remember last filters in localStorage
- [ ] Auto-apply on return visits
- [ ] "Reset to defaults" button
- [ ] Per-user preferences (when logged in)

---

#### Issue #32: Shop Location Filter
**Labels**: `feature`, `P2-medium`, `M`, `ui`, `api`  
**User Story**: As a customer, I want to filter by shop location to find nearby sellers.

**Acceptance Criteria**:
- [ ] Filter by atoll dropdown
- [ ] Filter by island (dependent on atoll)
- [ ] "Near me" option (if location enabled)
- [ ] Update products based on shop location

---

#### Issue #33: Save Search Feature
**Labels**: `enhancement`, `P3-low`, `M`, `ui`, `database`, `api`  
**User Story**: As a customer, I want to save searches and get notifications when matching products are added.

**Acceptance Criteria**:
- [ ] "Save this search" button
- [ ] SavedSearch model in database
- [ ] Email when new matches appear
- [ ] Manage saved searches page

---

### ❌ Order Management

#### Issue #34: Customer Order Cancellation
**Labels**: `feature`, `P1-high`, `M`, `api`, `ui`  
**User Story**: As a customer, I want to cancel my order before it's prepared so I can change my mind.

**Acceptance Criteria**:
- [ ] Cancel button on order page
- [ ] Only allow if status is PENDING or CONFIRMED
- [ ] Confirmation modal
- [ ] Email notification to seller
- [ ] Refund process (manual for now)
- [ ] Update status to CANCELLED
- [ ] Set cancelledAt timestamp

**Technical Notes**:
- New API endpoint: `PATCH /api/orders/[id]/cancel`
- Validate order belongs to user
- Prevent cancel after PREPARING

---

#### Issue #35: Seller Cancel Order
**Labels**: `feature`, `P2-medium`, `M`, `api`, `ui`  
**User Story**: As a seller, I want to cancel orders I cannot fulfill (e.g., out of stock).

**Acceptance Criteria**:
- [ ] Cancel button in seller order view
- [ ] Reason required
- [ ] Email to customer with reason
- [ ] Restore product stock
- [ ] Cancel at any stage

---

#### Issue #36: Order Edit Before Confirmation
**Labels**: `enhancement`, `P3-low`, `L`, `ui`, `api`  
**User Story**: As a customer, I want to edit my order items before the shop confirms it.

**Acceptance Criteria**:
- [ ] Edit items while PENDING
- [ ] Update quantities or remove items
- [ ] Recalculate total
- [ ] Cannot edit after CONFIRMED

**Technical Notes**:
- Complex logic, consider for v1.2.0

---

#### Issue #37: Refund Management
**Labels**: `feature`, `P3-low`, `XL`, `database`, `api`, `ui`  
**User Story**: As a customer, I want to request a refund if there's an issue with my order.

**Acceptance Criteria**:
- [ ] Refund request form
- [ ] Refund model in database
- [ ] Seller approves/rejects
- [ ] Refund status tracking
- [ ] Admin oversight (v2.0.0)

---

### 🔔 Notification System

#### Issue #38: In-App Notification Center
**Labels**: `feature`, `P2-medium`, `XL`, `database`, `api`, `ui`  
**User Story**: As a user, I want to see notifications in the app so I don't miss updates.

**Acceptance Criteria**:
- [ ] Notification bell icon in header
- [ ] Unread count badge
- [ ] Notification dropdown
- [ ] Types: Order updates, Messages, System
- [ ] Mark as read/unread
- [ ] Clear all notifications
- [ ] Link to relevant pages

**Technical Notes**:
- New model: `Notification`
- Real-time updates (consider Pusher or polling)
- Store in database for history

---

#### Issue #39: SMS Notifications (Optional)
**Labels**: `enhancement`, `P3-low`, `L`, `api`  
**User Story**: As a customer, I want SMS updates for critical order events.

**Acceptance Criteria**:
- [ ] Integrate SMS provider (Twilio, MessageBird)
- [ ] Send SMS for: Order Confirmed, Out for Delivery, Delivered
- [ ] Opt-in/opt-out settings
- [ ] Cost consideration

**Technical Notes**:
- Requires paid SMS service
- May be expensive for Maldives numbers

---

---

## 📋 v1.2.0 - Engagement & Retention

**Milestone**: v1.2.0  
**Target**: Q2-Q3 2025  
**Theme**: Keep users engaged

---

### 📱 User Features

#### Issue #40: Wishlist / Favorites
**Labels**: `feature`, `P2-medium`, `L`, `database`, `api`, `ui`  
**User Story**: As a customer, I want to save products I like for later.

**Acceptance Criteria**:
- [ ] Heart icon on products
- [ ] Wishlist page
- [ ] Add/remove from wishlist
- [ ] Email when item on sale (future)

---

#### Issue #41: Order Again Quick Action
**Labels**: `enhancement`, `P2-medium`, `M`, `ui`, `api`  
**User Story**: As a customer, I want to quickly reorder items from past orders.

**Acceptance Criteria**:
- [ ] "Order Again" button on order history
- [ ] Adds all items to cart
- [ ] Check stock availability first
- [ ] Show which items unavailable

---

#### Issue #42: Share Product Link
**Labels**: `feature`, `P3-low`, `S`, `ui`  
**User Story**: As a customer, I want to share products with friends.

**Acceptance Criteria**:
- [ ] Share button on product page
- [ ] Copy link option
- [ ] Social share buttons (WhatsApp, FB, Twitter)
- [ ] Open Graph meta tags

---

### 🏪 Shop Features

#### Issue #43: Shop Followers
**Labels**: `feature`, `P2-medium`, `M`, `database`, `api`, `ui`  
**User Story**: As a customer, I want to follow shops I like to see their updates.

**Acceptance Criteria**:
- [ ] Follow/Unfollow button on shop page
- [ ] Follower count display
- [ ] "My Shops" page showing followed shops
- [ ] Notifications when shop adds products

**Technical Notes**:
- New model: `ShopFollower` (userId, shopId)
- Unique constraint

---

#### Issue #44: Shop Announcements
**Labels**: `feature`, `P2-medium`, `M`, `database`, `api`, `ui`  
**User Story**: As a seller, I want to post announcements for my customers.

**Acceptance Criteria**:
- [ ] Create announcement in seller dashboard
- [ ] Display on shop page
- [ ] Types: Sale, New Product, Holiday Hours
- [ ] Expiry date
- [ ] Email to followers (optional)

---

#### Issue #45: Shop Social Media Links
**Labels**: `enhancement`, `P3-low`, `S`, `database`, `ui`  
**User Story**: As a seller, I want to add my social media links to my shop page.

**Acceptance Criteria**:
- [ ] Fields: Facebook, Instagram, WhatsApp
- [ ] Display as icons on shop page
- [ ] Validate URLs

---

### 💸 Marketing & Promotions

#### Issue #46: Discount Codes System
**Labels**: `feature`, `P2-medium`, `XL`, `database`, `api`, `ui`  
**User Story**: As a seller, I want to create discount codes to attract customers.

**Acceptance Criteria**:
- [ ] Create discount codes (% or fixed amount)
- [ ] Expiry date and usage limits
- [ ] Apply code at checkout
- [ ] Validate code
- [ ] Display discounted total
- [ ] Track usage

**Technical Notes**:
- New model: `DiscountCode`
- Apply in checkout calculation

---

#### Issue #47: Flash Sales
**Labels**: `feature`, `P3-low`, `L`, `database`, `api`, `ui`  
**User Story**: As a seller, I want to run limited-time sales on products.

**Acceptance Criteria**:
- [ ] Set sale price and duration
- [ ] Display countdown timer
- [ ] Badge: "Sale ends in X hours"
- [ ] Auto-revert to regular price
- [ ] Featured on homepage

---

#### Issue #48: Bundle Deals
**Labels**: `feature`, `P3-low`, `L`, `database`, `api`  
**User Story**: As a seller, I want to create product bundles at discounted prices.

**Acceptance Criteria**:
- [ ] Create bundle (multiple products)
- [ ] Bundle price
- [ ] Display as single product
- [ ] Inventory management for bundles

---

---

## 📋 v2.0.0 - Platform Expansion

**Milestone**: v2.0.0  
**Target**: Q3-Q4 2025  
**Theme**: Admin tools and new verticals

---

### 👑 Admin System

#### Issue #49: Admin Dashboard
**Labels**: `feature`, `P1-high`, `XL`, `admin`, `ui`, `api`  
**User Story**: As a platform admin, I want a dashboard to manage the platform.

**Acceptance Criteria**:
- [ ] Admin role and permissions
- [ ] Overview stats: Users, Shops, Orders, Revenue
- [ ] Charts and graphs
- [ ] Quick actions
- [ ] Recent activity feed

---

#### Issue #50: User Management Panel
**Labels**: `feature`, `P1-high`, `L`, `admin`, `ui`, `api`  
**User Story**: As an admin, I want to manage user accounts.

**Acceptance Criteria**:
- [ ] List all users with search
- [ ] View user details
- [ ] Ban/unban users
- [ ] Soft delete accounts
- [ ] Restore deleted accounts
- [ ] Reset passwords
- [ ] Audit log

---

#### Issue #51: Shop Verification System
**Labels**: `feature`, `P1-high`, `XL`, `admin`, `database`, `api`, `ui`  
**User Story**: As an admin, I want to verify shops before they go live to ensure quality.

**Acceptance Criteria**:
- [ ] Shop submits verification request
- [ ] Upload business license
- [ ] Upload ID verification
- [ ] Admin reviews submission
- [ ] Approve/reject with notes
- [ ] Verified badge on shop page
- [ ] Only verified shops visible to customers (optional)

**Technical Notes**:
- Add `verificationStatus` enum to Shop
- Document upload to R2
- Email notifications on status change

---

#### Issue #52: Content Moderation Tools
**Labels**: `feature`, `P2-medium`, `L`, `admin`, `ui`  
**User Story**: As an admin, I want to moderate products, reviews, and shops.

**Acceptance Criteria**:
- [ ] Flag system for reports
- [ ] Review flagged content
- [ ] Hide/delete inappropriate content
- [ ] Ban users for violations
- [ ] Automated filters (profanity, spam)

---

#### Issue #53: Platform Analytics
**Labels**: `feature`, `P2-medium`, `L`, `admin`, `api`, `ui`  
**User Story**: As an admin, I want detailed analytics about platform usage.

**Acceptance Criteria**:
- [ ] User growth charts
- [ ] Revenue reports
- [ ] Popular products/shops
- [ ] Geographic distribution (by atoll)
- [ ] Conversion funnel
- [ ] Export reports (CSV/PDF)

---

### 🐾 Pet Management System

#### Issue #54: Pet Profile Creation
**Labels**: `feature`, `P1-high`, `L`, `database`, `api`, `ui`  
**User Story**: As a pet owner, I want to create profiles for my pets to track their information.

**Acceptance Criteria**:
- [ ] Pet model: name, species, breed, age, gender, weight
- [ ] Upload pet photos
- [ ] Multiple pets per user
- [ ] Pet bio and personality
- [ ] Medical info (optional)

**Technical Notes**:
- New model: `Pet` (belongs to User)
- Categories: Dog, Cat, Bird, Fish, Reptile, Other

---

#### Issue #55: Pet Breed Database
**Labels**: `feature`, `P2-medium`, `M`, `database`, `api`  
**User Story**: As a user, I want to select from a list of breeds when adding my pet.

**Acceptance Criteria**:
- [ ] Breed database (dogs, cats)
- [ ] Searchable dropdown
- [ ] Breed characteristics
- [ ] Common health issues
- [ ] Care recommendations

**Technical Notes**:
- Seed database with common breeds
- API: Dog API / Cat API for data

---

#### Issue #56: Medical Records Tracking
**Labels**: `feature`, `P1-high`, `L`, `database`, `api`, `ui`  
**User Story**: As a pet owner, I want to track my pet's medical history.

**Acceptance Criteria**:
- [ ] MedicalRecord model
- [ ] Types: Vaccination, Checkup, Surgery, Medication
- [ ] Date, vet, notes, attachments
- [ ] Timeline view
- [ ] Share with vets

---

#### Issue #57: Vaccination Tracking
**Labels**: `feature`, `P1-high`, `M`, `ui`, `api`  
**User Story**: As a pet owner, I want to track vaccinations and get reminders.

**Acceptance Criteria**:
- [ ] Vaccination schedule
- [ ] Record vaccine name, date, next due
- [ ] Reminder 1 week before due
- [ ] Email/SMS reminder
- [ ] Certificate upload

---

#### Issue #58: Health Reminders
**Labels**: `feature`, `P2-medium`, `M`, `api`  
**User Story**: As a pet owner, I want reminders for health checkups and medications.

**Acceptance Criteria**:
- [ ] Set custom reminders
- [ ] Types: Medication, Checkup, Grooming, etc.
- [ ] Frequency: Daily, Weekly, Monthly, Yearly
- [ ] Push/Email notifications

---

### 🏥 Veterinary Services

#### Issue #59: Vet Clinic Listings
**Labels**: `feature`, `P1-high`, `L`, `database`, `api`, `ui`  
**User Story**: As a pet owner, I want to find veterinary clinics near me.

**Acceptance Criteria**:
- [ ] VetClinic model (similar to Shop)
- [ ] Clinic profile page
- [ ] Services offered
- [ ] Operating hours
- [ ] Contact info
- [ ] Location map

---

#### Issue #60: Appointment Booking System
**Labels**: `feature`, `P1-high`, `XL`, `database`, `api`, `ui`  
**User Story**: As a pet owner, I want to book vet appointments online.

**Acceptance Criteria**:
- [ ] Appointment model
- [ ] Calendar view for availability
- [ ] Select pet, service, time slot
- [ ] Confirmation email
- [ ] Reminder 24hrs before
- [ ] Cancel/reschedule
- [ ] Vet manages availability

---

#### Issue #61: Medical Record Sharing
**Labels**: `feature`, `P2-medium`, `L`, `api`, `ui`  
**User Story**: As a pet owner, I want to share my pet's records with vets during appointments.

**Acceptance Criteria**:
- [ ] Share button on pet profile
- [ ] Generate shareable link
- [ ] Vet access code
- [ ] Expiry time
- [ ] View-only access

---

#### Issue #62: Emergency Vet Contacts
**Labels**: `feature`, `P1-high`, `S`, `ui`  
**User Story**: As a pet owner, I want quick access to emergency vet numbers.

**Acceptance Criteria**:
- [ ] Emergency contacts page
- [ ] By atoll/island
- [ ] 24/7 availability indicator
- [ ] One-tap call buttons
- [ ] Mobile-optimized

---

### 🎓 Pet Services

#### Issue #63: Pet Service Provider Listings
**Labels**: `feature`, `P2-medium`, `L`, `database`, `api`, `ui`  
**User Story**: As a pet owner, I want to find trainers, groomers, and sitters.

**Acceptance Criteria**:
- [ ] ServiceProvider model
- [ ] Types: Training, Grooming, Sitting, Walking
- [ ] Provider profiles
- [ ] Services and pricing
- [ ] Reviews and ratings
- [ ] Search and filter

---

#### Issue #64: Service Booking System
**Labels**: `feature`, `P2-medium`, `XL`, `database`, `api`, `ui`  
**User Story**: As a pet owner, I want to book pet services online.

**Acceptance Criteria**:
- [ ] Similar to vet appointments
- [ ] Service-specific questions
- [ ] Pricing calculation
- [ ] Provider accepts/rejects
- [ ] Payment integration

---

### 💬 Community Features

#### Issue #65: Community Forum
**Labels**: `feature`, `P2-medium`, `XL`, `database`, `api`, `ui`  
**User Story**: As a pet owner, I want to discuss pet care with other owners.

**Acceptance Criteria**:
- [ ] Forum categories (by pet type)
- [ ] Create topics and replies
- [ ] Upvote/downvote
- [ ] User reputation
- [ ] Moderation tools
- [ ] Search topics

**Technical Notes**:
- Models: Topic, Reply, Vote
- Consider using existing forum software (Discourse, Flarum)

---

#### Issue #66: Lost & Found Pets
**Labels**: `feature`, `P1-high`, `L`, `database`, `api`, `ui`  
**User Story**: As a pet owner, I want to post about lost pets to help find them.

**Acceptance Criteria**:
- [ ] Create lost/found listings
- [ ] Upload photos
- [ ] Location details
- [ ] Contact info
- [ ] Mark as found
- [ ] Email alerts for nearby users
- [ ] Success stories

---

#### Issue #67: Pet Adoption Platform
**Labels**: `feature`, `P2-medium`, `XL`, `database`, `api`, `ui`  
**User Story**: As a user, I want to adopt pets or list pets for adoption.

**Acceptance Criteria**:
- [ ] Adoption listings
- [ ] Pet details and photos
- [ ] Adoption requirements
- [ ] Application form
- [ ] Screening process
- [ ] Success tracking

---

---

## 📋 v3.0.0 - Advanced Features

**Milestone**: v3.0.0  
**Target**: 2026  
**Theme**: Scalability and advanced tools

---

### 🚀 Platform Enhancements

#### Issue #68: Multi-Shop Support per Seller
**Labels**: `feature`, `P2-medium`, `XL`, `database`, `api`, `ui`  
**User Story**: As a seller, I want to manage multiple shops from one account.

**Acceptance Criteria**:
- [ ] Remove unique constraint on Shop.ownerId
- [ ] Shop switcher in seller header
- [ ] Create new shop flow
- [ ] Shop-specific dashboards
- [ ] Centralized inventory (optional)

---

#### Issue #69: Shop Analytics Dashboard
**Labels**: `feature`, `P2-medium`, `L`, `ui`, `api`  
**User Story**: As a seller, I want detailed analytics about my shop performance.

**Acceptance Criteria**:
- [ ] Revenue charts (daily, weekly, monthly)
- [ ] Top products
- [ ] Customer demographics
- [ ] Traffic sources
- [ ] Conversion rates
- [ ] Inventory insights

---

#### Issue #70: Bulk Product Operations
**Labels**: `enhancement`, `P2-medium`, `M`, `ui`, `api`  
**User Story**: As a seller with many products, I want to update multiple products at once.

**Acceptance Criteria**:
- [ ] Select multiple products
- [ ] Bulk actions: Delete, Price Update, Stock Update
- [ ] CSV import/export
- [ ] Confirmation before bulk changes

---

#### Issue #71: Inventory Alerts
**Labels**: `feature`, `P2-medium`, `M`, `api`  
**User Story**: As a seller, I want alerts when products are low on stock.

**Acceptance Criteria**:
- [ ] Email when stock < lowStockThreshold
- [ ] Daily digest of low stock items
- [ ] Auto-pause product when stock = 0
- [ ] Suggested reorder quantities

---

#### Issue #72: Payment Gateway Integration
**Labels**: `feature`, `P1-high`, `XL`, `api`, `ui`  
**User Story**: As a customer, I want to pay online instead of uploading receipts.

**Acceptance Criteria**:
- [ ] Integrate payment provider (Stripe, Razorpay)
- [ ] Support credit/debit cards
- [ ] BML integration (Maldives)
- [ ] Automatic payment confirmation
- [ ] Refund processing
- [ ] PCI compliance

**Technical Notes**:
- Research Maldivian payment options
- May need local bank partnerships

---

#### Issue #73: Invoice Generation
**Labels**: `feature`, `P2-medium`, `M`, `api`  
**User Story**: As a customer, I want downloadable invoices for my orders.

**Acceptance Criteria**:
- [ ] PDF invoice generation
- [ ] Include itemized list, tax, totals
- [ ] Shop branding
- [ ] Download button on order page
- [ ] Email invoice automatically

**Technical Notes**:
- Use library: `react-pdf` or `pdfmake`

---

#### Issue #74: Mobile App (iOS/Android)
**Labels**: `feature`, `P3-low`, `XL`, `mobile`  
**User Story**: As a user, I want a mobile app for easier access.

**Acceptance Criteria**:
- [ ] React Native or Flutter app
- [ ] Feature parity with web
- [ ] Push notifications
- [ ] App Store / Play Store listing
- [ ] Deep linking

**Technical Notes**:
- Major undertaking
- Consider PWA first

---

#### Issue #75: Progressive Web App (PWA)
**Labels**: `enhancement`, `P2-medium`, `M`, `ui`  
**User Story**: As a mobile user, I want to install Pet Realm as an app.

**Acceptance Criteria**:
- [ ] Service worker for offline support
- [ ] Manifest.json
- [ ] Install prompt
- [ ] Offline fallback pages
- [ ] Push notifications

---

#### Issue #76: Real-Time Features with WebSockets
**Labels**: `enhancement`, `P3-low`, `L`, `api`  
**User Story**: As a user, I want real-time updates without refreshing.

**Acceptance Criteria**:
- [ ] Real-time order status updates
- [ ] Live chat support
- [ ] Notification updates
- [ ] Stock updates

**Technical Notes**:
- Consider Pusher, Ably, or Socket.io

---

#### Issue #77: Advanced Search with Elasticsearch
**Labels**: `enhancement`, `P3-low`, `XL`, `api`  
**User Story**: As a customer, I want faster and more relevant search results.

**Acceptance Criteria**:
- [ ] Elasticsearch integration
- [ ] Fuzzy search
- [ ] Faceted search
- [ ] Search suggestions
- [ ] Typo tolerance

---

#### Issue #78: API for Third-Party Integrations
**Labels**: `feature`, `P3-low`, `XL`, `api`, `docs`  
**User Story**: As a developer, I want to integrate with Pet Realm via API.

**Acceptance Criteria**:
- [ ] Public API documentation
- [ ] API keys and authentication
- [ ] Rate limiting
- [ ] Webhooks for events
- [ ] SDKs (JS, Python)

---

---

## 🎯 Priority Summary

### P0-Critical (0)
None currently

### P1-High (26)
- Search autocomplete (#1)
- Google login (#6)
- Facebook login (#7)
- Address book (#9)
- Select address in checkout (#10)
- Order confirmation email (#12)
- Status update emails (#13)
- Enable 8% tax calculation (#16)
- Tax display on orders (#17)
- Product reviews (#20)
- Session expiry fix (#24)
- Order number collision (#27)
- Mode switching (#28)
- Customer cancel order (#34)
- Admin dashboard (#49)
- User management (#50)
- Shop verification (#51)
- Pet profiles (#54)
- Medical records (#56)
- Vaccination tracking (#57)
- Vet listings (#59)
- Appointment booking (#60)
- Emergency contacts (#62)
- Lost & found (#66)
- Payment gateway (#72)

### P2-Medium (29)
Price range filter, shop ratings, advanced filters, address quick-add, receipt verification email, mode indicator, persistent filters, shop location filter, seller cancel, in-app notifications, wishlist, order again, shop followers, shop announcements, discount codes, content moderation, platform analytics, breed database, health reminders, medical record sharing, service providers, service booking, community forum, adoption platform, multi-shop, shop analytics, bulk operations, inventory alerts, invoices, PWA

### P3-Low (22)
Search history, trending products, Apple sign in, quick add address, welcome emails, remove tax config (#18), review moderation, save searches, order edit, refunds, SMS notifications, share products, shop social links, flash sales, bundles, advanced search, API, mobile app, websockets, elasticsearch

---

## 📊 Size Distribution

- **XS** (< 2hr): 1 issues
- **S** (2-4hr): 9 issues
- **M** (1-2 days): 26 issues
- **L** (3-5 days): 27 issues
- **XL** (1+ week): 15 issues

**Total: 77 issues**

---

## 🎬 Next Steps

1. **Create GitHub Issues**: Copy each issue into GitHub with proper labels
2. **Set Up Project Board**: Create columns and add issues
3. **Prioritize v1.0.0**: Move P1-high items to "Ready" column
4. **Start First Issue**: Assign and begin work on #1 (Search Autocomplete)

---

**Last Updated**: December 10, 2025  
**Version**: 0.1.0
