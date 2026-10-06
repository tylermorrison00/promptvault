-- PromptVault update 8: Pro early-access system
-- Run this in Supabase Dashboard > SQL Editor.
-- Adds the early_until timestamp: when set and in the future, a Pro prompt
-- stays Pro-only; after it passes, Basic members unlock it automatically.

alter table prompts add column if not exists early_until timestamptz;
