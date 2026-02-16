# ⚡ Quick Start Guide

## 🎯 New to the Project?

### 1. Understand the Structure (5 min)
Read **[STRUCTURE_VISUAL.md](./STRUCTURE_VISUAL.md)** - has diagrams and visual flows

### 2. Explore the Code (10 min)
```
src/app/              ← All pages here (no nested folders!)
├── page.tsx          ← Home (Items list)
├── orders/           ← Orders section
├── partners/         ← Partners section
└── api/auth/         ← OAuth callback

src/components/       ← UI components
src/lib/actions/      ← Server-side logic
src/hooks/            ← Custom React hooks
```

### 3. Run Locally (2 min)
```bash
npm install
npm run dev
```

Visit: http://localhost:3000

### 4. Login (1 min)
Click "1-Click Reviewer Login"
- Email: `reviewer@campusdelivery.com`
- Password: `ReviewerDemo123!`

## 📚 Documentation

| Document | What's Inside | When to Read |
|----------|---------------|--------------|
| **[STRUCTURE_VISUAL.md](./STRUCTURE_VISUAL.md)** | Diagrams, flows, visual guides | Start here! |
| **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** | Detailed folder structure | When building features |
| **[README.md](./README.md)** | Overview, features, setup | For comprehensive info |
| **[MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md)** | What changed in reorganization | If you saw the old code |

## 🔑 Key Concepts

### Pages = Routes
```
src/app/page.tsx           → /
src/app/orders/page.tsx    → /orders
src/app/orders/[id]/page.tsx → /orders/123
```

### Protected Pages
All main pages use `ProtectedLayout`:
```tsx
import { ProtectedLayout } from "@/components/layout/protected-layout";

export default async function Page() {
  return (
    <ProtectedLayout>
      {/* Your content */}
    </ProtectedLayout>
  );
}
```

### Server Actions
Functions that run on the server:
```tsx
// src/lib/actions/orders.ts
"use server";

export async function createOrder(itemId, dropLocationId) {
  // Runs on server, called from client
}
```

## 🛠️ Common Tasks

### Add a New Page
1. Create `src/app/your-page/page.tsx`
2. Wrap in `<ProtectedLayout>` if auth needed
3. Done!

### Fetch Data
Use server actions from `src/lib/actions/`:
```tsx
import { getItems } from "@/lib/actions/data";

const items = await getItems();
```

### Add Real-time Updates
Use custom hooks from `src/hooks/`:
```tsx
import { useOrderSubscription } from "@/hooks/use-order-subscription";

const order = useOrderSubscription(orderId, initialOrder);
```

## 🎨 Styling

- Use Tailwind classes: `className="flex items-center gap-2"`
- Use shadcn/ui components: `<Button>`, `<Card>`, etc.
- Theme colors in `src/app/globals.css`

## 🐛 Troubleshooting

### "Not authenticated" error
- Check if page uses `ProtectedLayout`
- Check `middleware.ts` for route protection

### OAuth not working
- Verify redirect URI: `/api/auth/callback`
- Check `.env.local` has correct Supabase URL

### Build errors
```bash
npm run lint        # Check for errors
npm run build       # Test production build
```

## 📞 Need Help?

1. Check [STRUCTURE_VISUAL.md](./STRUCTURE_VISUAL.md) for diagrams
2. Check [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for details
3. Review inline code comments
4. Check Supabase logs for database issues

## 🚀 Deploy

### Vercel (Recommended)
1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy!

### Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## ✅ Checklist for New Developers

- [ ] Read [STRUCTURE_VISUAL.md](./STRUCTURE_VISUAL.md)
- [ ] Run `npm install`
- [ ] Copy `.env.local.example` to `.env.local`
- [ ] Add Supabase credentials
- [ ] Run `npm run dev`
- [ ] Login with demo account
- [ ] Create a test order
- [ ] Explore the code structure
- [ ] Read [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)

## 🎓 Learning Path

1. **Day 1**: Understand structure (read docs)
2. **Day 2**: Run locally, explore UI
3. **Day 3**: Read server actions code
4. **Day 4**: Understand real-time hooks
5. **Day 5**: Make your first change!

---

**Welcome to Campus Deliver! 🎉**

The code is clean, well-documented, and ready for you to build amazing features.
