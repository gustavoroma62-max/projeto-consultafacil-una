import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type PrefsAviso = {
  acompanhante_nome: string;
  acompanhante_telefone: string;
  telefone: string;
  email_aviso: string;
  aviso_email: boolean;
  aviso_sms: boolean;
  aviso_navegador: boolean;
  antecedencia_horas: number;
};

/** Nome, e-mail e preferências de aviso da pessoa logada. */
export function usePerfil() {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ["perfil"],
    queryFn: async () => {
      const { data: auth } = await supabase.auth.getUser();
      const user = auth.user;
      if (!user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("nome, telefone, email_aviso, aviso_email, aviso_sms, aviso_navegador, antecedencia_horas, acompanhante_nome, acompanhante_telefone")
        .eq("id", user.id)
        .maybeSingle();
      if (error) throw error;
      return {
        id: user.id,
        nome: data?.nome ?? user.email ?? "",
        email: user.email ?? "",
        avisos: {
          acompanhante_nome: data?.acompanhante_nome ?? "",
          acompanhante_telefone: data?.acompanhante_telefone ?? "",
          telefone: data?.telefone ?? "",
          email_aviso: data?.email_aviso || user.email || "",
          aviso_email: data?.aviso_email ?? true,
          aviso_sms: data?.aviso_sms ?? false,
          aviso_navegador: data?.aviso_navegador ?? true,
          antecedencia_horas: data?.antecedencia_horas ?? 24,
        } as PrefsAviso,
      };
    },
  });

  const salvar = useMutation({
    mutationFn: async (dados: Partial<PrefsAviso> & { nome?: string }) => {
      const id = query.data?.id;
      if (!id) throw new Error("Sessão expirada");
      const { data, error } = await supabase.from("profiles").update(dados).eq("id", id).select("id").single();
      if (error) throw error;
      if (!data) throw new Error("Não foi possível salvar seu perfil");
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["perfil"] }),
  });

  return {
    nome: query.data?.nome ?? "",
    email: query.data?.email ?? "",
    avisos: query.data?.avisos,
    carregado: !query.isLoading,
    salvarAsync: salvar.mutateAsync,
  };
}
