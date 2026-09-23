import { CalendarCheck } from 'lucide-react';
import { useMemo, useState } from 'react';
import { formatearFecha, proximosDias, reservar } from '../lib/agenda';

type Confirmada = { fecha: string; hora: string; nombre: string };

/**
 * Agenda + formulario de diagnóstico.
 * Vive en su propia página (/diagnostico) para poder compartir ese enlace solo.
 */
export function Agenda({ variante = 'pagina' }: { variante?: 'pagina' | 'seccion' }) {
  // Se calcula una vez por visita: los días libres dependen de lo ya reservado.
  const [dias, setDias] = useState(() => proximosDias());
  const [diaActivo, setDiaActivo] = useState(dias[0]?.fecha ?? '');
  const [hora, setHora] = useState('');
  const [error, setError] = useState('');
  const [confirmada, setConfirmada] = useState<Confirmada | null>(null);

  const dia = useMemo(() => dias.find((d) => d.fecha === diaActivo), [dias, diaActivo]);

  function enviar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setError('');

    if (!hora) {
      setError('Elige un horario antes de continuar.');
      return;
    }

    const datos = new FormData(evento.currentTarget);
    const reserva = reservar({
      fecha: diaActivo,
      hora,
      nombre: String(datos.get('nombre') ?? ''),
      email: String(datos.get('email') ?? ''),
      empresa: String(datos.get('empresa') ?? ''),
      reto: String(datos.get('reto') ?? ''),
    });

    if (!reserva) {
      // Alguien tomó ese horario mientras llenaba el formulario.
      setError('Ese horario acaba de ocuparse. Elige otro, por favor.');
      setDias(proximosDias());
      setHora('');
      return;
    }

    setConfirmada({ fecha: reserva.fecha, hora: reserva.hora, nombre: reserva.nombre });
  }

  return (
    <div className={`rounded-2xl border border-line bg-panel p-6 sm:p-8 ${variante === 'seccion' ? 'shadow-sm' : ''}`}>
      {confirmada ? (
        <div>
          <div className="mb-4 grid size-12 place-items-center rounded-full bg-accent-soft">
            <CalendarCheck className="size-6 text-accent" aria-hidden />
          </div>
          <h2 className="font-display text-2xl font-semibold">Listo, {confirmada.nombre.split(' ')[0]}</h2>
          <p className="mt-3 text-muted text-pretty">
            Tu llamada quedó para el <strong className="text-ink">{formatearFecha(confirmada.fecha)}</strong> a las{' '}
            <strong className="text-ink">{confirmada.hora}</strong>. Te llega la invitación al correo.
          </p>
          <button
            type="button"
            className="btn-ghost mt-6"
            onClick={() => {
              setConfirmada(null);
              setDias(proximosDias());
              setHora('');
            }}
          >
            Agendar otra
          </button>
        </div>
      ) : (
        <form onSubmit={enviar}>
          <fieldset>
            <legend className="label">1. Elige el día</legend>
            <div className="flex flex-wrap gap-2">
              {dias.map((d) => {
                const activo = d.fecha === diaActivo;
                return (
                  <button
                    key={d.fecha}
                    type="button"
                    aria-pressed={activo}
                    onClick={() => {
                      setDiaActivo(d.fecha);
                      setHora('');
                    }}
                    className={`rounded-xl border px-3.5 py-2 text-sm font-medium transition ${
                      activo ? 'border-ink bg-ink text-paper' : 'border-line hover:border-ink/40'
                    }`}
                  >
                    {d.etiqueta}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="mt-6">
            <legend className="label">2. Elige la hora</legend>
            <div className="grid grid-cols-3 gap-2">
              {dia?.horas.map((h) => (
                <button
                  key={h.hora}
                  type="button"
                  disabled={!h.libre}
                  aria-pressed={hora === h.hora}
                  onClick={() => setHora(h.hora)}
                  className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${
                    hora === h.hora ? 'border-ink bg-ink text-paper' : 'border-line hover:border-ink/40'
                  } disabled:cursor-not-allowed disabled:border-line disabled:bg-paper disabled:text-muted/50 disabled:line-through`}
                >
                  {h.hora}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-6">
            <legend className="label">3. Tus datos</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <input name="nombre" required placeholder="Nombre y apellido" className="field" autoComplete="name" />
              <input name="email" type="email" required placeholder="Correo" className="field" autoComplete="email" />
              <input
                name="empresa"
                required
                placeholder="Empresa"
                className="field sm:col-span-2"
                autoComplete="organization"
              />
              <textarea
                name="reto"
                required
                rows={3}
                placeholder="¿Qué te está costando más hoy?"
                className="field sm:col-span-2"
              />
            </div>
          </fieldset>

          {error && (
            <p role="alert" className="mt-4 rounded-xl bg-accent-soft px-4 py-3 text-sm font-medium">
              {error}
            </p>
          )}

          <button type="submit" className="btn-primary mt-6 w-full">
            Confirmar mi llamada
          </button>
          <p className="mt-3 text-center text-xs text-muted">
            Tus datos se usan solo para esta llamada. Nada de listas de correo.
          </p>
        </form>
      )}
    </div>
  );
}
