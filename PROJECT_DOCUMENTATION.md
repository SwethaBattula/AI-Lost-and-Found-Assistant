# AI Lost and Found Assistant - Comprehensive Project Documentation

## 1. Project Overview

The **AI Lost and Found Assistant** is a production-quality, full-stack platform designed to automate the process of matching lost items with found items. Traditional lost and found systems rely on manual keyword searches or physical registries, which are error-prone and inefficient. 

This platform leverages multimodal Artificial Intelligence—combining **semantic text embeddings** (using Sentence Transformers) and **visual feature embeddings** (using OpenCLIP)—with high-speed vector indexing (via **FAISS**) to automatically discover potential item matches even when titles or descriptions use different terminology.

---

## 2. Features

- **"I Found Something" Workflow**: Redesigned primary finder navigation (`/i-found-something`) offering finders a decision hub to either search community lost reports first or create a manual found item report.
- **Personal Student Dashboard**: Displays strictly personal metrics (`My Lost Items`, `My Found Items`, `My Matches`) and personal activity logs (`My Recent Lost Reports`, `My Recent Found Reports`) scoped to the logged-in user.
- **Community Lost Items**: Public community catalog (`/community-lost-items`) allowing finders to search and filter reported lost items across campus/community without exposing sensitive user contact details.
- **Enhanced Report Found Workflow**: Optional workflow enabling finders to select an existing community lost report to automatically pre-fill item details before submitting.
- **Lost Item Management**: Submit, view, filter, update, and delete lost item reports with image uploads.
- **Found Item Management**: Register, view, filter, update, and delete found item reports with image uploads.
- **Multimodal AI Matching Engine**:
  - Semantic text similarity using `all-MiniLM-L6-v2`.
  - Visual image feature similarity using `OpenCLIP` (`ViT-B-32`).
  - High-performance vector similarity search using `FAISS`.
  - Combined confidence score calculation with automatic background match evaluation.
- **Interactive Match Resolution**: Review matched lost & found items side-by-side with match score breakdowns and confirm/reject status updates.
- **Notification Subsystem**: Email alerts sent to item owners upon match discovery, backed by an in-app notification history log.
- **Interactive Dashboard**: Modern user dashboard displaying system stats, recent lost/found entries, and quick actions.
- **User Profile**: Profile page showcasing user details, verification status, and account metadata.
- **Responsive Modern UI**: Modern dark-themed user interface built with React, Vite, Tailwind CSS, custom modals, floating toast alerts, and zero browser alert interruptions.

---

## 3. Technology Stack

### Backend
- **Core Framework**: Python 3.11, FastAPI
- **ORM & Database**: SQLAlchemy ORM, SQLite
- **Security & Authentication**: Argon2 (`argon2-cffi`), PyJWT, OAuth2 Bearer scheme
- **Data Validation**: Pydantic v2
- **AI & ML Engine**:
  - `sentence-transformers` (`all-MiniLM-L6-v2`)
  - `open_clip_torch` (`ViT-B-32`)
  - `faiss-cpu` (Vector Indexing)
  - `torch`, `torchvision`
  - `opencv-python`, `Pillow`

### Frontend
- **Framework**: React 18, Vite
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios (with custom interceptors)
- **Icons**: Lucide React

---

## 4. Folder Structure

```
AI-Lost-and-Found-Assistant/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── router.py
│   │   │   ├── auth.py
│   │   │   ├── lost_items.py
│   │   │   ├── found_items.py
│   │   │   ├── matches.py
│   │   │   └── notifications.py
│   │   ├── auth/
│   │   │   ├── hashing.py
│   │   │   └── jwt.py
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── exceptions.py
│   │   │   └── logging.py
│   │   ├── database/
│   │   │   ├── db.py
│   │   │   └── init_db.py
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   ├── lost_item.py
│   │   │   ├── found_item.py
│   │   │   ├── match.py
│   │   │   └── notification.py
│   │   ├── schemas/
│   │   │   ├── user.py
│   │   │   ├── lost_item.py
│   │   │   ├── found_item.py
│   │   │   ├── match.py
│   │   │   └── notification.py
│   │   ├── services/
│   │   │   ├── email_service.py
│   │   │   └── ai/
│   │   │       ├── text_matcher.py
│   │   │       ├── image_matcher.py
│   │   │       ├── vector_store.py
│   │   │       └── matching_service.py
│   │   ├── utils/
│   │   │   └── file_upload.py
│   │   └── main.py
│   ├── uploads/
│   │   ├── lost/
│   │   └── found/
│   ├── requirements.txt
│   ├── .env.example
│   └── README.md
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── ConfirmationModal.jsx
│   │   │   │   ├── EmptyState.jsx
│   │   │   │   ├── ErrorBoundary.jsx
│   │   │   │   ├── ItemCard.jsx
│   │   │   │   ├── ItemForm.jsx
│   │   │   │   ├── LoadingSpinner.jsx
│   │   │   │   ├── SkeletonLoader.jsx
│   │   │   │   └── Toast.jsx
│   │   │   ├── layout/
│   │   │   │   ├── MainLayout.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── TopNav.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ToastContext.jsx
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   ├── lost/
│   │   │   │   ├── MyLostItems.jsx
│   │   │   │   └── ReportLostItem.jsx
│   │   │   ├── found/
│   │   │   │   ├── MyFoundItems.jsx
│   │   │   │   └── ReportFoundItem.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Matches.jsx
│   │   │   ├── Notifications.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── NotFound.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── lostItemService.js
│   │   │   ├── foundItemService.js
│   │   │   ├── matchService.js
│   │   │   └── notificationService.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── PROJECT_DOCUMENTATION.md
├── README.md
├── LICENSE
└── .gitignore
```

---

## 5. Backend Architecture

The backend follows a clean, layered architecture separating API routing, business logic, data models, and specialized AI services:

1. **API Router Layer (`backend/app/api/`)**: Handlers for HTTP requests, query parameter validation, and status responses.
2. **Core & Config (`backend/app/core/`)**: Application settings loaded from `.env`, custom exception handlers, and structured logging.
3. **Database Layer (`backend/app/database/`)**: SQLAlchemy engine session management (`db.py`) and table creation (`init_db.py`).
4. **Data Models & Schemas (`backend/app/models/` & `backend/app/schemas/`)**: Declarative SQLAlchemy models and corresponding Pydantic schemas for serialization.
5. **AI Services (`backend/app/services/ai/`)**: Modular package for semantic text embedding (`text_matcher.py`), image feature extraction (`image_matcher.py`), FAISS indexing (`vector_store.py`), and high-level match management (`matching_service.py`).
6. **Authentication (`backend/app/auth/`)**: Password hashing with Argon2 and JWT bearer token creation/decoding.

---

## 6. Frontend Architecture

The frontend is built using React 18 and Vite, structured into modular contexts, services, and components:

1. **Service Layer (`src/services/`)**: Centralized Axios client (`api.js`) with request interceptors attaching JWT tokens and response interceptors handling `401 Unauthorized`.
2. **Context Layer (`src/context/`)**:
   - `AuthContext`: Maintains `token`, `user`, authentication status, and auth actions (`login`, `register`, `logout`).
   - `ToastContext`: Provides floating notification alerts across all pages.
3. **Layout Components (`src/components/layout/`)**: `MainLayout`, `Sidebar` (without badge counters), and `TopNav`.
4. **Common Reusable Components (`src/components/common/`)**: Reusable UI components (`ItemCard`, `ItemForm`, `ConfirmationModal`, `Toast`, `ErrorBoundary`, `SkeletonLoader`, `EmptyState`, `LoadingSpinner`).
5. **Pages (`src/pages/`)**: Route views for Dashboard, Auth, Lost/Found item management, Matches, Notifications, and Profile.

---

## 7. Authentication Flow

```
[User Form] ---> (POST /auth/register) ---> [Argon2 Password Hash] ---> Saved to Database
                                                                                 |
[User Form] ---> (POST /auth/login)    ---> [Verify Argon2 Hash]    ---> Generates JWT
                                                                                 |
[React App] <--- [Returns Token + User Info] <------------------------------------+
     |
Stores in localStorage
     |
Attaches "Authorization: Bearer <token>" on all API requests via Axios Interceptor
```

1. **Password Hashing**: Passwords are hashed using the **Argon2id** algorithm (`argon2-cffi`) with secure salt parameters.
2. **Token Generation**: Upon valid credential verification, a JWT token is encoded using `HS256` containing `sub` (user ID) and expiration (`exp`).
3. **Token Verification**: Protected endpoints decode and validate the token via FastAPI dependencies (`get_current_user`).

---

## 8. Database Schema

The SQLite database (`lost_found.db`) consists of 5 tables:

### Table: `users`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | Integer | Primary Key, Auto-increment | Unique user identifier |
| `full_name` | String(100) | Not Null | User's full name |
| `email` | String(255) | Unique, Index, Not Null | User's email address |
| `password_hash` | String(255) | Not Null | Argon2 password hash |
| `created_at` | DateTime | Default `utcnow` | Account creation timestamp |

**Relationships**:
- One-to-Many with `LostItem` (`user.lost_items`)
- One-to-Many with `FoundItem` (`user.found_items`)
- One-to-Many with `Notification` (`user.notifications`)

### Table: `lost_items`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | Integer | Primary Key, Auto-increment | Unique lost item identifier |
| `user_id` | Integer | Foreign Key (`users.id`), Not Null | Owner's user ID |
| `item_name` | String(100) | Index, Not Null | Title of lost item |
| `category` | String(50) | Index, Not Null | Category classification |
| `description` | Text | Not Null | Detailed description |
| `date_lost` | DateTime | Not Null | Date item was lost |
| `location` | String(255) | Index, Not Null | Location lost |
| `image_path` | String(255) | Nullable | Uploaded image path |
| `created_at` | DateTime | Default `utcnow` | Creation timestamp |

**Relationships**:
- Belongs to `User` (`lost_item.owner`)
- One-to-Many with `Match` (`lost_item.matches`)

### Table: `found_items`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | Integer | Primary Key, Auto-increment | Unique found item identifier |
| `user_id` | Integer | Foreign Key (`users.id`), Not Null | Finder's user ID |
| `item_name` | String(100) | Index, Not Null | Title of found item |
| `category` | String(50) | Index, Not Null | Category classification |
| `description` | Text | Not Null | Detailed description |
| `date_found` | DateTime | Not Null | Date item was found |
| `location` | String(255) | Index, Not Null | Location found |
| `image_path` | String(255) | Nullable | Uploaded image path |
| `created_at` | DateTime | Default `utcnow` | Creation timestamp |

**Relationships**:
- Belongs to `User` (`found_item.finder`)
- One-to-Many with `Match` (`found_item.matches`)

### Table: `matches`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | Integer | Primary Key, Auto-increment | Unique match identifier |
| `lost_item_id` | Integer | Foreign Key (`lost_items.id`), Not Null | Associated lost item |
| `found_item_id` | Integer | Foreign Key (`found_items.id`), Not Null | Associated found item |
| `text_similarity` | Float | Not Null | Text similarity score (0.0 to 1.0) |
| `image_similarity` | Float | Not Null | Image similarity score (0.0 to 1.0) |
| `confidence_score` | Float | Index, Not Null | Overall confidence score (0.0 to 1.0) |
| `status` | String(20) | Default `'pending'`, Index | Match status (`pending`/`confirmed`/`rejected`) |
| `created_at` | DateTime | Default `utcnow` | Creation timestamp |

**Relationships**:
- Belongs to `LostItem` (`match.lost_item`)
- Belongs to `FoundItem` (`match.found_item`)
- One-to-Many with `Notification` (`match.notifications`)

### Table: `notifications`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | Integer | Primary Key, Auto-increment | Unique notification identifier |
| `user_id` | Integer | Foreign Key (`users.id`), Not Null | Recipient user ID |
| `match_id` | Integer | Foreign Key (`matches.id`), Not Null | Associated match ID |
| `message` | Text | Not Null | Notification content |
| `sent_at` | DateTime | Default `utcnow` | Timestamp sent |

**Relationships**:
- Belongs to `User` (`notification.user`)
- Belongs to `Match` (`notification.match`)

---

## 9. API Documentation

| Method | Route | Auth Required | Description |
|--------|-------|---------------|-------------|
| `GET` | `/` | No | System health check endpoint |
| `POST` | `/auth/register` | No | Register a new user account |
| `POST` | `/auth/login` | No | Authenticate user & return JWT token |
| `GET` | `/auth/me` | **Yes** | Retrieve authenticated user profile |
| `GET` | `/lost-items/` | **Yes** | List all lost items (supports `my_items_only=true`) |
| `POST` | `/lost-items/` | **Yes** | Create a new lost item report with optional image |
| `GET` | `/lost-items/{id}` | **Yes** | Retrieve single lost item details |
| `PUT` | `/lost-items/{id}` | **Yes** | Update a lost item report |
| `DELETE` | `/lost-items/{id}` | **Yes** | Delete a lost item report |
| `GET` | `/found-items/` | **Yes** | List all found items (supports `my_items_only=true`) |
| `POST` | `/found-items/` | **Yes** | Create a new found item registration with optional image |
| `GET` | `/found-items/{id}` | **Yes** | Retrieve single found item details |
| `PUT` | `/found-items/{id}` | **Yes** | Update a found item registration |
| `DELETE` | `/found-items/{id}` | **Yes** | Delete a found item registration |
| `GET` | `/matches/` | **Yes** | List all AI matches (supports `min_confidence` & `status_filter`) |
| `GET` | `/matches/{id}` | **Yes** | Retrieve single match details |
| `PUT` | `/matches/{id}/status` | **Yes** | Update match status (`pending`, `confirmed`, `rejected`) |
| `POST` | `/matches/trigger-matching` | **Yes** | Execute on-demand AI matching sweep across items |
| `GET` | `/notifications/` | **Yes** | Retrieve user's notification alert history |

---

## 10. AI Matching Workflow

```
                        +---------------------------+
                        |   New Lost / Found Item   |
                        +---------------------------+
                                      |
                   +------------------+------------------+
                   |                                     |
         [Text Content]                            [Uploaded Image]
                   |                                     |
                   v                                     v
       (SentenceTransformer)                        (OpenCLIP)
       'all-MiniLM-L6-v2'                           'ViT-B-32'
                   |                                     |
                   v                                     v
       384-dim Text Embedding                    512-dim Image Embedding
                   |                                     |
                   +------------------+------------------+
                                      |
                                      v
                          (FAISS FlatL2 Vector Store)
                                      |
                                      v
                           Similarity Score Computation
                                      |
                                      v
               Overall Confidence Score = (Text * 0.6) + (Image * 0.4)
                                      |
                                      v
                        Threshold Check (Score >= 0.5)
                                      |
                           +----------+----------+
                           |                     |
                        [Passed]              [Failed]
                           |                     |
                           v                     v
                 Save Match & Notify        Discard Match
```

### 1. Lazy Model Loading
To prevent startup latency and keep the FastAPI service lightweight, AI models are **lazily initialized** on the first matching request, cached in memory, and reused for subsequent embeddings:
- `SentenceTransformerMatcher`: Loads `all-MiniLM-L6-v2` on first text vector request.
- `OpenCLIPMatcher`: Loads `ViT-B-32` (`laion2b_s34b_b79k`) on first image vector request.
- If model loading fails (e.g. offline environment), fallback heuristic text matching ensures backend stability.

### 2. Sentence Transformers (`all-MiniLM-L6-v2`)
Converts item title, category, location, and description into a **384-dimensional dense vector**. Text similarity is calculated using cosine similarity:
$$\text{Text Sim} = \frac{\vec{T}_{\text{lost}} \cdot \vec{T}_{\text{found}}}{\|\vec{T}_{\text{lost}}\| \|\vec{T}_{\text{found}}\|}$$

### 3. OpenCLIP (`ViT-B-32`)
Converts uploaded item images into a **512-dimensional visual feature embedding**. Image similarity is computed via normalized cosine distance:
$$\text{Image Sim} = \frac{\vec{I}_{\text{lost}} \cdot \vec{I}_{\text{found}}}{\|\vec{I}_{\text{lost}}\| \|\vec{I}_{\text{found}}\|}$$

### 4. FAISS Vector Indexing
Under `app/services/ai/vector_store.py`, `FAISS` (`IndexFlatL2`) indexes item embeddings for high-speed nearest-neighbor retrieval.

### 5. Confidence Score Formula
When both text and image embeddings exist:
$$\text{Confidence Score} = (0.6 \times \text{Text Sim}) + (0.4 \times \text{Image Sim})$$
If an item has no image uploaded:
$$\text{Confidence Score} = \text{Text Sim}$$

Matches with a confidence score $\ge 0.5$ (50%) are saved to the `matches` database table and trigger email notification alerts.

---

## 11. Frontend Component Hierarchy

```
App
├── ErrorBoundary
│   └── ToastProvider
│       └── AuthProvider
│           └── BrowserRouter
│               ├── Login (/login)
│               ├── Register (/register)
│               └── ProtectedRoute
│                   └── MainLayout
│                       ├── Sidebar
│                       ├── TopNav
│                       └── Pages
│                           ├── Dashboard (/)
│                           ├── ReportLostItem (/lost-items/new)
│                           │   └── ItemForm
│                           ├── MyLostItems (/lost-items)
│                           │   ├── ItemCard (Image Modal)
│                           │   ├── ItemForm (Edit Modal)
│                           │   ├── ConfirmationModal (Delete)
│                           │   └── EmptyState / SkeletonLoader
│                           ├── ReportFoundItem (/found-items/new)
│                           │   └── ItemForm
│                           ├── MyFoundItems (/found-items)
│                           │   ├── ItemCard
│                           │   ├── ItemForm
│                           │   └── ConfirmationModal
│                           ├── Matches (/matches)
│                           │   ├── MatchCards (Side-by-side comparison)
│                           │   └── StatusButtons (Confirm / Reject)
│                           ├── Notifications (/notifications)
│                           ├── Profile (/profile)
│                           └── NotFound (*)
```

---

## 12. Environment Variables

### Backend Configuration (`backend/.env`)
| Variable | Default Value | Description |
|----------|---------------+-------------|
| `PROJECT_NAME` | `AI Lost and Found Assistant` | Application title |
| `API_V1_STR` | `""` | API prefix string |
| `SECRET_KEY` | `super-secret-jwt-key` | Secret key for signing JWT tokens |
| `ALGORITHM` | `HS256` | JWT signing algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `10080` | Token expiration time in minutes (7 days) |
| `DATABASE_URL` | `sqlite:///./lost_found.db` | SQLAlchemy database connection URI |
| `SMTP_HOST` | `smtp.gmail.com` | Outgoing email server host |
| `SMTP_PORT` | `587` | Outgoing email server port |
| `SMTP_USER` | `""` | SMTP sender email username |
| `SMTP_PASSWORD` | `""` | SMTP sender app password |
| `EMAIL_FROM` | `noreply@ailostfound.com` | Display sender email address |

### Frontend Configuration (`frontend/.env`)
| Variable | Default Value | Description |
|----------|---------------+-------------|
| `VITE_API_BASE_URL` | `http://127.0.0.1:8000` | Backend API base URL referenced via `import.meta.env` |

---

## 13. Installation & Setup Guide

### Prerequisites
- Python 3.11+
- Node.js v18+ & npm v9+

### Backend Setup
1. Navigate to `backend/` directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On Linux/macOS:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure `.env` (optional, defaults provided in `.env.example`).
5. Run backend development server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   Backend will be running at `http://127.0.0.1:8000` with Swagger UI docs at `http://127.0.0.1:8000/docs`.

### Frontend Setup
1. Navigate to `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Configure `.env`:
   ```ini
   VITE_API_BASE_URL=http://127.0.0.1:8000
   ```
4. Run frontend development server:
   ```bash
   npm run dev
   ```
   Frontend will be running at `http://localhost:3000`.

---

## 14. Screenshots Section

*(Placeholders for application interface demonstrations)*

### 1. Login Page
![Login Page Screenshot](https://via.placeholder.com/800x450/0f172a/ffffff?text=Login+Page+UI)

### 2. Registration Page
![Registration Page Screenshot](https://via.placeholder.com/800x450/0f172a/ffffff?text=Register+Page+UI)

### 3. Dashboard Overview
![Dashboard Screenshot](https://via.placeholder.com/800x450/0f172a/ffffff?text=Dashboard+Overview+UI)

### 4. Report Lost Item Page
![Report Lost Item Screenshot](https://via.placeholder.com/800x450/0f172a/ffffff?text=Report+Lost+Item+UI)

### 5. My Lost Items Grid & Image Modal
![My Lost Items Screenshot](https://via.placeholder.com/800x450/0f172a/ffffff?text=My+Lost+Items+Grid+UI)

### 6. Matches Page & Score Breakdown
![Matches Page Screenshot](https://via.placeholder.com/800x450/0f172a/ffffff?text=AI+Matches+Comparison+UI)

### 7. Notifications Feed
![Notifications Screenshot](https://via.placeholder.com/800x450/0f172a/ffffff?text=Notification+History+UI)

### 8. User Profile Page
![User Profile Screenshot](https://via.placeholder.com/800x450/0f172a/ffffff?text=User+Profile+UI)

---

## 15. Known Limitations

1. **Local SQLite File Storage**: Uses SQLite for local database persistence. Production scaling would benefit from PostgreSQL.
2. **FAISS In-Memory Index**: Vector indexes are currently built in-memory per run. Larger deployments can integrate persistent vector databases (e.g. Qdrant or Milvus).
3. **Local Upload Storage**: Uploaded files are stored on local disk under `uploads/`. Cloud deployments should use AWS S3 or Cloudinary.

---

## 16. Future Enhancements

- **Geographic Radius Matching**: Integrate GPS coordinates and map visualization (Mapbox/Google Maps API) for location proximity scoring.
- **Push & SMS Notifications**: Integrate Twilio SMS and Web Push notifications alongside email alerts.
- **In-App Messaging**: Enable secure, direct chat between lost item owners and finders.
- **Multilingual Support**: Add internationalization (i18n) for global campus or airport deployments.
