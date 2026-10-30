import { useState } from "react";
import { TIPOS, type Consulta, type Status, type Tipo } from "@/lib/consultas";

export type ConsultaFormValues = Omit<Consulta, "id">;

const vazio: ConsultaFormValues = {
  profissional: "",
  especialidade: "",
  data: "",
  hora: "",
  local: "",
  exigencias: "",
  status: "agendada",
  tipo: "consulta",
};

export function ConsultaForm({
  inicial,
  onSubmit,
  onCancel,
  titulo,
}: {
  inicial?: ConsultaFormValues;
  onSubmit: (valores: ConsultaFormValues) => void;
  onCancel: () => void;
  titulo: string;
}) {
  const [v, setV] = useState<ConsultaFormValues>(inicial ?? vazio);

  const campo =
    "w-full rounded-xl border border-ink/10 bg-paper px-3 py-2.5 text-sm text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20";
  const rotulo = "mb-1.5 block text-sm font-semibold uppercase tracking-wide text-muted-ink";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(v);
      }}
      className="overflow-hidden rounded-2xl bg-card-paper ring-1 ring-ink/5"
    >
      <div className="flex items-center gap-2 border-b border-ink/5 px-6 py-4">
        <span className="h-4 w-1.5 rounded-full bg-amber" />
        <h2 className="font-display text-lg font-semibold">{titulo}</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
        <fieldset className="sm:col-span-2">
          <legend className={rotulo}>Tipo de compromisso</legend>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(TIPOS) as Tipo[]).map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={v.tipo === t}
                onClick={() => setV({ ...v, tipo: t })}
                className="min-h-12 rounded-full px-2 text-base font-semibold ring-1 ring-ink/15 transition hover:bg-ink/5 aria-pressed:bg-brand-soft aria-pressed:text-brand-dark aria-pressed:ring-brand"
              >
                {v.tipo === t && <span aria-hidden>✓ </span>}
                {TIPOS[t]}
              </button>
            ))}
          </div>
        </fieldset>
        <div className="sm:col-span-2">
          <label className={rotulo} htmlFor="profissional">
            Profissional
          </label>
          <input
            id="profissional"
            required
            className={campo}
            placeholder="Ex.: Dra. Mariana Costa"
            value={v.profissional}
            onChange={(e) => setV({ ...v, profissional: e.target.value })}
          />
        </div>

        <div>
          <label className={rotulo} htmlFor="especialidade">
            Especialidade
          </label>
          <input
            id="especialidade"
            required
            className={campo}
            placeholder="Cardiologista, Dentista…"
            value={v.especialidade}
            onChange={(e) => setV({ ...v, especialidade: e.target.value })}
          />
        </div>

        <div>
          <label className={rotulo} htmlFor="status">
            Status
          </label>
          <select
            id="status"
            className={campo}
            value={v.status}
            onChange={(e) => setV({ ...v, status: e.target.value as Status })}
          >
            <option value="agendada">Agendada</option>
            <option value="realizada">Realizada</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>

        <div>
          <label className={rotulo} htmlFor="data">
            Data
          </label>
          <input
            id="data"
            type="date"
            required
            className={campo}
            value={v.data}
            onChange={(e) => setV({ ...v, data: e.target.value })}
          />
        </div>

        <div>
          <label className={rotulo} htmlFor="hora">
            Hora
          </label>
          <input
            id="hora"
            type="time"
            required
            className={campo}
            value={v.hora}
            onChange={(e) => setV({ ...v, hora: e.target.value })}
          />
        </div>

        <div className="sm:col-span-2">
          <label className={rotulo} htmlFor="local">
            Local
          </label>
          <input
            id="local"
            required
            className={campo}
            placeholder="Clínica, endereço ou 'Atendimento online'"
            value={v.local}
            onChange={(e) => setV({ ...v, local: e.target.value })}
          />
        </div>

        <div className="sm:col-span-2">
          <label className={rotulo} htmlFor="exigencias">
            Exigências
          </label>
          <textarea
            id="exigencias"
            rows={3}
            className={campo}
            placeholder="Jejum, levar exames, levar documento…"
            value={v.exigencias}
            onChange={(e) => setV({ ...v, exigencias: e.target.value })}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 border-t border-ink/5 px-6 py-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full px-4 py-2.5 text-sm font-semibold text-muted-ink ring-1 ring-ink/10 transition hover:bg-ink/5"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-card-paper ring-1 ring-brand-dark/30 transition hover:bg-brand-dark"
        >
          Salvar consulta
        </button>
      </div>
    </form>
  );
}
