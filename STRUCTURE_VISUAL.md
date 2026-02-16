# 🎯 Campus Deliver - Visual Structure Guide

## Before vs After Reorganization

### ❌ OLD CONFUSING STRUCTURE
```
src/app/
├── (main)/                    ← What are these parentheses?
│   ├── layout.tsx             ← Why two layouts?
│   ├── page.tsx
│   ├── orders/
│   └── partners/
├── auth/                      ← Auth in two places?
│   └── callback/
├── login/
└── layout.tsx                 ← Root layout
```

### ✅ NEW CLEAN STRUCTURE
```
src/app/
├── layout.tsx                 ← One root layout
├── page.tsx                   ← Home (Items)
├── login/                     ← Login page
├── orders/                    ← Orders section
├── partners/                  ← Partners section
└── api/                       ← API routes (clear separation)
    └── auth/
        └── callback/
```

## 📊 Page Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      User Journey                            │
└─────────────────────────────────────────────────────────────┘

    START
      │
      ▼
┌──────────────┐
│ Visit Site   │
│ (any page)   │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│ middleware.ts    │ ← Checks authentication
│ Checks Auth      │
└──────┬───────────┘
       │
       ├─── Not Logged In ──→ /login
       │                         │
       │                         ▼
       │                    ┌─────────────────┐
       │                    │ Login Page      │
       │                    │ - Google OAuth  │
       │                    │ - Demo Login    │
       │                    └────────┬────────┘
       │                             │
       │                             ▼
       │                    /api/auth/callback
       │                             │
       └─── Logged In ──────────────┘
                │
                ▼
       ┌────────────────┐
       │ Protected Pages│
       └────────┬───────┘
                │
       ┌────────┴────────┬──────────────┐
       │                 │              │
       ▼                 ▼              ▼
┌──────────┐      ┌──────────┐   ┌──────────┐
│   Home   │      │  Orders  │   │ Partners │
│ (Items)  │      │  List    │   │   List   │
│    /     │      │ /orders  │   │/partners │
└──────────┘      └────┬─────┘   └──────────┘
                       │
                       ▼
                ┌──────────────┐
                │ Order Detail │
                │ /orders/[id] │
                └──────────────┘
```

## 🗂️ File Organization by Feature

### 🏠 Home / Items Feature
```
src/app/
├── page.tsx                          ← Server: Fetch items & locations
└── items-client.tsx                  ← Client: Search, filter, modal

src/components/items/
├── item-card.tsx                     ← Display single item
└── request-modal.tsx                 ← Create order dialog
```

### 📦 Orders Feature
```
src/app/orders/
├── page.tsx                          ← Server: Fetch user orders
├── [id]/
│   ├── page.tsx                      ← Server: Fetch single order
│   └── order-detail-client.tsx       ← Client: Real-time updates

src/components/orders/
├── order-card.tsx                    ← Order list item
├── order-tracker.tsx                 ← Status progress UI
└── status-simulator.tsx              ← Demo tool
```

### 👥 Partners Feature
```
src/app/partners/
├── page.tsx                          ← Server: Fetch partners
└── partners-client.tsx               ← Client: Real-time availability
```

### 🔐 Authentication
```
src/app/
├── login/
│   └── page.tsx                      ← Login UI
└── api/auth/callback/
    └── route.ts                      ← OAuth callback

src/lib/actions/
└── auth.ts                           ← Server actions
    ├── signIn()
    ├── signInWithGoogle()
    ├── signOut()
    └── getCurrentUser()
```

## 🎨 Component Hierarchy

```
Root Layout (src/app/layout.tsx)
│
├─ Login Page (public)
│  └─ Card with login buttons
│
└─ Protected Pages
   │
   └─ ProtectedLayout (src/components/layout/protected-layout.tsx)
      │
      ├─ Header
      │  ├─ Logo
      │  ├─ User Avatar
      │  └─ Logout Button
      │
      ├─ Main Content
      │  │
      │  ├─ Home Page (/)
      │  │  └─ ItemsClient
      │  │     ├─ Search Input
      │  │     ├─ Category Tabs
      │  │     ├─ Item Cards Grid
      │  │     └─ Request Modal
      │  │
      │  ├─ Orders Page (/orders)
      │  │  ├─ Active Tab
      │  │  │  └─ Order Cards
      │  │  └─ Past Tab
      │  │     └─ Order Cards
      │  │
      │  ├─ Order Detail (/orders/[id])
      │  │  ├─ Order Tracker
      │  │  └─ Status Simulator
      │  │
      │  └─ Partners Page (/partners)
      │     └─ Partner Cards
      │
      └─ Bottom Navigation
         ├─ Items Tab
         ├─ Orders Tab
         └─ Partners Tab
```

## 🔄 Data Flow

### Creating an Order
```
1. User clicks item
   ↓
2. ItemCard → onClick
   ↓
3. RequestModal opens
   ↓
4. User selects drop location
   ↓
5. Click "Request Delivery"
   ↓
6. Call createOrder() server action
   ↓
7. Server: assignPartner() algorithm
   ↓
8. Server: Insert into database
   ↓
9. Client: Show success/error
   ↓
10. Navigate to /orders/[id]
```

### Real-time Order Updates
```
1. Order status changes in database
   ↓
2. Supabase Realtime broadcasts change
   ↓
3. useOrderSubscription hook receives update
   ↓
4. React state updates
   ↓
5. UI re-renders with new status
```

## 📁 Where to Find Things

| What You Need | Where to Look |
|---------------|---------------|
| Add a new page | `src/app/your-page/page.tsx` |
| Modify navigation | `src/components/layout/bottom-nav.tsx` |
| Change header | `src/components/layout/header.tsx` |
| Add server action | `src/lib/actions/your-action.ts` |
| Update database | `supabase/your-migration.sql` |
| Add UI component | `src/components/ui/` or `src/components/feature/` |
| Modify styles | `src/app/globals.css` |
| Configure auth | `src/lib/actions/auth.ts` |
| Add custom hook | `src/hooks/use-your-hook.ts` |
| Update types | `src/lib/supabase/types.ts` |

## 🎯 Key Principles

### 1. **Separation of Concerns**
- **Pages** (`src/app/`) - Routing and data fetching
- **Components** (`src/components/`) - UI and presentation
- **Actions** (`src/lib/actions/`) - Business logic
- **Hooks** (`src/hooks/`) - Reusable stateful logic

### 2. **Server vs Client**
- **Server Components** (default) - Fast, SEO-friendly, secure
- **Client Components** (`"use client"`) - Interactive, stateful

### 3. **Colocation**
- Related files stay together
- `partners-client.tsx` lives in `src/app/partners/`
- Feature components in `src/components/feature/`

### 4. **Clear Naming**
- `*-client.tsx` = Client component
- `page.tsx` = Route page
- `layout.tsx` = Layout wrapper
- `route.ts` = API endpoint

## 🚀 Quick Reference

### Run the App
```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # Check code quality
```

### Important URLs
```
http://localhost:3000/              # Home (Items)
http://localhost:3000/login         # Login page
http://localhost:3000/orders        # Orders list
http://localhost:3000/orders/[id]   # Order detail
http://localhost:3000/partners      # Partners list
```

### Demo Login
```
Email: reviewer@campusdelivery.com
Password: ReviewerDemo123!
```

---

**This structure is designed to be:**
- ✅ Easy to understand
- ✅ Easy to navigate
- ✅ Easy to extend
- ✅ Easy to maintain

No more confusion! 🎉
