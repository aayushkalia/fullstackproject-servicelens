-- =============================================
-- ServiceLens Seed Data
-- Run after schema.sql:
--   psql -d servicelens -f db/seed.sql
-- =============================================

-- Admin user (password: admin123)
-- Hash generated with bcryptjs, 10 rounds
INSERT INTO users (name, email, password_hash, role) VALUES
('Admin User', 'admin@servicelens.com', '$2b$10$GGMgYcUOppDMtRBBiwTxm.hfO7BcFF9CUZh43qqvmai2FrwAwC26e', 'admin');

-- Categories
INSERT INTO categories (name, description) VALUES
('Healthcare',  'Hospitals, diagnostic centres, clinics'),
('Education',   'Coaching institutes, tutors, online courses'),
('Fitness',     'Gyms, yoga studios, personal trainers'),
('Rentals',     'Apartments, PG accommodations, co-living');

-- Healthcare Providers
INSERT INTO providers (category_id, name, description, city, address, phone, is_approved) VALUES
(1, 'Medanta Diagnostics',     'Multi-specialty diagnostic centre',            'Mumbai',    'Andheri West, Mumbai',      '9876543210', TRUE),
(1, 'Apollo Diagnostics',      'Trusted diagnostics with 50+ test centres',   'Mumbai',    'Bandra East, Mumbai',       '9876543211', TRUE),
(1, 'SRL Diagnostics',         'Affordable blood tests and scans',            'Delhi',     'Connaught Place, Delhi',    '9876543212', TRUE),
(1, 'Thyrocare',               'Budget-friendly thyroid and wellness tests',  'Bangalore', 'Koramangala, Bangalore',    '9876543213', TRUE),
(1, 'Dr Lal PathLabs',         'Pan-India diagnostic chain',                  'Delhi',     'Lajpat Nagar, Delhi',       '9876543214', TRUE);

-- Education Providers
INSERT INTO providers (category_id, name, description, city, address, phone, is_approved) VALUES
(2, 'Unacademy Centre',        'IIT-JEE and NEET coaching',                   'Bangalore', 'HSR Layout, Bangalore',     '9876543220', TRUE),
(2, 'BYJU''s Tuition Centre',  'K-12 and competitive exam coaching',          'Mumbai',    'Powai, Mumbai',             '9876543221', TRUE),
(2, 'Allen Career Institute',  'Top NEET and JEE coaching',                   'Kota',      'Talwandi, Kota',            '9876543222', TRUE);

-- Fitness Providers
INSERT INTO providers (category_id, name, description, city, address, phone, is_approved) VALUES
(3, 'Gold''s Gym',             'Premium gym with personal training',          'Mumbai',    'Bandra West, Mumbai',       '9876543230', TRUE),
(3, 'Cult.fit',                'Group workouts, yoga, and MMA',              'Bangalore', 'Indiranagar, Bangalore',    '9876543231', TRUE);

-- Unapproved provider (for testing admin flow)
INSERT INTO providers (category_id, name, description, city, address, phone, is_approved) VALUES
(3, 'FitLife Studio',          'New boutique fitness studio',                 'Pune',      'Hinjewadi, Pune',           '9876543232', FALSE);

-- Service Pricing
INSERT INTO service_pricing (provider_id, service_name, price, unit) VALUES
-- Medanta Diagnostics
(1, 'MRI Brain Scan',          2200.00, 'per scan'),
(1, 'Complete Blood Count',    350.00,  'per test'),
(1, 'X-Ray Chest',             400.00,  'per scan'),
-- Apollo Diagnostics
(2, 'MRI Brain Scan',          3500.00, 'per scan'),
(2, 'Complete Blood Count',    300.00,  'per test'),
(2, 'CT Scan Abdomen',         4500.00, 'per scan'),
-- SRL Diagnostics
(3, 'MRI Brain Scan',          1800.00, 'per scan'),
(3, 'Thyroid Profile',         500.00,  'per test'),
-- Thyrocare
(4, 'Thyroid Profile',         300.00,  'per test'),
(4, 'Complete Blood Count',    200.00,  'per test'),
(4, 'Vitamin D Test',          600.00,  'per test'),
-- Dr Lal PathLabs
(5, 'Complete Blood Count',    250.00,  'per test'),
(5, 'Liver Function Test',     700.00,  'per test'),
-- Unacademy
(6, 'JEE Crash Course',        15000.00, 'per course'),
(6, 'NEET Full Course',        25000.00, 'per course'),
-- BYJU''s
(7, 'Class 10 Tuition',        8000.00, 'per month'),
(7, 'JEE Full Course',         20000.00, 'per course'),
-- Allen
(8, 'NEET 2-Year Program',     180000.00, 'per program'),
(8, 'JEE 1-Year Program',      120000.00, 'per program'),
-- Gold's Gym
(9, 'Monthly Membership',      2500.00, 'per month'),
(9, 'Personal Training (10)',  8000.00, 'per pack'),
-- Cult.fit
(10, 'Monthly Pass',           1500.00, 'per month'),
(10, 'Yearly Pass',            12000.00, 'per year');

-- Sample Reviews
INSERT INTO provider_reviews (provider_id, user_id, rating, comment) VALUES
(1, 1, 5, 'Excellent diagnostics. Very professional staff.'),
(2, 1, 4, 'Good service but slightly expensive.'),
(4, 1, 4, 'Very affordable. Quick turnaround.');

-- Update avg_rating and review_count based on seeded reviews
UPDATE providers SET
  avg_rating = sub.avg,
  review_count = sub.cnt
FROM (
  SELECT provider_id, ROUND(AVG(rating), 2) AS avg, COUNT(*) AS cnt
  FROM provider_reviews
  GROUP BY provider_id
) sub
WHERE providers.id = sub.provider_id;
