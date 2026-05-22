# ShopNest — Enterprise E-Commerce Platform

A production-grade, full-stack e-commerce application built with **Django REST Framework** (backend) and **Next.js 14** (frontend).

## 🚀 Live Demo

- **Frontend (Production):** [https://frontend-yokeshkumar.vercel.app](https://frontend-yokeshkumar.vercel.app)
- **Backend API:** [https://ecommerce-backend-prod-cwkx.onrender.com/api/](https://ecommerce-backend-prod-cwkx.onrender.com/api/)
- **API Documentation:** [https://ecommerce-backend-prod-cwkx.onrender.com/api/docs/](https://ecommerce-backend-prod-cwkx.onrender.com/api/docs/)
- **Health Check:** [https://ecommerce-backend-prod-cwkx.onrender.com/api/health/](https://ecommerce-backend-prod-cwkx.onrender.com/api/health/)

## Architecture

```
shopnest/
├── backend/          # Django REST API → deployed to Render
│   ├── apps/
│   │   ├── core/     # Custom User model, JWT auth
│   │   ├── shop/     # Products, Orders, Cart, Customers
│   │   ├── tags/     # Generic tagging system
│   │   └── likes/    # Generic likes system
│   ├── ecommerce/    # Django project config (settings split)
│   ├── requirements/ # Dependency tiers
│   ├── Dockerfile
│   ├── render.yaml
│   └── docker-compose.yml
└── frontend/         # Next.js 14 App Router → deployed to Vercel
    └── src/
        ├── app/      # Pages (App Router)
        ├── components/
        ├── lib/      # API client, auth utilities
        ├── store/    # Zustand state (cart, auth)
        └── types/    # TypeScript definitions
```

## Tech Stack

### Backend
| Layer | Technology |
|-------|-----------|
| Framework | Django 5.1 + DRF 3.15 |
| Auth | JWT (djangorestframework-simplejwt) |
| Database | PostgreSQL (Supabase) |
| Cache | Redis + django-redis |
| Task Queue | Celery + Redis |
| API Docs | drf-spectacular (Swagger + Redoc) |
| Static Files | WhiteNoise + S3 (production) |
| Payments | Stripe |
| Monitoring | Sentry |

### Frontend
| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| State | Zustand |
| Data Fetching | TanStack Query v5 |
| Forms | react-hook-form + zod |
| Payments | Stripe.js |

## Local Development

### Prerequisites
- Python 3.12+
- Node.js 20+
- Docker & Docker Compose (recommended)

### Backend

```bash
cd backend

# Copy and configure env
cp .env.example .env

# Docker (recommended)
docker-compose up

# Or manual
python -m venv venv && source venv/bin/activate
pip install -r requirements/development.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Backend runs at `http://localhost:8000`  
API docs at `http://localhost:8000/api/docs/`  
Admin at `http://localhost:8000/admin/`

### Frontend

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

Frontend runs at `http://localhost:3000`

## API Endpoints

| Resource | Endpoint |
|----------|---------|
| Auth (JWT) | `POST /api/auth/token/` |
| Token Refresh | `POST /api/auth/token/refresh/` |
| Products | `GET/POST /api/products/` |
| Product Detail | `GET/PUT/DELETE /api/products/{id}/` |
| Product Reviews | `GET/POST /api/products/{id}/reviews/` |
| Collections | `GET/POST /api/collections/` |
| Cart | `POST /api/carts/` + `GET /api/carts/{id}/` |
| Cart Items | `POST /api/carts/{id}/items/` |
| Orders | `GET/POST /api/orders/` |
| Customer (me) | `GET/PUT /api/customers/me/` |
| Tags | `GET /api/tags/` |
| Likes | `GET/POST /api/likes/` |

## Deployment

### Backend → Render

1. Create a new account on [Render](https://render.com)
2. Connect your GitHub repo
3. Render auto-detects `render.yaml` — click **New Blueprint**
4. Set environment variables (see `.env.example`)
5. Deploy

### Frontend → Vercel

1. Install [Vercel CLI](https://vercel.com/cli): `npm i -g vercel`
2. In the `frontend/` directory: `vercel`
3. Set `NEXT_PUBLIC_API_URL` env var to your Render backend URL
4. Deploy to production: `vercel --prod`

Or connect your GitHub repo in the [Vercel dashboard](https://vercel.com/dashboard) and set the root directory to `frontend/`.

## Running Tests

```bash
cd backend
pytest                    # run all tests
pytest --cov=apps         # with coverage
pytest apps/shop/tests/   # specific app
```

## Environment Variables

See `backend/.env.example` and `frontend/.env.local.example` for all required variables.

## Features

- JWT authentication with token rotation
- Product catalog with filtering, search, pagination
- Product images & reviews
- Shopping cart (UUID-based, persistent)
- Order management
- Customer profiles & addresses
- Generic tags & likes system
- Admin dashboard
- OpenAPI documentation (Swagger + Redoc)
- Redis caching
- Celery async tasks
- S3 media storage (production)
- Sentry error monitoring
- Dark/light theme
- Fully responsive UI
- TypeScript throughout
