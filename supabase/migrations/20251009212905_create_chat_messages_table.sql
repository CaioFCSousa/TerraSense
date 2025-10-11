/*
  # Create chat messages table

  1. New Tables
    - `chat_messages`
      - `id` (uuid, primary key) - Unique identifier for each message
      - `analysis_id` (uuid, foreign key) - Reference to the soil analysis
      - `role` (text) - Role of the message sender ('user' or 'assistant')
      - `content` (text) - The message content
      - `created_at` (timestamptz) - Timestamp when message was created
  
  2. Security
    - Enable RLS on `chat_messages` table
    - Add policy for public read access (matching analyses table security)
    - Add policy for public insert access (matching analyses table security)
    
  3. Important Notes
    - Messages are linked to analyses through analysis_id
    - Public access matches the analyses table policy
    - Chat history is preserved for future reference
    - Messages are automatically deleted when analysis is deleted (CASCADE)
*/

CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id uuid NOT NULL REFERENCES analyses(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view chat messages"
  ON chat_messages
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert chat messages"
  ON chat_messages
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_chat_messages_analysis_id ON chat_messages(analysis_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);