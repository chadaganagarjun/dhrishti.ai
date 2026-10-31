# DRISHTI – Infrastructure Project Monitoring & Risk Management System

**DRISHTI** is a web-based infrastructure project monitoring and risk management platform designed to simplify project administration, track execution progress, manage contractors, monitor expenses, and identify potential project risks.

The platform provides a centralized dashboard that helps administrators monitor project performance, manage essential project information, and make informed decisions through structured reports and analytics.

## ✨ Key Features

- **Dashboard Overview** – Get a centralized view of project statistics, progress, and important updates.
- **Project Management** – Create, manage, and monitor infrastructure projects.
- **Contractor Management** – Maintain contractor information and manage project assignments.
- **Milestone Tracking** – Organize project milestones and monitor completion status.
- **Progress Monitoring** – Track project execution and record progress updates.
- **Expense Management** – Record and monitor project-related expenses.
- **Risk Management** – Identify, document, and track potential project risks.
- **Reports & Analytics** – Generate structured reports to understand project performance.
- **Authentication** – Secure access through an admin login system.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Frontend structure |
| CSS3 | Styling and responsive interface |
| JavaScript | Frontend functionality |
| Node.js | Backend runtime |
| Express.js | REST API and server |
| MySQL | Relational database |
| JWT | Authentication |
| bcryptjs | Password hashing |

## 📁 Project Structure

```text
DRISHTI/
├── frontend/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── app.js
│   │   ├── dashboard.js
│   │   ├── projects.js
│   │   ├── contractors.js
│   │   └── reports.js
│   ├── index.html
│   ├── login.html
│   ├── dashboard.html
│   ├── projects.html
│   ├── contractors.html
│   ├── milestones.html
│   ├── progress.html
│   ├── expenses.html
│   ├── risks.html
│   └── reports.html
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── projects.js
│   │   ├── contractors.js
│   │   ├── milestones.js
│   │   ├── progress.js
│   │   ├── expenses.js
│   │   ├── risks.js
│   │   └── reports.js
│   ├── server.js
│   └── package.json
│
├── database/
│   ├── schema.sql
│   └── sample_data.sql
│
├── .gitignore
└── README.md
```

## ⚙️ Installation & Setup

### Prerequisites

Make sure the following are installed:

- [Node.js](https://nodejs.org/)
- [MySQL Community Server](https://dev.mysql.com/downloads/mysql/)
- [Git](https://git-scm.com/)
- A code editor such as [Visual Studio Code](https://code.visualstudio.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/dishanthjain/dhrishti.ai.git
cd dhrishti.ai
```

### 2. Configure the Database

Start your MySQL server and create the database:

```sql
CREATE DATABASE drishti;
```

Import the database schema and sample data from the project root:

```bash
mysql -u root -p drishti < database/schema.sql
mysql -u root -p drishti < database/sample_data.sql
```

Enter your MySQL password when prompted.

### 3. Configure Environment Variables

Navigate to the backend directory:

```bash
cd backend
```

Create a `.env` file inside the `backend` folder:

```env
PORT=5001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=drishti
JWT_SECRET=replace_with_a_secure_random_secret
```

Replace the database password and JWT secret with your own values.

### 4. Install Dependencies

```bash
npm install
```

### 5. Start the Application

```bash
npm run dev
```

Open your browser and visit:

**http://localhost:5001**

## 🔐 Authentication

DRISHTI includes an admin authentication system.

For local development, an initial admin account may be created automatically by the backend:

- Email: `admin@drishti.local`
- Password: `Admin@123`

**Security note:** Change the default credentials before using the application outside a local development environment.

## 🗄️ Database Modules

The MySQL database is designed to support the following modules:

- Users and authentication
- Infrastructure projects
- Contractors
- Project milestones
- Progress records
- Project expenses
- Project risks

## 🔒 Security & Configuration

- Environment variables are used for sensitive configuration.
- Passwords are hashed using bcryptjs.
- JWT is used for authentication.
- Database credentials and secrets should never be committed to GitHub.
- The `.env` file and `node_modules` directory should remain excluded through `.gitignore`.

## 🚀 Future Enhancements

- Interactive project analytics and visual dashboards
- Role-based access control
- Document and image uploads
- Automated project status notifications
- Advanced risk assessment and reporting
- Exportable PDF and Excel reports
- Cloud deployment

## 👨‍💻 Project Maintainer

**Nagarjun Chadaga**

- GitHub: [@chadaganagarjun](https://github.com/chadaganagarjun)
- Email: nagarjunchadaga@gmail.com

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---
