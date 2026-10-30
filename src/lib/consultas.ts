import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Tipo = "consulta" | "exame" | "procedimento";
export const TIPOS: Record<Tipo, string> = { consulta: "Consulta", exame: "Exame", procedimento: "Procedimento" };

export type Status = "agendada" | "realizada" | "cancelada";

export type Consulta = {
  id: string;
  profissional: string;
  especialidade: string;
  data: string; // AAAA-MM-DD
  hora: string; // HH:MM
  local: string;
  exigencias: string;
  status: Status;
  tipo: Tipo;
};

export type Situacao = "atrasada" | "hoje" | "futura" | Status;

function hoje(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

function deslocar(dias: number): string {
  const d = new Date();
  d.setDate(d.getDate() + dias);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

/** Equivalente a calcular_situacao(): só marca atrasada se ainda está 'agendada'. */
export function calcularSituacao(c: Consulta): Situacao {
  if (c.status !== "agendada") return c.status;
  const hj = hoje();
  if (c.data < hj) return "atrasada";
  if (c.data === hj) return "hoje";
  return "futura";
}

export function ordenar(lista: Consulta[]): Consulta[] {
  return [...lista].sort((a, b) =>
    `${a.data}${a.hora}`.localeCompare(`${b.data}${b.hora}`),
  );
}

/** Primeira consulta 'agendada' com data >= hoje. */
export function proximaConsulta(lista: Consulta[]): Consulta | undefined {
  const hj = hoje();
  return ordenar(lista).find((c) => c.status === "agendada" && c.data >= hj);
}

export function formatarData(data: string): string {
  const [a, m, d] = data.split("-");
  return `${d}/${m}/${a}`;
}

export function rotuloDia(data: string): string {
  const hj = hoje();
  if (data === hj) return "Hoje";
  if (data === deslocar(1)) return "Amanhã";
  if (data === deslocar(-1)) return "Ontem";
  const dt = new Date(`${data}T12:00:00`);
  return dt.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short" });
}

/** Consultas da pessoa logada, guardadas no banco de dados. */
export function useConsultas() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["consultas"],
    queryFn: async (): Promise<Consulta[]> => {
      const { data, error } = await supabase
        .from("consultas")
        .select("id, profissional, especialidade, data, hora, local, exigencias, status, tipo")
        .order("data", { ascending: true })
        .order("hora", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Consulta[];
    },
  });

  const invalidar = () => qc.invalidateQueries({ queryKey: ["consultas"] });

  const criarMut = useMutation({
    mutationFn: async (dados: Omit<Consulta, "id" | "status">) => {
      const { data: sessao } = await supabase.auth.getUser();
      const userId = sessao.user?.id;
      if (!userId) throw new Error("Sessão expirada");
      const { error } = await supabase
        .from("consultas")
        .insert({ ...dados, status: "agendada", user_id: userId });
      if (error) throw error;
    },
    onSuccess: invalidar,
  });

  const atualizarMut = useMutation({
    mutationFn: async ({ id, dados }: { id: string; dados: Partial<Consulta> }) => {
      const { error } = await supabase.from("consultas").update(dados).eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidar,
  });

  const excluirMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("consultas").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidar,
  });

  return {
    consultas: query.data ?? [],
    carregado: !query.isLoading,
    erro: query.error as Error | null,
    criar: (dados: Omit<Consulta, "id" | "status">) => criarMut.mutate(dados),
    criarAsync: (dados: Omit<Consulta, "id" | "status">) => criarMut.mutateAsync(dados),
    atualizar: (id: string, dados: Partial<Consulta>) => atualizarMut.mutate({ id, dados }),
    atualizarAsync: (id: string, dados: Partial<Consulta>) =>
      atualizarMut.mutateAsync({ id, dados }),
    excluir: (id: string) => excluirMut.mutate(id),
  };
}
