# AI Lost and Found Assistant 🔍🤖

An AI-powered Lost & Found platform that uses semantic text matching and visual feature similarity to automatically identify lost and found items.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https.mit-license.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110.0-009688.svg?logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB.svg?logo=react)](https://reactjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com)

---

## 🌟 Key Features

- 🔐 **JWT Authentication & Argon2 Security**: Secure registration, login, and user profile management with Argon2id password hashing and Bearer tokens.
- 📋 **Lost & Found Item Registries**: Complete item management featuring location tags, date filters, item categories, and image upload dropzones.
- 🧠 **Multimodal AI Semantic Matching Engine**:
  - **Text Embeddings**: `SentenceTransformers` (`all-MiniLM-L6-v2`) dense vector representations.
  - **Visual Embeddings**: `OpenCLIP` (`ViT-B-32`) visual feature extraction.
  - **Vector Search**: `FAISS` high-speed nearest-neighbor indexing.
  - **Lazy Loading**: AI models load on demand without delaying FastAPI startup.
- ⚖️ **Interactive Match Resolution**: Side-by-side match comparison cards with similarity breakdown percentages and status toggles (`pending`, `confirmed`, `rejected`).
- 🔔 **Automated Email & History Notifications**: Email alerts sent to owners upon match discovery, backed by an in-app notification log.
- 🎨 **Modern Dark Mode UI**: Stunning glassmorphism interface built with React, Vite, Tailwind CSS, custom modals, floating toasts, and zero browser alert popups.

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

## 📁 Folder Structure

```
AI-Lost-and-Found-Assistant/
├── backend/
│   ├── app/
│   │   ├── api/          # FastAPI route handlers
│   │   ├── auth/         # Argon2 & JWT authentication logic
│   │   ├── core/         # Settings, exception handlers, logging
│   │   ├── database/     # SQLAlchemy DB session & initialization
│   │   ├── models/       # Database ORM models (User, Lost, Found, Match, Notification)
│   │   ├── schemas/      # Pydantic validation schemas
│   │   ├── services/ai/  # Sentence Transformers, OpenCLIP & FAISS engine
│   │   └── main.py       # FastAPI application entrypoint
│   ├── uploads/          # Static file storage for item photos
│   └── requirements.txt  # Python backend dependencies
├── frontend/
│   ├── src/
│   │   ├── components/   # ItemCard, ItemForm, Modals, TopNav, Sidebar
│   │   ├── context/      # AuthContext & ToastContext
│   │   ├── pages/        # Dashboard, Auth, Lost, Found, Matches, Profile
│   │   └── services/     # Axios API services
│   ├── package.json      # Frontend npm dependencies
│   └── vite.config.js    # Vite configuration
├── PROJECT_DOCUMENTATION.md
└── README.md
```

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

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/auth/register` | No | Register new user account |
| `POST` | `/auth/login` | No | Authenticate & return JWT token |
| `GET` | `/auth/me` | Yes | Get authenticated user profile |
| `GET` | `/lost-items/` | Yes | List lost items (`?my_items_only=true`) |
| `POST` | `/lost-items/` | Yes | Report a lost item with photo |
| `PUT` | `/lost-items/{id}` | Yes | Update lost item report |
| `DELETE` | `/lost-items/{id}` | Yes | Delete lost item report |
| `GET` | `/found-items/` | Yes | List found items (`?my_items_only=true`) |
| `POST` | `/found-items/` | Yes | Register a found item with photo |
| `PUT` | `/found-items/{id}` | Yes | Update found item registration |
| `DELETE` | `/found-items/{id}` | Yes | Delete found item registration |
| `GET` | `/matches/` | Yes | List AI matches with similarity breakdown |
| `PUT` | `/matches/{id}/status` | Yes | Update match status (`confirmed`/`rejected`) |
| `POST` | `/matches/trigger-matching` | Yes | Run AI matching sweep |
| `GET` | `/notifications/` | Yes | Fetch notification alert history |

---

## 🖼️ Application Screenshots

*(Placeholders for GitHub repository visual showcase)*

| Dashboard Overview | AI Matches & Similarity |
|---|---|
| ![Dashboard](https://via.placeholder.com/600x350/0f172a/ffffff?text=Dashboard+Overview) | ![Matches](https://via.placeholder.com/600x350/0f172a/ffffff?text=AI+Matches+Breakdown) |

---

## 🔮 Future Improvements

- 📍 **GIS Location Mapping**: Map radius search & lost location clustering.
- 💬 **In-App Finder Chat**: Real-time messaging between lost item owners and finders.
- 📱 **Push & SMS Alerts**: Twilio integration for instant SMS notifications.

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## ✍️ Author

**Swetha Battula**
- GitHub: [@SwethaBattula](https://github.com/SwethaBattula)
- Repository: [AI-Lost-and-Found-Assistant](https://github.com/SwethaBattula/AI-Lost-and-Found-Assistant)
