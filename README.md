# Ắc quy Trung Nguyên - Landing Page & CMS

Landing page và hệ thống quản lý nội dung cho Ắc quy Trung Nguyên.

## 🚀 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Database:** Neon PostgreSQL (Serverless)
- **ORM:** Prisma
- **Storage:** Supabase Storage
- **UI:** Tailwind CSS + shadcn/ui
- **Form:** React Hook Form + Zod
- **Deploy:** Vercel

## 📦 Features

### Public Pages
- ✅ Trang chủ (Landing page)
- ✅ Danh sách bài viết tin tức
- ✅ Chi tiết bài viết
- ✅ SEO optimized

### Admin Panel
- ✅ Dashboard
- ✅ CRUD bài viết (Post)
  - Tạo, sửa, xóa bài viết
  - Upload hình ảnh lên Supabase
  - Rich text content
  - Draft/Published status
  - Slug tự động từ tiêu đề

## 🛠️ Setup Instructions

### 1. Clone & Install

```bash
cd hn-battery-api
pnpm install
```

### 2. Setup Database (Neon PostgreSQL)

1. Đăng ký tài khoản tại [Neon.tech](https://neon.tech)
2. Tạo project mới
3. Copy `DATABASE_URL` từ Neon Dashboard

### 3. Setup Storage (Supabase)

1. Đăng ký tài khoản tại [Supabase.com](https://supabase.com)
2. Tạo project mới
3. Vào **Storage** → Tạo bucket mới tên `posts` (Public bucket)
4. Vào **Settings** → **API** → Copy:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4. Environment Variables

Tạo file `.env.local` từ `env.example`:

```bash
cp env.example .env.local
```

Điền các biến môi trường:

```env
DATABASE_URL="postgresql://user:password@ep-xxx.neon.tech/dbname?sslmode=require"
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```

### 5. Database Migration

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push
```

### 6. Run Development Server

```bash
pnpm dev
```

Mở [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/
│   ├── (public)/          # Public routes
│   │   ├── page.tsx       # Homepage
│   │   └── posts/         # Blog pages
│   ├── admin/             # Admin panel
│   │   ├── layout.tsx     # Admin layout
│   │   ├── page.tsx       # Dashboard
│   │   └── posts/         # Post management
│   └── api/               # API routes
│       ├── posts/         # Post CRUD
│       └── upload/        # Image upload
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── ImageUpload.tsx    # Image upload component
│   └── PostForm.tsx       # Post form component
├── lib/
│   ├── db.ts              # Prisma client
│   ├── supabase.ts        # Supabase client & helpers
│   └── utils.ts           # Utility functions
└── types/
    └── index.ts           # TypeScript types & schemas
```

## 🎨 Admin Panel Routes

- `/admin` - Dashboard
- `/admin/posts` - Danh sách bài viết
- `/admin/posts/new` - Tạo bài viết mới
- `/admin/posts/[id]/edit` - Chỉnh sửa bài viết

## 🌐 Public Routes

- `/` - Trang chủ
- `/posts` - Danh sách bài viết
- `/posts/[slug]` - Chi tiết bài viết

## 📝 API Endpoints

### Posts
- `GET /api/posts` - Lấy danh sách posts (có pagination)
- `POST /api/posts` - Tạo post mới
- `GET /api/posts/[id]` - Lấy chi tiết post
- `PUT /api/posts/[id]` - Cập nhật post
- `DELETE /api/posts/[id]` - Xóa post

### Upload
- `POST /api/upload` - Upload image (multipart/form-data)

## 🚢 Deploy to Vercel

1. Push code lên GitHub
2. Import project vào [Vercel](https://vercel.com)
3. Thêm Environment Variables:
   - `DATABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

## 💰 Chi Phí

- **Neon PostgreSQL:** $0 (Free tier: 0.5GB)
- **Supabase Storage:** $0 (Free tier: 1GB)
- **Vercel Hosting:** $0 (Free tier)
- **TỔNG:** $0/tháng

## 📚 Database Schema

```prisma
model Post {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  excerpt     String?
  content     String   @db.Text
  thumbnail   String?
  images      String[]
  status      Status   @default(DRAFT)
  publishedAt DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum Status {
  DRAFT
  PUBLISHED
  ARCHIVED
}
```

## 🔧 Useful Commands

```bash
# Development
pnpm dev

# Build
pnpm build

# Start production
pnpm start

# Prisma Studio (Database GUI)
npx prisma studio

# Generate Prisma Client
npx prisma generate

# Push schema changes
npx prisma db push

# Create migration
npx prisma migrate dev
```

## 📖 Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Supabase Docs](https://supabase.com/docs)
- [shadcn/ui Docs](https://ui.shadcn.com)

## 🐛 Troubleshooting

### Prisma Error
```bash
npx prisma generate
```

### Port already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill
```

## 📞 Support

Liên hệ: [your-email@example.com]

---

Made with ❤️ by Ắc quy Trung Nguyên
