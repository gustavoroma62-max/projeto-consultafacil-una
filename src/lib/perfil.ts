import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/** Nome e e-mail da pessoa logada. */
export function usePerfil() {
  const query = useQuery({
    queryKey: ["perfil"],
    queryFn: async () => {
      const { data: auth } = await supabase.auth.getUser();
      const user = auth.user;
      if (!user) return { nome: "", email: "" };
      const { data } = await supabase
        .from("profiles")
        .select("nome")
        .eq("id", user.id)
        .maybeSingle();
      return { nome: data?.nome ?? user.email ?? "", email: user.email ?? "" };
    },
  });

  return { nome: query.data?.nome ?? "", email: query.data?.email ?? "" };
}
