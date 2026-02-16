# Campus Deliver - Project Structure Guide

## 📁 Clean & Intuitive Structure

This project follows a simplified, easy-to-understand structure without confusing route groups or nested folders.

```
biiite/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── layout.tsx                # Root layout (fonts, metadata)
│   │   ├── page.tsx                  # Home page (Items list) - PROTECTED
│   │   ├── globals.css               # Global styles & Tailwind
│   │   │
│   │   ├── login/                    # Authentication
│   │   │   └── page.tsx              # Login page (Google OAuth + Demo)
│   │   │
│   │   ├── orders/                   # Order management
│   │   │   ├── page.tsx              # Orders list - PROTECTED
│   │   │   └── [id]/                 # Dynamic order detail
│   │   │       ├── page.tsx          # Order detail page - PROTECTED
│   │   │       └── order-detail-client.tsx
│   │   │
│   │   ├── partners/                 # Delivery partners
│   │   │   ├── page.tsx              # Partners list - PROTECTED
│   │   │   └── partners-client.tsx
│   │   │
│   │   ├── api/                      # API routes
│   │   │   └── auth/
│   │   │       └── callback/
│   │   │           └── route.ts      # OAuth callback handler
│   │   │
│   │   └── items-client.tsx          # Client component for items
│   │
│   ├── components/                   # React components
│   │   ├── layout/                   # Layout components
│   │   │   ├── header.tsx            # Top navigation bar
│   │   │   ├── bottom-nav.tsx        # Bottom tab navigation
│   │   │   └── protected-layout.tsx  # Wrapper for protected pages
│   │   │
│   │   ├── items/                    # Item-related components
│   │   │   ├── item-card.tsx         # Item display card
│   │   │   └── request-modal.tsx     # Order creation modal
│   │   │
│   │   ├── orders/                   # Order-related components
│   │   │   ├── order-card.tsx        # Order list item
│   │   │   ├── order-tracker.tsx     # Status progress tracker
│   │   │   └── status-simulator.tsx  # Demo status updater
│   │   │
│   │   └── ui/                       # shadcn/ui components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── input.tsx
│   │       ├── select.tsx
│   │       └── ... (other UI components)
│   │
│   ├── lib/                          # Utilities & business logic
│   │   ├── utils.ts                  # Helper functions (cn, etc.)
│   │   │
│   │   ├── supabase/                 # Supabase configuration
│   │   │   ├── client.ts             # Browser client
│   │   │   ├── server.ts             # Server client
│   │   │   └── types.ts              # TypeScript types
│   │   │
│   │   └── actions/                  # Server Actions
│   │       ├── auth.ts               # Authentication (login, logout, OAuth)
│   │       ├── data.ts               # Data fetching (items, locations, partners)
│   │       ├── orders.ts             # Order operations (create, update, list)
│   │       └── assign-partner.ts     # Partner assignment algorithm
│   │
│   ├── hooks/                        # Custom React hooks
│   │   ├── use-order-subscription.ts # Real-time order updates
│   │   └── use-partner-availability.ts # Real-time partner status
│   │
│   └── middleware.ts                 # Route protection & auth refresh
│
├── supabase/                         # Database files
│   ├── schema.sql                    # Database schema
│   ├── seed.sql                      # Sample data
│   ├── create-reviewer-account.sql   # Demo account setup
│   ├── add-max-quantity.sql          # Schema migration
│   └── clear-data.sql                # Data cleanup utility
│
├── public/                           # Static assets
│   └── *.svg                         # Icons and images
│
├── .env.local                        # Environment variables (not in git)
├── .env.local.example                # Environment template
├── package.json                      # Dependencies
├── tsconfig.json                     # TypeScript config
├── next.config.ts                    # Next.js config
├── components.json                   # shadcn/ui config
└── README.md                         # Project documentation
```

## 🎯 Key Concepts

### 1. **App Router Pages** (`src/app/`)
- Each folder = a route
- `page.tsx` = the page component
- `layout.tsx` = shared layout wrapper
- `[id]` = dynamic route parameter
- `api/` = API endpoints (not pages)

### 2. **Protected Pages**
All main pages (home, orders, partners) use `ProtectedLayout`:
- Checks if user is logged in
- Redirects to `/login` if not authenticated
- Adds Header and BottomNav automatically

### 3. **Server vs Client Components**
- **Server Components** (default): `page.tsx` files - fetch data on server
- **Client Components** (`"use client"`): Interactive components with state/hooks

### 4. **Server Actions** (`src/lib/actions/`)
Functions that run on the server, called from client components:
- `auth.ts` - Login, logout, OAuth
- `data.ts` - Fetch items, locations, partners
- `orders.ts` - Create and manage orders
- `assign-partner.ts` - Smart partner assignment

### 5. **Real-time Updates** (`src/hooks/`)
Custom hooks that subscribe to Supabase Realtime:
- Order status changes
- Partner availability changes

## 🔐 Authentication Flow

```
1. User visits protected page (/, /orders, /partners)
   ↓
2. middleware.ts checks authentication
   ↓
3. If not logged in → redirect to /login
   ↓
4. User clicks "1-Click Reviewer Login" or "Google OAuth"
   ↓
5. Google OAuth redirects to /api/auth/callback
   ↓
6. Callback exchanges code for session
   ↓
7. Redirect to home page (/)
```

## 📦 Component Organization

### Layout Components
- `header.tsx` - Logo, user avatar, logout button
- `bottom-nav.tsx` - Tab navigation (Items, Orders, Partners)
- `protected-layout.tsx` - Wrapper that adds header + nav + auth check

### Feature Components
- `items/` - Item browsing and order creation
- `orders/` - Order tracking and status updates
- `ui/` - Reusable UI primitives from shadcn/ui

## 🗄️ Database Structure

### Tables
1. **locations** - Campus locations (pickup/drop points)
2. **items** - Deliverable items with weight and fragile flags
3. **delivery_partners** - Couriers with capacity and capabilities
4. **orders** - Delivery requests with status tracking

### Relationships
```
orders.item_id → items.id
orders.partner_id → delivery_partners.id
orders.drop_location_id → locations.id
orders.user_id → auth.users.id
```

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Copy `.env.local.example` to `.env.local` and fill in:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Set Up Database
Run in Supabase SQL Editor:
1. `supabase/schema.sql` - Create tables
2. `supabase/seed.sql` - Add sample data
3. Create reviewer account via Supabase Dashboard

### 4. Run Development Server
```bash
npm run dev
```

Visit http://localhost:3000

## 📝 Common Tasks

### Add a New Page
1. Create `src/app/your-page/page.tsx`
2. Wrap content in `<ProtectedLayout>` if auth required
3. Add link in `bottom-nav.tsx` if needed

### Add a New Server Action
1. Create function in `src/lib/actions/your-action.ts`
2. Add `"use server"` at top
3. Import and call from client components

### Add a New Component
1. Create in appropriate folder (`components/feature/`)
2. Add `"use client"` if it uses state/hooks
3. Export and import where needed

### Update Database Schema
1. Write SQL in `supabase/` folder
2. Run in Supabase SQL Editor
3. Update TypeScript types in `src/lib/supabase/types.ts`

## 🎨 Styling

- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Pre-built accessible components
- **CSS Variables** - Theme colors in `globals.css`
- **Dark Mode** - Automatic via Tailwind dark mode

## 🔧 Configuration Files

- `next.config.ts` - Next.js settings
- `tsconfig.json` - TypeScript compiler options
- `components.json` - shadcn/ui configuration
- `eslint.config.mjs` - Code linting rules
- `postcss.config.mjs` - CSS processing

## 📚 Learn More

- [Next.js App Router](https://nextjs.org/docs/app)
- [Supabase Docs](https://supabase.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)

---

**Questions?** Check the main README.md or review the inline code comments.
