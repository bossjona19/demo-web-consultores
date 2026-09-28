import { ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import { useState } from 'react';
import { formatearFecha, type Dia } from '../../lib/agenda';

/**
 * Calendario por semana: días en columnas, horas en filas.
 * En celular no cabe, así que ahí se muestra un día a la vez: el panel
 * se usa más desde el teléfono que desde la computadora.
 */
export function CalendarioSemana({
  dias,
  onAlternarHora,
  onAlternarDia,
}: {
  dias: Dia[];
  onAlternarHora: (fecha: string, hora: string) => void;
  onAlternarDia: (fecha: string, cerrar: boolean) => void;
}) {
  const [semana, setSemana] = useState(0);
  const [diaMovil, setDiaMovil] = useState(0);

  const visibles = dias.slice(semana * 7, semana * 7 + 7);
  const horas = [...new Set(visibles.flatMap((d) => d.turnos.map((t) => t.hora)))].sort();
  const actual = visibles[Math.min(diaMovil, visibles.length - 1)];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <button
          type="button"
          className="btn-ghost px-3 py-2"
          disabled={semana === 0}
          onClick={() => {
            setSemana((s) => Math.max(0, s - 1));
            setDiaMovil(0);
          }}
        >
          <ChevronLeft className="size-4" aria-hidden />
          Anterior
        </button>
        <p className="text-sm font-medium">
          {semana === 0 ? 'Esta semana' : `Semana ${semana + 1}`}
        </p>
        <button
          type="button"
          className="btn-ghost px-3 py-2"
          disabled={(semana + 1) * 7 >= dias.length}
          onClick={() => {
            setSemana((s) => s + 1);
            setDiaMovil(0);
          }}
        >
          Siguiente
          <ChevronRight className="size-4" aria-hidden />
        </button>
      </div>

      {/* Celular: un día a la vez */}
      <div className="md:hidden">
        <div className="mb-3 flex items-center justify-between gap-2">
          <button
            type="button"
            className="btn-ghost px-3 py-2"
            disabled={diaMovil === 0}
            onClick={() => setDiaMovil((d) => Math.max(0, d - 1))}
            aria-label="Día anterior"
          >
            <ChevronLeft className="size-4" aria-hidden />
          </button>
          <p className="font-display text-lg font-semibold capitalize">{actual && formatearFecha(actual.fecha)}</p>
          <button
            type="button"
            className="btn-ghost px-3 py-2"
            disabled={diaMovil >= visibles.length - 1}
            onClick={() => setDiaMovil((d) => Math.min(visibles.length - 1, d + 1))}
            aria-label="Día siguiente"
          >
            <ChevronRight className="size-4" aria-hidden />
          </button>
        </div>

        {actual && (
          <>
            <button type="button" className="btn-ghost mb-3 w-full" onClick={() => onAlternarDia(actual.fecha, !actual.cerrado)}>
              {actual.cerrado ? 'Abrir el día' : 'Cerrar el día'}
            </button>
            <div className="space-y-2">
              {actual.turnos.length === 0 && <p className="text-sm text-muted">Sin horarios. Toca "Abrir el día".</p>}
              {actual.turnos.map((t) => (
                <Celda key={t.hora} turno={t} fecha={actual.fecha} onAlternar={onAlternarHora} ancho />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Pantalla grande: la semana completa */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full border-separate border-spacing-1">
          <thead>
            <tr>
              <th className="w-16" />
              {visibles.map((d) => (
                <th key={d.fecha} className="align-top">
                  <p className="text-xs text-muted capitalize">{d.diaLetra}</p>
                  <p className="font-display text-lg font-semibold">{d.diaNumero}</p>
                  <button
                    type="button"
                    className="mt-1 text-[11px] font-medium text-accent hover:underline"
                    onClick={() => onAlternarDia(d.fecha, !d.cerrado)}
                  >
                    {d.cerrado ? 'Abrir' : 'Cerrar'}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {horas.map((hora) => (
              <tr key={hora}>
                <td className="pr-1 text-right align-middle text-xs text-muted">{hora}</td>
                {visibles.map((d) => {
                  const turno = d.turnos.find((t) => t.hora === hora);
                  return (
                    <td key={d.fecha + hora} className="align-top">
                      {turno ? (
                        <Celda turno={turno} fecha={d.fecha} onAlternar={onAlternarHora} />
                      ) : (
                        <div className="h-12 rounded-lg border border-dashed border-line/60" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 text-sm text-muted">
          Toca una hora libre para cerrarla, o una cerrada para abrirla. Las horas con cita no se pueden cerrar.
        </p>
      </div>
    </div>
  );
}

function Celda({
  turno,
  fecha,
  onAlternar,
  ancho = false,
}: {
  turno: { hora: string; rango: string; estado: string; reserva?: { nombre: string; empresa: string } };
  fecha: string;
  onAlternar: (fecha: string, hora: string) => void;
  ancho?: boolean;
}) {
  const base = `flex h-12 ${ancho ? 'w-full' : ''} flex-col justify-center rounded-lg border px-2 text-left text-xs transition`;

  if (turno.estado === 'ocupado') {
    return (
      <div className={`${base} border-accent bg-accent-soft`} title={turno.reserva?.nombre}>
        <span className="font-semibold">{ancho ? turno.rango : turno.reserva?.nombre?.split(' ')[0]}</span>
        <span className="truncate text-muted">{ancho ? turno.reserva?.nombre : turno.reserva?.empresa}</span>
      </div>
    );
  }

  const cerrado = turno.estado === 'cerrado';
  return (
    <button
      type="button"
      onClick={() => onAlternar(fecha, turno.hora)}
      className={`${base} ${
        cerrado ? 'border-line bg-line/30 text-muted' : 'border-line hover:border-ink/40'
      }`}
    >
      <span className="flex items-center gap-1 font-medium">
        {cerrado && <Lock className="size-3" aria-hidden />}
        {ancho ? turno.rango : turno.hora}
      </span>
      <span className="text-muted">{cerrado ? 'Cerrada' : 'Libre'}</span>
    </button>
  );
}
