-- Database initialization script for Writer
-- Runs automatically on first PostgreSQL container start

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create full-text search function
CREATE OR REPLACE FUNCTION documents_search_trigger() RETURNS trigger AS $$
BEGIN
  NEW.search_vector := to_tsvector('english', COALESCE(NEW.title, '') || ' ' || COALESCE(NEW.content, ''));
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

-- Comment for documentation
COMMENT ON FUNCTION documents_search_trigger IS 'Automatically updates search_vector for full-text search';

-- Log successful initialization
DO $$
BEGIN
  RAISE NOTICE 'Writer database initialized successfully';
END
$$;
