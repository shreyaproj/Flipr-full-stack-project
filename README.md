# Full Stack Portfolio Application 🚀

A dynamic, full-stack portfolio website built for the **Flipr Placement Task**. This application features a public-facing landing page for showcasing projects and clients, and a secure admin dashboard for content management.

![Project Banner](./screenshots/Banner.png)

## 🌟 Features

### Public Landing Page
- **Hero Section:** Responsive design with modern UI matching the provided reference.
- **Projects Showcase:** Dynamic grid displaying projects fetched from the backend.
- **Client Testimonials:** Section to display client details, images, and designations.
- **Contact Form:** Functional form that saves messages to the database and sends email notifications.
- **Newsletter:** Email subscription functionality.

### Admin Dashboard (Protected)
- **Secure Authentication:** JWT-based login system for admins.
- **Project Management:** Add, delete, and view projects with **Image Cropping** functionality.
- **Client Management:** Add and manage client profiles.
- **Message Center:** View enquiries submitted via the contact form.
- **Subscriber List:** View and manage newsletter subscribers.

### Bonus Features Implemented
- ✅ **Image Cropping:** Integrated `react-easy-crop` to enforce specific aspect ratios ($450 \times 350$) for uploads.
- ✅ **Dockerized:** Fully containerized setup with Docker Compose.

---

## 🛠️ Tech Stack

**Frontend:**
- React.js (v18)
- Tailwind CSS (Styling)
- Axios (API Consumption)
- React Router DOM (Navigation)
- React Toastify (Notifications)

**Backend:**
- Django (v4.x)
- Django REST Framework (DRF)
- Simple JWT (Authentication)
- PostgreSQL (Database)

**DevOps:**
- Docker & Docker Compose

---

## 🚀 Getting Started (Docker Method - Recommended)

The easiest way to run the application is using Docker.

### Prerequisites
- Docker Desktop installed on your machine.
- Git.

### Steps
1.  **Clone the Repository**
    ```bash
    git clone https://github.com/shreyaproj/Flipr-full-stack-project
    cd https://github.com/shreyaproj/Flipr-full-stack-project
    ```

2.  **Build and Run**
    Run the following command in the root directory (where `docker-compose.yml` is located):
    ```bash
    docker-compose up --build
    ```
    *This will start the Backend (Port 8000), Frontend (Port 3000), and Database (Port 5432).* 

3.  **Create Admin User**
    To access the dashboard, you need a superuser account. Open a new terminal while the containers are running and execute:
    ```bash
    docker-compose exec backend python manage.py createsuperuser
    ```
    Follow the prompts to set a username and password.

4.  **Access the Application**
    - **Frontend:** http://localhost:3000
    - **Admin Panel:** http://localhost:3000/admin/login
    - **Backend API:** http://localhost:8000/api/

---

## ⚙️ Manual Installation (Without Docker)

If you prefer running it manually:

### 1. Backend Setup
```bash
cd backend
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations (Ensure you have a Postgres DB running and configured in settings.py)
python manage.py makemigrations
python manage.py migrate

# Create Superuser
python manage.py createsuperuser

# Run Server
python manage.py runserver
```

### 2. Frontend Setup
```bash
cd frontend
# Install dependencies
npm install

# Run React App
npm start
```

---

## 📂 Project Structure

```
├── backend/                # Django Project
│   ├── api/                # App logic (Models, Views, Serializers)
│   ├── backend/            # Project settings
│   ├── media/              # Uploaded images
│   ├── Dockerfile          # Backend Docker config
│   └── requirements.txt    # Python dependencies
│
├── frontend/               # React Project
│   ├── public/
│   ├── src/
│   │   ├── components/     # Dashboard components (ProjectManager, etc.)
│   │   ├── pages/          # Main Pages (LandingPage, AdminDashboard)
│   │   └── services/       # API configuration
│   └── Dockerfile          # Frontend Docker config
│
└── docker-compose.yml      # Orchestration file
```

## 📝 API Endpoints

Method | Endpoint | Description
---|---|---
POST | `/api/auth/login` | Admin Login (Returns JWT)
GET  | `/api/projects`   | Get all projects
POST | `/api/projects`   | Create new project (Admin only, Multipart/Form-data)
GET  | `/api/clients`    | Get all clients
POST | `/api/clients`    | Add new client (Admin only)
POST | `/api/contact/`   | Submit contact form
POST | `/api/newsletter/`| Subscribe to newsletter

---

## 🤝 Contributing

1. Fork the repository.
2. Create a new branch (git checkout -b feature/AmazingFeature).
3. Commit your changes (git commit -m 'Add some AmazingFeature').
4. Push to the branch (git push origin feature/AmazingFeature).
5. Open a Pull Request.

---

## 📄 License

Distributed under the MIT License. See LICENSE for more information.
