import { describe, expect, it } from 'vitest';
import { linkAcompanhante, linkGoogleAgenda, normalizarCelular } from './compartilhar';
const consulta = { id: 'test', profissional: 'Ana & Silva', especialidade: 'Clínica', data: '2026-12-31', hora: '23:30:00', local: 'Rua A, 20', exigencias: 'Documento', status: 'agendada' as const, tipo: 'consulta' as const };
describe('compartilhar consulta', () => {
  it('preserva data, horário e local no evento e vira o dia no término', () => {
    const url = new URL(linkGoogleAgenda(consulta));
    expect(url.searchParams.get('dates')).toBe('20261231T233000/20270101T003000');
    expect(url.searchParams.get('ctz')).toBe('America/Sao_Paulo');
    expect(url.searchParams.get('location')).toBe('Rua A, 20');
  });
  it('abre a conversa do acompanhante com os dados da consulta sem enviar automaticamente', () => {
    const url = new URL(linkAcompanhante(consulta, '(11) 91234-5678', 'Maria', 'José') ?? '');
    expect(url.origin).toBe('https://wa.me');
    expect(url.pathname).toBe('/5511912345678');
    expect(url.searchParams.get('text')).toContain('31/12/2026 às 23:30');
    expect(url.searchParams.get('text')).toContain('Maria');
    expect(url.searchParams.get('text')).toContain('Rua A, 20');
    expect(url.searchParams.get('text')).not.toContain('Clínica');
    expect(url.searchParams.get('text')).not.toContain('Documento');
  });
  it('recusa celular incompleto e conserva código internacional', () => {
    expect(normalizarCelular('123')).toBeNull();
    expect(normalizarCelular('+351 912345678')).toBe('351912345678');
  });
});