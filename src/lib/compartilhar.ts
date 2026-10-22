import type { Consulta } from '@/lib/consultas';

/** DDD brasileiro sem país recebe 55; números internacionais devem incluir o país. */
export function normalizarCelular(valor: string): string | null {
  const digitos = valor.replace(/\D/g, '');
  if (/^\+/.test(valor.trim())) return /^[1-9]\d{9,14}$/.test(digitos) ? digitos : null;
  if (/^[1-9]\d{9,10}$/.test(digitos)) return `55${digitos}`;
  return /^[1-9]\d{11,14}$/.test(digitos) ? digitos : null;
}

/** Horários sem Z conservam a hora local no fuso escolhido no Google. */
export function linkGoogleAgenda(c: Consulta, fuso = 'America/Sao_Paulo'): string {
  const [hora = 0, minuto = 0] = c.hora.split(':').map(Number);
  const inicio = new Date(`${c.data}T12:00:00Z`);
  inicio.setUTCHours(hora, minuto, 0, 0);
  const fim = new Date(inicio.getTime() + 60 * 60_000);
  const compacto = (d: Date) => d.toISOString().slice(0, 19).replace(/[-:]/g, '');
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `Consulta: ${c.especialidade} — ${c.profissional}`,
    dates: `${compacto(inicio)}/${compacto(fim)}`,
    ctz: fuso,
    location: c.local,
    details: `ConsultaFácil\nProfissional: ${c.profissional}\nEspecialidade: ${c.especialidade}${c.exigencias ? `\nO que levar / preparo: ${c.exigencias}` : ''}`,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

export function linkAcompanhante(c: Consulta, telefone: string, acompanhante: string, paciente: string): string | null {
  const numero = normalizarCelular(telefone);
  if (!numero) return null;
  const [ano, mes, dia] = c.data.split('-');
  const mensagem = `Olá${acompanhante.trim() ? `, ${acompanhante.trim()}` : ''}! ${paciente.trim() ? `Sou ${paciente.trim()}. ` : ''}Compartilho minha consulta pelo ConsultaFácil:\n${c.especialidade} com ${c.profissional}\nData: ${dia}/${mes}/${ano} às ${c.hora.slice(0, 5)}\nLocal: ${c.local}${c.exigencias ? `\nO que levar / preparo: ${c.exigencias}` : ''}\nVocê pode me acompanhar?`;
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
}