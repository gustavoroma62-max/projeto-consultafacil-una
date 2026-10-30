CREATE TYPE public.compromisso_tipo AS ENUM ('consulta','exame','procedimento');
ALTER TABLE public.consultas ADD COLUMN tipo public.compromisso_tipo NOT NULL DEFAULT 'consulta';