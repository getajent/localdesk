-- Enable pgvector extension for vector similarity search
create extension if not exists vector;

-- Create documents table for storing documentation chunks
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  metadata jsonb not null default '{}'::jsonb,
  embedding vector(1536), -- OpenAI ada-002 embedding size
  created_at timestamptz default now()
);

-- Create index for vector similarity search
create index if not exists documents_embedding_idx 
  on public.documents 
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- Create index for metadata queries
create index if not exists documents_metadata_idx 
  on public.documents 
  using gin (metadata);

-- Function to search documents by similarity
create or replace function match_documents(
  query_embedding vector(1536),
  match_threshold float default 0.7,
  match_count int default 5
)
returns table (
  id uuid,
  content text,
  metadata jsonb,
  similarity float
)
language sql stable
as $$
  select
    documents.id,
    documents.content,
    documents.metadata,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where 1 - (documents.embedding <=> query_embedding) > match_threshold
  order by documents.embedding <=> query_embedding
  limit match_count;
$$;

-- Enable RLS
alter table public.documents enable row level security;

-- Allow public read access to documents
create policy "Documents are publicly readable"
  on public.documents
  for select
  to public
  using (true);
