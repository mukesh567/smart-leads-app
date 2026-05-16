# Smart Leads Dashboard

A professional, full-stack Lead Management Dashboard built with the MERN stack (MongoDB, Express, React, Node) using TypeScript. This project features clean architecture, scalable code practices, and a premium user experience.

## 🚀 Features

- **Authentication System**: Secure JWT-based auth with password hashing (bcrypt).
- **Leads Management**: Full CRUD operations for leads.
- **Advanced Filtering & Search**: Combined filters for Status and Source, debounced search by Name or Email, and sorting.
- **Pagination**: Efficient backend pagination (10 records per page).
- **Role-Based Access Control (RBAC)**: Admin and Sales User roles (e.g., only Admin can delete leads).
- **CSV Export**: Export all leads data to a CSV file.
- **Dark Mode Support**: Seamless transition between light and dark themes.
- **Responsive Design**: Optimized for all screen sizes with premium aesthetics.
- **Docker Support**: Ready for containerized deployment.

## 🛠️ Tech Stack

- **Frontend**: React.js, TypeScript, TailwindCSS, Framer Motion, Lucide React.
- **Backend**: Node.js, Express.js, TypeScript, MongoDB, Mongoose.
- **Auth**: JWT (JSON Web Token), Bcrypt.js.
- **Tools**: Axios, React Hook Form, Zod, Date-fns, CSV-Writer.

## 📁 Project Structure

```text
smart-leads-dashboard/
├── backend/
│   ├── src/
│   │   ├── config/       # Database & Environment config
│   │   ├── controllers/  # Request handlers
│   │   ├── middleware/   # Auth, RBAC, Error handling
│   │   ├── models/       # Mongoose schemas
│   │   ├── routes/       # API endpoints
│   │   └── index.ts      # App entry point
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── api/          # Axios configuration
│   │   ├── components/   # UI & Shared components
│   │   ├── context/      # Auth state management
│   │   ├── hooks/        # Custom hooks (Debounce, etc.)
│   │   ├── pages/        # Main application views
│   │   └── types/        # TypeScript interfaces
│   └── Dockerfile
└── docker-compose.yml
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (Running locally or on Atlas)
- Docker (Optional, for containerized setup)

### Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd smart-leads-dashboard
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   # Create .env file based on .env.example
   npm run dev
   ```

3. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   # Create .env file based on .env.example
   npm run dev
   ```

### Docker Setup

To run the entire stack using Docker:
```bash
docker-compose up --build
```

## 📖 API Documentation

### Auth Endpoints
- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Authenticate user and get token.

### Leads Endpoints
- `GET /api/leads`: Get paginated/filtered leads (Protected).
- `POST /api/leads`: Create a new lead (Protected).
- `PUT /api/leads/:id`: Update lead details (Protected).
- `DELETE /api/leads/:id`: Delete a lead (Admin Only).
- `GET /api/leads/export`: Export leads to CSV (Protected).

## 🛡️ Security Features

- **JWT Authentication**: Secure stateless authentication.
- **Password Hashing**: Bcrypt with salt rounds for secure storage.
- **Middleware Protection**: Routes are guarded by authentication and RBAC checks.
- **Input Validation**: Request bodies are validated using Zod/Mongoose schemas.
- **Helmet**: Secure Express headers.

## 🎨 UI/UX Highlights

- **Glassmorphism**: Modern frosted-glass effect for sidebars and headers.
- **Micro-animations**: Smooth transitions using Tailwind and CSS animations.
- **State Feedback**: Proper loading, empty, and error states across the dashboard.
- **Form Validation**: Real-time feedback using React Hook Form.

---

Built with ❤️ by Antigravity (Advanced Agentic Coding AI)
