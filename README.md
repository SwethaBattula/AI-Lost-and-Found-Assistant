# AI Lost and Found Assistant 🔍🤖

An AI-powered Lost & Found platform that uses semantic text matching and visual feature similarity to automatically identify lost and found items.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https.mit-license.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.141.1-009688.svg?logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB.svg?logo=react)](https://reactjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com)

---

## 🌟 Key Features

- 🔐 **Role-Based Authentication & Argon2 Security**: Student & Administrator role support with Argon2id password hashing, Bearer JWT tokens, and RBAC endpoint guards.
- 👑 **Administrator Portal & Verification Workflow**: Admin dashboard featuring global platform metrics, match approval/rejection audit, handover collection management, and read-only user directory.
- 📋 **Lost & Found Item Registries**: Complete item management featuring location tags, date filters, item categories, community catalog search, and image upload dropzones.
- 🧠 **Multimodal AI Semantic Matching Engine**:
  - **Text Embeddings**: `SentenceTransformers` (`all-MiniLM-L6-v2`) dense vector representations.
  - **Visual Embeddings**: `OpenCLIP` (`ViT-B-32`) visual feature extraction.
  - **Vector Search**: `FAISS` high-speed nearest-neighbor indexing.
  - **Lazy Loading**: AI models load on demand without delaying FastAPI startup.
- ⚖️ **Interactive Match Resolution**: Side-by-side match comparison cards with similarity breakdown percentages, match stage lifecycle timeline, and status toggles (`pending`, `under_review`, `ready_for_collection`, `confirmed`, `rejected`).
- 🔔 **Automated Email & Notification Center**: Real-time match discovery, admin verification alerts, and collection notifications backed by an in-app notification center.
- 🎨 **Modern Dark Mode UI**: Premium glassmorphism interface built with React 18, Vite, Tailwind CSS, custom modals, floating toasts, and zero browser alert popups.

---

## 🔑 Default Administrator Seed Credentials

Upon initial database initialization, the system automatically seeds a default administrator account:

- **Email**: `admin@ailostfound.com`
- **Password**: `AdminPass123!`
- **Role**: `admin`

*(Admin and Student users sign in through the same `/login` page and are automatically routed based on their role).*

---

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI (Python 3.11)
- **Database & ORM**: SQLite & SQLAlchemy ORM
- **Password Hashing**: Argon2 (`argon2-cffi`)
- **AI Libraries**: `sentence-transformers`, `open_clip_torch`, `faiss-cpu`, `torch`, `Pillow`, `opencv-python`

### Frontend
- **Framework**: React 18 & Vite
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios with JWT Interceptors
- **Icons**: Lucide React

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Python 3.11+
- Node.js v18+ & npm v9+

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start backend server
uvicorn app.main:app --reload --port 8000
```
Backend API will be running at `http://127.0.0.1:8000` with Swagger UI documentation available at `http://127.0.0.1:8000/docs`.

### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
Frontend application will be accessible at `http://localhost:3000`.

---

## 📖 API Documentation Summary

| Method | Endpoint | Auth / Role | Description |
|--------|----------|-------------|-------------|
| `POST` | `/auth/register` | Public | Register new student account |
| `POST` | `/auth/login` | Public | Authenticate user & return JWT token |
| `GET` | `/auth/me` | Authenticated | Get authenticated user profile |
| `GET` | `/lost-items/` | Authenticated | List lost items (`?my_items_only=true`) |
| `POST` | `/lost-items/` | Authenticated | Report a lost item with photo |
| `GET` | `/found-items/` | Authenticated | List found items (`?my_items_only=true`) |
| `POST` | `/found-items/` | Authenticated | Register a found item with photo |
| `GET` | `/matches/` | Authenticated | List AI matches with similarity breakdown |
| `PUT` | `/matches/{id}/status` | Authenticated | Update match status (`confirmed`/`rejected`) |
| `POST` | `/matches/trigger-matching` | Authenticated | Run AI matching sweep |
| `GET` | `/notifications/` | Authenticated | Fetch notification alert history |
| `PUT` | `/notifications/mark-read` | Authenticated | Mark all notifications as read |
| `GET` | `/admin/stats` | Admin Only | Get global platform statistics |
| `GET` | `/admin/matches` | Admin Only | List all system matches for audit |
| `PUT` | `/admin/matches/{id}/approve` | Admin Only | Approve match $\rightarrow$ status `ready_for_collection` |
| `PUT` | `/admin/matches/{id}/reject` | Admin Only | Reject match $\rightarrow$ status `rejected` |
| `GET` | `/admin/collections` | Admin Only | List matches awaiting physical handover |
| `PUT` | `/admin/matches/{id}/collect` | Admin Only | Mark match as `confirmed` (Collected) |
| `GET` | `/admin/users` | Admin Only | Read-only directory of registered users |

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## ✍️ Author

**Swetha Battula**
- GitHub: [@SwethaBattula](https://github.com/SwethaBattula)
- Repository: [AI-Lost-and-Found-Assistant](https://github.com/SwethaBattula/AI-Lost-and-Found-Assistant)
