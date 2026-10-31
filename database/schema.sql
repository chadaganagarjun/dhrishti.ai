CREATE DATABASE IF NOT EXISTS drishti CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE drishti;

CREATE TABLE IF NOT EXISTS users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin','manager') NOT NULL DEFAULT 'manager',
  phone VARCHAR(30),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contractors (
  contractor_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  company VARCHAR(160),
  email VARCHAR(160),
  phone VARCHAR(30),
  specialization VARCHAR(120),
  status ENUM('active','inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
  project_id INT AUTO_INCREMENT PRIMARY KEY,
  project_name VARCHAR(180) NOT NULL,
  location VARCHAR(180) NOT NULL,
  description TEXT,
  budget DECIMAL(14,2) NOT NULL DEFAULT 0,
  start_date DATE,
  end_date DATE,
  status ENUM('Planning','In Progress','On Hold','Completed','Cancelled') DEFAULT 'Planning',
  progress DECIMAL(5,2) NOT NULL DEFAULT 0,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_projects_user FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS project_contractors (
  project_id INT NOT NULL,
  contractor_id INT NOT NULL,
  assigned_on DATE DEFAULT (CURRENT_DATE),
  PRIMARY KEY (project_id, contractor_id),
  FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
  FOREIGN KEY (contractor_id) REFERENCES contractors(contractor_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS milestones (
  milestone_id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  name VARCHAR(160) NOT NULL,
  description TEXT,
  planned_date DATE NOT NULL,
  status ENUM('Pending','In Progress','Completed','Delayed') DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS progress_updates (
  update_id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  update_date DATE NOT NULL,
  description TEXT NOT NULL,
  completed_work TEXT,
  remarks TEXT,
  progress_percent DECIMAL(5,2) DEFAULT 0,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS cost_records (
  cost_id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  amount DECIMAL(14,2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  expense_date DATE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS risks (
  risk_id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  type VARCHAR(120) NOT NULL,
  severity ENUM('Low','Medium','High','Critical') DEFAULT 'Low',
  description TEXT NOT NULL,
  status ENUM('Open','Monitoring','Mitigated','Closed') DEFAULT 'Open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS alerts (
  alert_id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT,
  risk_id INT,
  message VARCHAR(255) NOT NULL,
  severity ENUM('Low','Medium','High','Critical') DEFAULT 'Medium',
  status ENUM('Unread','Read','Resolved') DEFAULT 'Unread',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
  FOREIGN KEY (risk_id) REFERENCES risks(risk_id) ON DELETE SET NULL
);
