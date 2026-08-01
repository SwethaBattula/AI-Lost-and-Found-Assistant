# AI Lost and Found Assistant - Backend

FastAPI backend service for the **AI Lost & Found Assistant** platform, incorporating semantic text matching, image feature similarity search, and automated email notifications.

## Stack & Technologies

- **Framework:** FastAPI
- **Database:** SQLite & SQLAlchemy ORM
- **Authentication:** JWT (JSON Web Tokens) with Argon2 password hashing
- **AI / ML Services:**
  - **Sentence Transformers:** `all-MiniLM-L6-v2` for text semantic matching
  - **OpenCLIP:** `ViT-B-32` for image visual feature comparison
  - **FAISS:** Vector similarity search engine
  - **OpenCV & Pillow:** Image processing & validation
- **Email Service:** SMTP Notification Dispatcher

---

## Directory Structure

```
backend/
├── app/
│   ├── api/             # API Routers (auth, lost_items, found_items, matches, notifications)
│   ├── auth/            # JWT, Argon2 hashing, security dependencies
│   ├── core/            # Configuration, logging, exception handlers
│   ├── database/        # Engine, Session, DB Initializer
│   ├── models/          # SQLAlchemy ORM models (User, LostItem, FoundItem, Match, Notification)
│   ├── schemas/         # Pydantic v2 schemas
│   ├── services/        # Business logic & AI package
│   │   ├── ai/          # AI text, image, vector store & matching service
│   │   ├── email_service.py
│   │   └── match_service.py
│   ├── utils/           # Image upload & file storage helpers
│   └── main.py          # FastAPI application entrypoint
├── uploads/
│   ├── lost/            # Uploaded lost item images
│   └── found/           # Uploaded found item images
├── .env.example         # Environment template
├── README.md
└── requirements.txt     # Pinned dependency requirements
```

---

## Environment Configuration

Copy `.env.example` to `.env` and set your credentials:

```bash
cp .env.example .env
```

---

## Running Locally

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Start Uvicorn Server
```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### 3. API Documentation
Swagger UI documentation is available at:
- **Interactive Swagger Docs:** `http://127.0.0.1:8000/docs`
- **ReDoc:** `http://127.0.0.1:8000/redoc`

---

## API Endpoints Overview

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/auth/register` | Register a new user | No |
| `POST` | `/auth/login` | Login user & receive JWT token | No |
| `GET` | `/auth/me` | Retrieve profile of authenticated user | Yes |
| `POST` | `/lost-items/` | Create a lost item record with image upload | Yes |
| `GET` | `/lost-items/` | List lost items | Yes |
| `GET` | `/lost-items/{id}` | Get lost item details | No |
| `PUT` | `/lost-items/{id}` | Update lost item | Yes (Owner) |
| `DELETE` | `/lost-items/{id}` | Delete lost item | Yes (Owner) |
| `POST` | `/found-items/` | Create a found item record with image upload | Yes |
| `GET` | `/found-items/` | List found items | Yes |
| `GET` | `/found-items/{id}` | Get found item details | No |
| `PUT` | `/found-items/{id}` | Update found item | Yes (Finder) |
| `DELETE` | `/found-items/{id}` | Delete found item | Yes (Finder) |
| `GET` | `/matches/` | List matches for user's items | Yes |
| `GET` | `/matches/{id}` | Get match details by ID | No |
| `PUT` | `/matches/{id}/status` | Update match status (`pending`, `confirmed`, `rejected`) | Yes |
| `POST` | `/matches/trigger-matching` | Manually trigger AI matching sweep | Yes |
| `GET` | `/notifications/` | List notification history for user | Yes |
