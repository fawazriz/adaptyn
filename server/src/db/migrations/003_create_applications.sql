CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  company VARCHAR NOT NULL,
  role VARCHAR NOT NULL,
  job_url VARCHAR,
  status VARCHAR DEFAULT 'saved' 
    CHECK (status IN ('saved','applied','phone_screen','interview','offer','rejected')),
  applied_date DATE,
  salary_min INTEGER,
  salary_max INTEGER,
  location VARCHAR,
  source VARCHAR DEFAULT 'other'
    CHECK (source IN ('linkedin','company','referral','other')),
  resume_version_id UUID,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);