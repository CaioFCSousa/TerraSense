/*
  # Create analyses table for TerraSense

  ## Overview
  This migration creates the core analyses table to store soil analysis data.

  ## New Tables
  
  ### `analyses`
  - `id` (uuid, primary key): Unique identifier for each analysis
  - `created_at` (timestamptz): Timestamp of when the analysis was created
  - `image_url` (text): Base64 encoded image or URL of the soil photo
  - `soil_type` (text): Identified type of soil (e.g., "Solo Argiloso", "Solo Arenoso")
  - `characteristics` (text[]): Array of soil characteristics identified by AI
  - `recommendations` (text[]): Array of planting recommendations
  - `location` (text, optional): User-provided location information

  ## Security
  - Enable RLS on `analyses` table
  - Add policy for public read access (since no auth is implemented)
  - Add policy for public insert access (since no auth is implemented)

  ## Notes
  - This is a simple implementation without user authentication
  - In production, you would want to add user authentication and restrict access accordingly
  - All users can see all analyses in this implementation
*/

CREATE TABLE IF NOT EXISTS analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now() NOT NULL,
  image_url text NOT NULL,
  soil_type text NOT NULL,
  characteristics text[] NOT NULL DEFAULT '{}',
  recommendations text[] NOT NULL DEFAULT '{}',
  location text
);

ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view analyses"
  ON analyses
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert analyses"
  ON analyses
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_analyses_created_at ON analyses(created_at DESC);
