# 🎨 InkSesh

> **AI-Powered Tattoo Portfolio Platform** — Turn your chaotic Instagram feed into a structured, searchable portfolio with automatic AI tagging.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat-square&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-7.1-2D3748?style=flat-square&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?style=flat-square&logo=postgresql)

---

## ✨ Features

### 🤖 AI-Powered Analysis

- **Automatic Metadata Generation** — Upload a tattoo image and let OpenAI analyze it to extract style, theme, body part, size, and more
- **Smart Tagging** — AI identifies tattoo styles (Minimalist, Fine-Line, Traditional, etc.) and themes (Geometric, Floral, Spiritual, etc.)

### 📸 Instagram Integration

- **One-Click Import** — Connect your Instagram and import your tattoo portfolio directly
- **Media Sync** — Pull images from your Instagram feed with preserved metadata

### 🎭 Artist Profiles

- **Public Portfolio Pages** — Each artist gets a shareable profile at `/artist/[username]`
- **Searchable Gallery** — Filter designs by gender, size, body part, styles, and themes
- **Responsive Design** — Beautiful on desktop and mobile with touch-friendly interactions

### 🔍 Discover Page

- **Browse All Designs** — Explore tattoos from all artists on the platform
- **Category Filtering** — Filter by style categories like Minimal, Tribal, Traditional, and more
- **Real-time Search** — Debounced search across titles and captions

### 🛠️ Profile Management

- **Edit Designs** — Update title, caption, gender, size, body part, styles, and themes
- **Delete Designs** — Remove designs from your portfolio
- **Profile Customization** — Set profile picture and username

---

## 🛠️ Tech Stack

| Technology          | Purpose                                          |
| ------------------- | ------------------------------------------------ |
| **Next.js 16**      | React framework with App Router & Server Actions |
| **TypeScript**      | Type-safe development                            |
| **Tailwind CSS 4**  | Utility-first styling                            |
| **Prisma 7**        | Type-safe ORM for PostgreSQL                     |
| **PostgreSQL**      | Relational database                              |
| **OpenAI API**      | AI-powered image analysis                        |
| **UploadThing**     | File uploads and image hosting                   |
| **Bcrypt.js**       | Password hashing                                 |
| **JWT**             | Session authentication                           |
| **Zod**             | Schema validation                                |
| **React Hook Form** | Form handling                                    |
| **Lucide React**    | Icon library                                     |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ or **Bun**
- **PostgreSQL** database (local or hosted)
- **OpenAI API Key**
- **UploadThing Account** (for file uploads)

### 1. Clone the Repository

```bash
git clone https://github.com/Wanderboy007/inksesh-app.git
cd inksesh-app
```

### 2. Install Dependencies

```bash
# Using bun (recommended)
bun install

# Or using npm
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/inksesh"

# OpenAI
OPENAI_API_KEY="sk-..."

# UploadThing
UPLOADTHING_TOKEN="..."

# JWT Secret
JWT_SECRET="your-super-secret-key"

# App URL (for production)
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

### 4. Initialize the Database

```bash
# Generate Prisma client
bun prisma generate

# Run migrations
bun prisma migrate dev
```

### 5. Run the Development Server

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## 📁 Project Structure

```
inksesh-app/
├── app/
│   ├── api/
│   │   ├── ai/              # AI metadata generation endpoint
│   │   └── instagram/       # Instagram media fetching
│   ├── artist/
│   │   └── [username]/      # Public artist profile pages
│   ├── auth/                # Authentication (sign in/sign up)
│   ├── discover/            # Public design discovery page
│   ├── profile/             # User profile & portfolio management
│   │   └── profile-generator/  # AI-powered design upload
│   ├── layout.tsx
│   └── page.tsx             # Landing page
├── components/
│   ├── profile-view.tsx     # Profile grid & edit modal
│   ├── profile-navbar.tsx   # Navigation component
│   └── ...
├── lib/
│   ├── ai/
│   │   └── openai.ts        # OpenAI client
│   └── db/
│       └── prisma.ts        # Prisma client
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── migrations/          # Database migrations
└── public/                  # Static assets
```

---

## 📊 Database Schema

### User Model

- `id`, `email`, `username`, `password`, `profileUrl`
- One-to-many relationship with `Design`

### Design Model

- `title`, `caption`, `imageUrl`
- `gender` (MALE, FEMALE, UNISEX)
- `size` (SMALL, MEDIUM, LARGE, EXTRA_LARGE, FULL_COVERAGE)
- `bodyPart` — Location of the tattoo
- `styles[]` — Array of style tags
- `themes[]` — Array of theme tags
- `specializations[]` — Special categories

---

## 🔑 API Routes

| Route                        | Method | Description                           |
| ---------------------------- | ------ | ------------------------------------- |
| `/api/ai/generatemetadata`   | POST   | Generate AI metadata for tattoo image |
| `/api/instagram/fetch-media` | POST   | Fetch media from Instagram            |

---

## 🎯 Key Features Explained

### AI Metadata Generation

When uploading a tattoo image, the app sends it to OpenAI's vision model which analyzes:

- **Style** — Minimalist, Traditional, Neo-Traditional, Realism, etc.
- **Theme** — Floral, Geometric, Spiritual, Portrait, etc.
- **Body Part** — Arm, Back, Chest, Leg, etc.
- **Size** — Based on coverage area
- **Gender Suitability** — Male, Female, or Unisex

### Responsive Design

- **Desktop** — Hover effects reveal design information
- **Mobile** — Information overlay always visible with gradient background
- **Fluid Typography** — Uses CSS `clamp()` for responsive text sizing

---

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project on [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to set:

- `DATABASE_URL` — Your production PostgreSQL connection string
- `OPENAI_API_KEY` — Your OpenAI API key
- `UPLOADTHING_TOKEN` — Your UploadThing token
- `JWT_SECRET` — A strong secret key
- `NEXT_PUBLIC_APP_URL` — Your production domain (e.g., `https://inksesh.vercel.app`)

---

## 📝 Scripts

```bash
bun run dev        # Start development server
bun run build      # Build for production
bun run start      # Start production server
bun prisma studio  # Open Prisma Studio (database GUI)
bun prisma migrate dev    # Run database migrations
bun prisma generate       # Generate Prisma client
```

---

## 👨‍💻 Author

**Tejas Chavhan** — [GitHub](https://github.com/Wanderboy007)

---

<p align="center">
  <strong>InkSesh</strong> — Where Art Meets AI 🎨✨
</p>
