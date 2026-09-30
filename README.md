# 🎓 Student Information Portal (Full-Stack Cloud Application)

A modern, production-ready, full-stack **Student Information Portal** built using **React.js**, **Node.js**, **Express.js**, and **MongoDB Atlas**. Designed as an exemplary project for Cloud Computing coursework, demonstrating **Cloud Compute Services (PaaS)**, **Cloud Database Storage (DBaaS)**, **Global CDN Hosting**, and **Resource/Secret Management**.

---

## 🌟 Key Features

### 🖥️ Frontend (React.js + Vite)
- **Modern Responsive Dashboard:** Clean card-based design with an intuitive student management dashboard.
- **Student Registration & Update Form:**
  - Student Name (with validation)
  - Unique Enrollment Number (auto-uppercased)
  - Course selection (dropdown of popular engineering/computing disciplines + custom input option)
  - Email Address (RFC-compliant regex email validation)
- **Live Student Directory Table:**
  - Responsive table layout on desktop, optimized card view on mobile.
  - Quick action buttons: **Edit** (loads record into form with smooth scroll) and **Delete** (safe deletion with confirmation dialog).
- **Search & Filtering:**
  - Instant live search by **Student Name**, **Enrollment Number**, or **Email**.
  - Dropdown filter by **Course**.
  - Multi-criteria sorting (Newest, Oldest, Name A–Z, Name Z–A, Enrollment No).
- **Dashboard Analytics Cards:**
  - Total enrolled students counter.
  - Active course disciplines counter.
  - Cloud Database (MongoDB Atlas) connectivity badge.
  - Backend Compute Service status badge.
- **Notification System:**
  - Non-intrusive floating Toast notifications for success, errors, and validation alerts.
- **Export Utility:** One-click export of student records to CSV format.
- **Cloud Architecture Modal:** In-app visual breakdown of the 3-Tier cloud deployment.

### ⚙️ Backend (Node.js + Express.js + Mongoose)
- **RESTful API Architecture:**
  - `GET /students` — Retrieve all students (with optional `search`, `course`, and `sort` query params).
  - `GET /students/:id` — Retrieve single student by ID.
  - `POST /students` — Create new student record with schema validation.
  - `PUT /students/:id` — Update student details with duplicate enrollment check.
  - `DELETE /students/:id` — Safely remove student record.
  - `GET /students/stats` — Aggregate metrics (total counts, course distribution, recent enrollments).
  - `GET /health` & `GET /` — API health check for cloud uptime monitoring.
- **Data Validation & Error Handling:**
  - Mongoose schema-level validations (required fields, string lengths, regex email check).
  - Centralized error handler capturing Mongoose `CastError` (invalid ObjectId), `ValidationError`, and MongoDB `11000` duplicate key errors.
- **Security & Cloud Native Best Practices:**
  - Configurable CORS whitelist supporting localhost, Vercel, Netlify, and Render.
  - 12-factor app architecture with strict separation of configuration via `.env`.

### ☁️ Cloud Database (MongoDB Atlas)
- Multi-cloud managed NoSQL database cluster (DBaaS).
- Indexed schema on `name` and `enrollmentNo` for performant searches.
- Guaranteed data persistence with automated replica sets.

---

## 🏗️ 3-Tier Cloud Architecture

```
┌────────────────────────────────────────────────────────┐
│  Presentation Tier (Global Edge Network)              │
│  React.js Single Page Application                      │
│  Hosted on Vercel / Netlify CDN                        │
│  • URL: https://your-student-portal.vercel.app         │
└──────────────────────────┬─────────────────────────────┘
                           │ HTTPS / JSON REST API
                           ▼
┌────────────────────────────────────────────────────────┐
│  Application / Logic Tier (Cloud Compute PaaS)         │
│  Node.js + Express.js API Service                      │
│  Hosted on Render Web Service                          │
│  • URL: https://student-portal-api.onrender.com        │
└──────────────────────────┬─────────────────────────────┘
                           │ Mongoose Driver (TLS Encrypted)
                           ▼
┌────────────────────────────────────────────────────────┐
│  Data Storage Tier (Managed DBaaS)                     │
│  MongoDB Atlas Cloud Database                          │
│  • Cluster: cluster0.mongodb.net (Replica Set)         │
└────────────────────────────────────────────────────────┘
```

---

## 📁 Project Directory Structure

```
studentdb/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB Atlas connection handler
│   ├── controllers/
│   │   └── studentController.js  # CRUD business logic and stats
│   ├── middleware/
│   │   └── errorHandler.js       # Centralized error handler
│   ├── models/
│   │   └── Student.js            # Mongoose schema and model
│   ├── routes/
│   │   └── studentRoutes.js      # Express REST routes
│   ├── .env.example              # Backend environment template
│   ├── .gitignore
│   ├── package.json              # Backend dependencies
│   ├── seed.js                   # Sample dataset seeder script
│   └── server.js                 # Express server entry point
├── frontend/
│   ├── public/
│   │   └── _redirects            # Netlify SPA routing rules
│   ├── src/
│   │   ├── components/
│   │   │   ├── CloudArchitectureModal.jsx # Cloud architecture explainer
│   │   │   ├── ConfirmModal.jsx           # Delete confirmation dialog
│   │   │   ├── Navbar.jsx                 # Header with cloud health badge
│   │   │   ├── StatsCards.jsx             # Metric counter cards
│   │   │   ├── StudentForm.jsx            # Create/Edit form with validation
│   │   │   ├── StudentList.jsx            # Directory table & search/filter bar
│   │   │   ├── StudentRow.jsx             # Individual table row
│   │   │   └── Toast.jsx                  # Floating notifications
│   │   ├── services/
│   │   │   └── api.js                     # Fetch wrapper & API service
│   │   ├── App.jsx                        # Root React component
│   │   ├── index.css                      # Modern responsive CSS styles
│   │   └── main.jsx                       # React DOM entry point
│   ├── .env.example              # Frontend environment template
│   ├── .gitignore
│   ├── index.html                # HTML5 root with Google Fonts
│   ├── package.json              # Frontend dependencies
│   ├── vercel.json               # Vercel SPA rewrite configuration
│   └── vite.config.js            # Vite build & proxy configuration
├── .gitignore                    # Root git ignore
├── package.json                  # Root convenience scripts
└── README.md                     # Comprehensive documentation
```

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher ([Download Node.js](https://nodejs.org/))
- **npm**: v9.0.0 or higher
- **MongoDB Atlas Account** (free tier): [Sign up here](https://www.mongodb.com/cloud/atlas)

### 2. Install Dependencies
You can install dependencies for both frontend and backend using the root script:

```bash
# From the project root (d:\studentdb)
npm run install-all
```

Or install them individually:
```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

### 3. Configure Backend Environment
Navigate to `backend/` and copy `.env.example` to `.env`:

```bash
cd backend
cp .env.example .env   # On Windows PowerShell: Copy-Item .env.example .env
```

Open `.env` and fill in your MongoDB Atlas connection string:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/studentportal?retryWrites=true&w=majority
CLIENT_URL=http://localhost:5173
```

*(See [MongoDB Atlas Setup Guide](#-mongodb-atlas-setup-guide) below for step-by-step instructions on obtaining this URI).*

### 4. Optional: Seed Sample Data
To populate the database with realistic initial student records:
```bash
cd backend
npm run seed
```

### 5. Start Backend Server
```bash
cd backend
npm run dev
```
The server will start on `http://localhost:5000`. You should see:
```
✅ MongoDB Atlas Connected: cluster0-shard-00-00.xxxxx.mongodb.net
🚀 Student Portal API Server running on port 5000
```

### 6. Start Frontend Application
In a new terminal window:
```bash
cd frontend
npm run dev
```
Open your browser and navigate to:
```
http://localhost:5173
```

---

## 📡 REST API Documentation

Base URL: `http://localhost:5000` (Local) or `https://<your-render-url>.onrender.com` (Production)

| HTTP Method | Endpoint | Description | Request Body | Response Status |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/` | API status and route map | None | `200 OK` |
| `GET` | `/health` | Cloud health check endpoint | None | `200 OK` |
| `GET` | `/students` | Get all students (supports `?search=`, `?course=`, `?sort=`) | None | `200 OK` |
| `GET` | `/students/stats` | Dashboard aggregated statistics | None | `200 OK` |
| `GET` | `/students/:id` | Get student details by ID | None | `200 OK` / `404 Not Found` |
| `POST` | `/students` | Register a new student | JSON `{ name, enrollmentNo, course, email }` | `201 Created` / `400 Bad Request` / `409 Conflict` |
| `PUT` | `/students/:id` | Update an existing student | JSON `{ name?, enrollmentNo?, course?, email? }` | `200 OK` / `404 Not Found` / `409 Conflict` |
| `DELETE` | `/students/:id` | Delete student by ID | None | `200 OK` / `404 Not Found` |

### Sample JSON Payloads

#### Create Student (`POST /students`):
```json
{
  "name": "Diya Patel",
  "enrollmentNo": "AI2026014",
  "course": "Artificial Intelligence & Machine Learning",
  "email": "diya.patel@university.edu"
}
```

#### Successful Response (`201 Created`):
```json
{
  "success": true,
  "message": "Student record created successfully",
  "data": {
    "_id": "66fbd235478129a0ef3948b1",
    "name": "Diya Patel",
    "enrollmentNo": "AI2026014",
    "course": "Artificial Intelligence & Machine Learning",
    "email": "diya.patel@university.edu",
    "createdAt": "2026-09-30T17:15:00.000Z",
    "updatedAt": "2026-09-30T17:15:00.000Z"
  }
}
```

---

## ☁️ Cloud Deployment Instructions

### 1. MongoDB Atlas Setup Guide (Cloud Database)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign in.
2. Click **Create a Deployment** and select the **M0 Free Tier** (Shared).
3. Choose a cloud provider (AWS, GCP, or Azure) and a region close to your users (e.g., `AWS / us-east-1` or `AWS / ap-south-1`). Click **Create Deployment**.
4. **Create a Database User:**
   - Go to **Security > Database Access**.
   - Click **Add New Database User**.
   - Select **Password Authentication**.
   - Set Username (e.g., `admin`) and a strong Password (save this safely!).
   - Set Database User Privileges to **Read and write to any database**.
   - Click **Add User**.
5. **Configure Network Access (Whitelisting):**
   - Go to **Security > Network Access**.
   - Click **Add IP Address**.
   - Click **Allow Access from Anywhere** (`0.0.0.0/0`). *(Required for cloud services like Render whose outbound IP changes dynamically).*
   - Click **Confirm**.
6. **Obtain Connection String:**
   - Go to **Database > Clusters** and click **Connect**.
   - Select **Drivers** (Node.js).
   - Copy the connection string format:
     ```
     mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
     ```
   - Replace `<username>` and `<password>` with the credentials created in step 4.
   - Insert database name `studentportal` before the `?` query string:
     ```
     mongodb+srv://admin:MySecretPassword123@cluster0.xxxxx.mongodb.net/studentportal?retryWrites=true&w=majority
     ```

---

### 2. Backend Deployment on Render (Cloud Compute PaaS)
1. Push your code to a GitHub repository (e.g., `student-information-portal`).
2. Sign up / Log in to [Render](https://render.com/).
3. On the Render Dashboard, click **New +** and select **Web Service**.
4. Connect your GitHub repository.
5. Configure the service settings:
   - **Name:** `student-portal-backend`
   - **Region:** Closest to your MongoDB Atlas region (e.g., Oregon or Frankfurt)
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Instance Type:** `Free`
6. Click **Advanced** and add **Environment Variables**:
   | Key | Value |
   | :--- | :--- |
   | `NODE_ENV` | `production` |
   | `PORT` | `10000` *(or leave default, Render sets this dynamically)* |
   | `MONGODB_URI` | Your full MongoDB Atlas connection string |
   | `CLIENT_URL` | Your frontend Vercel URL (e.g., `https://your-student-portal.vercel.app`) |
7. Click **Create Web Service**.
8. Once built and deployed, Render will generate a public URL such as:
   `https://student-portal-backend-xxxx.onrender.com`
9. Test the endpoint by visiting `https://student-portal-backend-xxxx.onrender.com/health` in your browser. It should respond with `{"status":"healthy"}`.

> 💡 **Note on Free Tier Sleeping:** On Render's free tier, the web service spins down after 15 minutes of inactivity. When a new request arrives, it may take 30–50 seconds to wake up (cold start). Our frontend features animated loading indicators and friendly notifications during this period.

---

### 3. Frontend Deployment on Vercel (Edge CDN)
1. Sign up / Log in to [Vercel](https://vercel.com/).
2. Click **Add New... > Project**.
3. Import your GitHub repository.
4. In the project configuration screen:
   - **Framework Preset:** `Vite`
   - **Root Directory:** Click Edit and select `frontend`
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `dist` (auto-detected)
5. Expand the **Environment Variables** section and add:
   | Key | Value |
   | :--- | :--- |
   | `VITE_API_BASE_URL` | `https://student-portal-backend-xxxx.onrender.com` |
   *(Paste your deployed Render backend URL here, without trailing slash).*
6. Click **Deploy**.
7. In ~60 seconds, Vercel will deploy your application and provide a global HTTPS domain:
   `https://student-information-portal.vercel.app`
8. *(Optional)* Return to your Render backend dashboard and update `CLIENT_URL` to match this exact Vercel domain to tighten CORS security.

---

### 🚀 Deploying to Vercel with Neon PostgreSQL (Serverless Full-Stack)

You can deploy the **entire application** (React frontend + Express API serverless backend) directly on **Vercel** with a managed **Neon Serverless PostgreSQL** database in a single project!

#### Step 1: Create a Neon PostgreSQL Database (DBaaS)
1. Sign up / Log in to [Neon Console](https://console.neon.tech/).
2. Click **Create Project**.
3. Choose a Project Name (e.g., `student-portal-db`) and select a Region close to you.
4. Click **Create Project**.
5. Once created, you will see your **Connection Details** on the Dashboard.
6. Copy the **Connection String** (ensure `Pooled connection` is checked for serverless):
   ```
   postgresql://<user>:<password>@<neon-hostname>.neon.tech/<dbname>?sslmode=require
   ```

#### Step 2: (Optional) Test & Seed Locally with Neon
1. In `backend/.env`, set:
   ```env
   DATABASE_URL=postgresql://<user>:<password>@<neon-hostname>.neon.tech/<dbname>?sslmode=require
   ```
2. Run the PostgreSQL database seeder to create the table and populate sample records:
   ```bash
   npm run seed:postgres
   ```
   *(The backend automatically creates the `students` table and indices if they do not exist!)*

#### Step 3: Push Code to GitHub
```bash
git init
git add .
git commit -m "feat: student portal with Neon Postgres and Vercel support"
git branch -M main
git remote add origin https://github.com/<your-username>/student-portal.git
git push -u origin main
```

#### Step 4: Deploy Directly to Vercel
1. Log in to [Vercel](https://vercel.com/) and click **Add New... > Project**.
2. Select your `student-portal` repository.
3. Keep the **Root Directory** as `./` (the root `vercel.json` will automatically build the frontend and route `/students` and `/api/*` to the serverless backend function).
4. Under **Environment Variables**, add:
   | Key | Value |
   | :--- | :--- |
   | `DATABASE_URL` | Your Neon PostgreSQL connection string (`postgresql://...`) |
   | `NODE_ENV` | `production` |
5. Click **Deploy**.
6. In under 60 seconds, Vercel will build the React frontend and deploy the Express API as a high-performance Serverless Function!
7. Visit your generated `https://<your-project>.vercel.app` domain. You will have a live, production-ready Student Information Portal with instant edge latency and serverless autoscaling!

---

## 📚 Cloud Computing Practical Assignment Viva / Presentation Guide

This project is tailored to fulfill and demonstrate core Cloud Computing curriculum competencies:

### 1. What Cloud Service Models are used?
- **Platform as a Service (PaaS):** Render hosts the Node.js application layer. Developers deploy source code directly without provisioning OS patches, kernels, or physical server hardware.
- **Database as a Service (DBaaS):** MongoDB Atlas manages database provisioning, automated backups, replica sets, and scaling without manual database administrator intervention.
- **Content Delivery Network (Edge CDN / SaaS):** Vercel hosts the compiled static frontend bundles across geo-distributed edge servers worldwide for minimal client latency.

### 2. How is Internet Accessibility achieved?
- The frontend and backend communicate over the public internet using secure **HTTPS/TLS encryption**.
- Communication is governed by **CORS (Cross-Origin Resource Sharing)** headers configured in Express to allow the Vercel domain to issue requests to the Render backend domain.

### 3. How are Cloud Secrets and Resource Configurations managed?
- The project follows the **12-Factor App methodology**. Sensitive credentials such as the database connection string (`MONGODB_URI`) are stored in secure cloud environment variables on Render, never committed into public git repositories.

### 4. What happens when database connectivity fails?
- The backend features event listeners (`disconnected`, `reconnected`) on the Mongoose connection and returns standardized error payloads with appropriate HTTP status codes (500, 404, 409).
- The frontend displays real-time health badges and toast error alerts guiding the user.

---

## 🧪 Testing Your Deployment
1. **Create Student:** Fill the registration form with unique name, enrollment no, course, and email. Click **Submit & Save**. Verify that the student appears in the directory table and MongoDB Atlas collection.
2. **Search Record:** Type the student's name or enrollment number in the search box; the list filters instantly.
3. **Filter by Course:** Select a course from the dropdown; only students enrolled in that course are shown.
4. **Edit Record:** Click the **Edit** button. The form fills with the student's current information. Make changes and click **Update Student**.
5. **Delete Record:** Click **Delete**. Confirm the prompt in the dialog. The record is permanently removed from the cloud database.
6. **Export Data:** Click **Export CSV** to download a spreadsheet of current directory records.

---

## 📄 License
This project is open-source and licensed under the [MIT License](LICENSE).
