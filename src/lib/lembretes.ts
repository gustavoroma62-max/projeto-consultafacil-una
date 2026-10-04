import { useEffect, useMemo } from "react";
import type { Consulta } from "@/lib/consultas";
import { formatarData } from "@/lib/consultas";

/** Consultas agendadas que acontecem dentro da janela de antecedência. */
export function consultasProximas(lista: Consulta[], horas: number): Consulta[] {
  const agora = Date.now();
  const limite = agora + horas * 3600_000;
  return lista.filter((c) => {
    if (c.status !== "agendada") return false;
    const t = new Date(`${c.data}T${c.hora || "00:00"}:00`).getTime();
    return t >= agora && t <= limite;
  });
}

export function textoLembrete(c: Consulta) {
  return `Consulta com ${c.profissional} (${c.especialidade}) em ${formatarData(c.data)} às ${c.hora}, ${c.local}.${c.exigencias ? ` Lembre-se: ${c.exigencias}.` : ""}`;
}

export async function pedirPermissao(): Promise<NotificationPermission | "indisponivel"> {
  if (typeof window === "undefined" || !("Notification" in window)) return "indisponivel";
  return Notification.requestPermission();
}

export function notificar(titulo: string, corpo: string) {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  new Notification(titulo, { body: corpo, icon: "/favicon.ico", lang: "pt-BR" });
}

const CHAVE = "consultas.avisados";

/** Mostra uma notificação do aparelho uma única vez por consulta próxima. */
export function useLembretesNavegador(lista: Consulta[], horas: number, ativo: boolean) {
  const proximas = useMemo(() => consultasProximas(lista, horas), [lista, horas]);
  useEffect(() => {
    if (!ativo || proximas.length === 0) return;
    const ja: string[] = JSON.parse(localStorage.getItem(CHAVE) || "[]");
    const novos = proximas.filter((c) => !ja.includes(c.id));
    novos.forEach((c) => notificar("Lembrete de consulta", textoLembrete(c)));
    if (novos.length) localStorage.setItem(CHAVE, JSON.stringify([...ja, ...novos.map((c) => c.id)]));
  }, [proximas, ativo]);
  return proximas;
}
