import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { CalendarPlus, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePerfil } from '@/lib/perfil';
import type { Consulta } from '@/lib/consultas';
import { linkGoogleAgenda, linkAcompanhante } from '@/lib/compartilhar';

export function CompartilharConsulta({ consulta }: { consulta: Consulta }) {
  const { nome, avisos } = usePerfil();
  const [aviso, setAviso] = useState(false);
  const whatsapp = linkAcompanhante(consulta, avisos?.acompanhante_telefone ?? '', avisos?.acompanhante_nome ?? '', nome);
  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      <Button variant="outline" className="h-auto min-h-12 whitespace-normal text-base text-ink" asChild>
        <a href={linkGoogleAgenda(consulta)} target="_blank" rel="noopener noreferrer" onClick={(e) => {
          if (!window.confirm('Os dados desta consulta serão abertos no Google Agenda. Confira a conta, os avisos e salve o evento lá. Continuar?')) e.preventDefault();
          else e.currentTarget.href = linkGoogleAgenda(consulta, Intl.DateTimeFormat().resolvedOptions().timeZone);
        }}><CalendarPlus aria-hidden="true" />Google Agenda</a>
      </Button>
      {whatsapp ? (
        <Button variant="outline" className="h-auto min-h-12 whitespace-normal text-base text-ink" asChild>
          <a href={whatsapp} target="_blank" rel="noopener noreferrer" onClick={(e) => {
            if (!window.confirm('A mensagem contém os dados desta consulta. Ela será aberta no WhatsApp do acompanhante; você decide se envia. Continuar?')) e.preventDefault();
          }}><MessageCircle aria-hidden="true" />Avisar acompanhante</a>
        </Button>
      ) : <Button variant="outline" className="h-auto min-h-12 whitespace-normal text-base text-ink" onClick={() => setAviso(true)}><MessageCircle aria-hidden="true" />Avisar acompanhante</Button>}
      {aviso && <p role="status" className="w-full text-base">Cadastre o celular do acompanhante em <Link to="/avisos" className="font-semibold text-brand-dark underline">Avisos</Link>.</p>}
    </div>
  );
}