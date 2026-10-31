# DRISHTI

An Intelligent Infrastructure Project Monitoring and Risk Management System.

## Technology
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- Database: MySQL
- Charts: Chart.js

## Requirements
- Node.js 18 or newer
- MySQL 8 or newer

## Setup on macOS or Windows

1. Install Node.js and MySQL.
2. Create a MySQL database by importing `database/schema.sql`.
3. Optional: import `database/sample_data.sql` after the schema. Sample rows are not required; the server creates a first-run admin account automatically.
4. Open a terminal in `backend` and run:

   ```bash
   npm install
   ```

5. Create `backend/.env` using this template:

   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=drishti
   JWT_SECRET=replace_this_with_a_long_random_secret
   ```

6. Start the backend:

   ```bash
   npm run dev
   ```

7. Open `http://localhost:5000` in your browser.

## First login
If the users table is empty, the server creates:
- Email: `admin@drishti.local`
- Password: `Admin@123`

Change this password after your first login. Keep your `.env` private and never upload it to GitHub.

## Windows transfer
Transfer the project folder without `node_modules`. On Windows, create `backend/.env`, run `npm install` in `backend`, import the SQL schema into MySQL, and run `npm run dev`.

## Main modules
Dashboard, projects, contractors, milestones, progress updates, expenses, risks, alerts and reports.
