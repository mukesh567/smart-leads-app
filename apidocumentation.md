# Smart Leads API Documentation

Welcome to the Smart Leads API documentation. This API provides authentication and lead management capabilities for the Smart Leads Dashboard.

**Base URL**: `http://localhost:5000/api` (Local) or `https://your-app.onrender.com/api` (Production)

---

## 🔐 Authentication

### 1. Register User
Create a new account.
- **Endpoint**: `POST /auth/register`
- **Access**: Public
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "SALES_USER" // Optional: "ADMIN" or "SALES_USER" (default)
  }
  ```
- **Response (201)**:
  ```json
  {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "SALES_USER",
    "token": "JWT_TOKEN_HERE"
  }
  ```

### 2. Login User
Authenticate and receive a token.
- **Endpoint**: `POST /auth/login`
- **Access**: Public
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response (200)**:
  ```json
  {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "SALES_USER",
    "token": "JWT_TOKEN_HERE"
  }
  ```

---

## 📈 Lead Management
*All Lead routes require a `Authorization: Bearer <TOKEN>` header.*

### 1. Get All Leads
Fetch leads with filtering, search, and pagination.
- **Endpoint**: `GET /leads`
- **Access**: Private (Authenticated)
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Leads per page (default: 10)
  - `status`: Filter by status (`NEW`, `CONTACTED`, `QUALIFIED`, `LOST`, `WON`)
  - `source`: Filter by source (`WEBSITE`, `REFERRAL`, `COLD_CALL`, `ADVERTISEMENT`)
  - `search`: Search by name or email
  - `sort`: `latest` or `oldest`
- **Response (200)**:
  ```json
  {
    "leads": [...],
    "page": 1,
    "pages": 5,
    "total": 48
  }
  ```

### 2. Create Lead
Add a new lead.
- **Endpoint**: `POST /leads`
- **Access**: Private (Authenticated)
- **Body**:
  ```json
  {
    "name": "Sarah Connor",
    "email": "sarah@example.com",
    "status": "NEW",
    "source": "WEBSITE"
  }
  ```

### 3. Update Lead
Modify an existing lead.
- **Endpoint**: `PUT /leads/:id`
- **Access**: Private (Authenticated)
- **Body**: (Any subset of fields)
  ```json
  {
    "status": "QUALIFIED"
  }
  ```

### 4. Delete Lead
Remove a lead from the system.
- **Endpoint**: `DELETE /leads/:id`
- **Access**: Private (**Admin Only**)

### 5. Export Leads
Download all leads as a CSV file.
- **Endpoint**: `GET /leads/export`
- **Access**: Private (Authenticated)
- **Response**: CSV File stream

---

## 🏥 Health Check
- **Endpoint**: `GET /health`
- **Access**: Public
- **Response**: `{"status": "ok", "message": "..."}`
