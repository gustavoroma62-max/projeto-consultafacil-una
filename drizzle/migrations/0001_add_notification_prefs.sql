ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS telefone text,
  ADD COLUMN IF NOT EXISTS email_aviso text,
  ADD COLUMN IF NOT EXISTS aviso_email boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS aviso_sms boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS aviso_navegador boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS antecedencia_horas integer NOT NULL DEFAULT 24;