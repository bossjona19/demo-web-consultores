import { NOMBRES_DIA, type DiaSemana, type Horario } from '../../lib/horarios';

/**
 * Horario base: qué días trabaja y de qué hora a qué hora.
 *
 * Los siete días salen SIEMPRE, incluso los apagados. Si un día cerrado
 * desaparece de esta lista, el dueño no tiene forma de volver a abrirlo;
 * ese error ya lo vimos en otro sistema y aquí no se repite.
 */
export function HorarioSemanal({
  horario,
  onCambiar,
}: {
  horario: Horario;
  onCambiar: (horario: Horario) => void;
}) {
  const dias = [1, 2, 3, 4, 5, 6, 0] as DiaSemana[]; // la semana arranca en lunes

  function actualizar(dia: DiaSemana, cambios: Partial<Horario['semana'][DiaSemana]>) {
    onCambiar({
      ...horario,
      semana: { ...horario.semana, [dia]: { ...horario.semana[dia], ...cambios } },
    });
  }

  return (
    <div>
      <div className="space-y-2">
        {dias.map((d) => {
          const dato = horario.semana[d];
          return (
            <div
              key={d}
              className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-panel px-4 py-3"
            >
              <label className="flex min-w-32 items-center gap-2 font-medium">
                <input
                  type="checkbox"
                  checked={dato.abierto}
                  onChange={(e) => actualizar(d, { abierto: e.target.checked })}
                  className="size-4 accent-[color:var(--color-ink)]"
                />
                {NOMBRES_DIA[d]}
              </label>

              {dato.abierto ? (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted">de</span>
                  <input
                    type="time"
                    value={dato.desde}
                    onChange={(e) => actualizar(d, { desde: e.target.value })}
                    className="field w-auto py-1.5"
                  />
                  <span className="text-muted">a</span>
                  <input
                    type="time"
                    value={dato.hasta}
                    onChange={(e) => actualizar(d, { hasta: e.target.value })}
                    className="field w-auto py-1.5"
                  />
                </div>
              ) : (
                <span className="text-sm text-muted">Cerrado. Actívalo para atender ese día.</span>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3 rounded-xl border border-line bg-panel px-4 py-3">
        <span className="font-medium">Duración de cada llamada</span>
        <select
          value={horario.duracion}
          onChange={(e) => onCambiar({ ...horario, duracion: Number(e.target.value) })}
          className="field w-auto py-1.5"
        >
          {[20, 30, 45, 60].map((m) => (
            <option key={m} value={m}>
              {m} minutos
            </option>
          ))}
        </select>
      </div>

      <p className="mt-3 text-sm text-muted">
        Esto es tu horario de siempre. Para cerrar un día o una hora suelta, usa el calendario.
      </p>
    </div>
  );
}
