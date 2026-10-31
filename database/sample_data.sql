USE drishti;
INSERT INTO contractors (name, company, email, phone, specialization, status) VALUES
('Arun Shetty','Apex Infra Works','arun@apexinfra.example','9876500001','Road construction','active'),
('Meera Rao','BuildRight Constructions','meera@buildright.example','9876500002','Bridge engineering','active'),
('Kiran Das','UrbanCore Projects','kiran@urbancore.example','9876500003','Building construction','active');

INSERT INTO projects (project_name, location, description, budget, start_date, end_date, status, progress) VALUES
('NH Access Road Upgrade','Mangaluru, Karnataka','Road widening and resurfacing works.',8500000,'2026-08-01','2027-03-31','In Progress',42),
('River Bridge Rehabilitation','Bantwal, Karnataka','Structural repair and safety improvement.',12500000,'2026-09-15','2027-08-30','Planning',8),
('Community Health Centre','Vogga, Karnataka','Construction of a two-storey health centre.',6200000,'2026-06-01','2026-12-30','In Progress',68);

INSERT INTO project_contractors (project_id, contractor_id) VALUES (1,1),(2,2),(3,3);
INSERT INTO milestones (project_id,name,description,planned_date,status) VALUES
(1,'Site preparation','Clear and prepare the site.','2026-11-15','In Progress'),
(1,'Road base completion','Complete base layer.','2026-12-20','Pending'),
(2,'Structural inspection','Complete initial inspection.','2026-11-20','Pending'),
(3,'Foundation completion','Finish foundation work.','2026-10-15','Completed');
INSERT INTO cost_records (project_id,amount,category,expense_date,description) VALUES
(1,1250000,'Materials','2026-09-10','Aggregates and bitumen'),
(1,450000,'Labour','2026-09-18','Site labour charges'),
(3,980000,'Materials','2026-08-20','Cement and steel');
INSERT INTO risks (project_id,type,severity,description,status) VALUES
(1,'Weather','High','Heavy rainfall may delay resurfacing.','Monitoring'),
(2,'Structural','Critical','Unexpected structural damage may increase cost.','Open');
INSERT INTO alerts (project_id,risk_id,message,severity,status) VALUES
(1,1,'Weather risk requires monitoring on NH Access Road Upgrade.','High','Unread'),
(2,2,'Critical structural risk reported for River Bridge Rehabilitation.','Critical','Unread');
