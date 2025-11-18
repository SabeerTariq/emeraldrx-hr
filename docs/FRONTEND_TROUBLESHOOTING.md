# Frontend UI Not Showing - Troubleshooting Guide

## ✅ Quick Fixes

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Create Environment File
```bash
cd frontend
# Copy .env.example to .env.local
cp .env.example .env.local
```

Make sure `.env.local` contains:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Start Development Server
```bash
cd frontend
npm run dev
```

The frontend should be available at: **http://localhost:3000**

## 🔍 Common Issues

### Issue 1: Blank Page / No UI Showing

**Possible Causes:**
- Dependencies not installed
- Environment variables missing
- Backend not running
- Build errors

**Solutions:**
1. Check if `node_modules` exists:
   ```bash
   cd frontend
   ls node_modules  # Should show many folders
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Check for build errors:
   ```bash
   npm run dev
   ```
   Look for errors in the terminal

4. Check browser console (F12) for errors

### Issue 2: Routes Not Working

**Check:**
- All page files exist in `app/(pages)/` folder
- Navigation component has correct routes
- No old folder structure remains

**Verify routes:**
- `/dashboard` → `app/dashboard.tsx`
- `/employee-management` → `app/(pages)/employee-management.tsx`
- `/license-tracking` → `app/(pages)/license-tracking.tsx`
- etc.

### Issue 3: Components Not Loading

**Check:**
- UI components exist in `components/ui/`
- Providers are set up in `components/providers.tsx`
- Layout includes Navigation component

### Issue 4: API Errors

**Check:**
- Backend server is running on port 5000
- `.env.local` has correct API URL
- CORS is configured in backend

**Test backend:**
```bash
curl http://localhost:5000/health
```

## 📋 Verification Checklist

- [ ] `node_modules` folder exists
- [ ] `.env.local` file exists with `NEXT_PUBLIC_API_URL`
- [ ] All page files exist in correct locations
- [ ] Backend server is running
- [ ] No TypeScript errors
- [ ] Browser console shows no errors
- [ ] Network tab shows API calls (if backend running)

## 🚀 Quick Start Commands

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Then open: **http://localhost:3000**

## 🔧 If Still Not Working

1. **Clear Next.js cache:**
   ```bash
   cd frontend
   rm -rf .next
   npm run dev
   ```

2. **Check TypeScript errors:**
   ```bash
   cd frontend
   npm run type-check
   ```

3. **Check for missing files:**
   - `app/layout.tsx`
   - `app/page.tsx`
   - `components/providers.tsx`
   - `components/layout/Navigation.tsx`
   - `lib/api.ts`
   - `lib/utils.ts`

4. **Verify file structure:**
   ```
   frontend/
   ├── app/
   │   ├── dashboard.tsx
   │   ├── (pages)/
   │   │   ├── employee-management.tsx
   │   │   ├── license-tracking.tsx
   │   │   └── ...
   │   ├── layout.tsx
   │   └── page.tsx
   ├── components/
   │   ├── ui/
   │   ├── layout/
   │   └── providers.tsx
   └── lib/
       ├── api.ts
       └── utils.ts
   ```

