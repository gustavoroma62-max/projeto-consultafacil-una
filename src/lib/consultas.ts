import { useCallback, useEffect, useState } from "react";

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
};

export type Situacao = "atrasada" | "hoje" | "futura" | Status;

const STORAGE_KEY = "consultas.db";

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

export function seed(): Consulta[] {
  return [
    {
      id: "1",
      profissional: "Dra. Mariana Costa",
      especialidade: "Cardiologista",
      data: deslocar(-2),
      hora: "09:00",
      local: "Clínica Aurora — Sala 3",
      exigencias: "Levar exame de sangue e eletrocardiograma",
      status: "agendada",
    },
    {
      id: "2",
      profissional: "Dr. Carlos Nunes",
      especialidade: "Dentista",
      data: deslocar(0),
      hora: "14:30",
      local: "Odonto Vida — Av. Paulista, 1200",
      exigencias: "Não escovar com flúor antes",
      status: "agendada",
    },
    {
      id: "3",
      profissional: "Dra. Beatriz Souza",
      especialidade: "Endocrinologista",
      data: deslocar(3),
      hora: "11:30",
      local: "Hospital Santa Luzia",
      exigencias: "Jejum de 12 horas",
      status: "agendada",
    },
    {
      id: "4",
      profissional: "Rafael Lima",
      especialidade: "Psicólogo",
      data: deslocar(6),
      hora: "08:00",
      local: "Atendimento online",
      exigencias: "",
      status: "agendada",
    },
    {
      id: "5",
      profissional: "Dra. Fernanda Rocha",
      especialidade: "Dermatologista",
      data: deslocar(-10),
      hora: "15:00",
      local: "Clínica Derma+",
      exigencias: "Sem maquiagem",
      status: "realizada",
    },
    {
      id: "6",
      profissional: "Dr. Lucas Martins",
      especialidade: "Ortopedista",
      data: deslocar(-20),
      hora: "16:30",
      local: "Instituto do Movimento",
      exigencias: "Levar raio-x do joelho",
      status: "cancelada",
    },
  ];
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

export function useConsultas() {
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    try {
      const bruto = localStorage.getItem(STORAGE_KEY);
      setConsultas(bruto ? (JSON.parse(bruto) as Consulta[]) : seed());
    } catch {
      setConsultas(seed());
    }
    setCarregado(true);
  }, []);

  useEffect(() => {
    if (!carregado) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consultas));
  }, [consultas, carregado]);

  const criar = useCallback((dados: Omit<Consulta, "id" | "status">) => {
    setConsultas((atual) => [
      ...atual,
      { ...dados, id: crypto.randomUUID(), status: "agendada" },
    ]);
  }, []);

  const atualizar = useCallback((id: string, dados: Partial<Consulta>) => {
    setConsultas((atual) => atual.map((c) => (c.id === id ? { ...c, ...dados } : c)));
  }, []);

  const excluir = useCallback((id: string) => {
    setConsultas((atual) => atual.filter((c) => c.id !== id));
  }, []);

  const restaurar = useCallback(() => setConsultas(seed()), []);

  return { consultas, carregado, criar, atualizar, excluir, restaurar };
}
