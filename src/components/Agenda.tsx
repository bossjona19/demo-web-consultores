import { ArrowRight, CalendarCheck, Lock } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import {
  esManana,
  formatearFecha,
  proximoDiaLibre,
  proximosDias,
  reservar,
  type Dia,
  type Turno,
} from '../lib/agenda';

type Confirmada = { fecha: string; hora: string; rango: string; nombre: string };

/**
 * Agenda + formulario de diagnóstico.
 * Vive en su propia página (/diagnostico) para poder compartir ese enlace solo.
 */
export function Agenda() {
  // Se calcula una vez por visita: los turnos dependen del horario y de lo ya reservado.
  const [dias, setDias] = useState(() => proximosDias());
  const [diaActivo, setDiaActivo] = useState(() => proximosDias().find((d) => !d.cerrado)?.fecha ?? '');
  const [hora, setHora] = useState('');
  const [error, setError] = useState('');
  const [confirmada, setConfirmada] = useState<Confirmada | null>(null);
  const tira = useRef<HTMLDivElement>(null);

  const dia = useMemo(() => dias.find((d) => d.fecha === diaActivo), [dias, diaActivo]);
  const siguiente = useMemo(() => proximoDiaLibre(dias, diaActivo), [dias, diaActivo]);

  const manana = dia?.turnos.filter((t) => esManana(t.hora)) ?? [];
  const tarde = dia?.turnos.filter((t) => !esManana(t.hora)) ?? [];

  function recargar() {
    const frescos = proximosDias();
    setDias(frescos);
    return frescos;
  }

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
      setError('Alguien acaba de tomar esa hora. Elige otra, por favor.');
      recargar();
      setHora('');
      return;
    }

    const turno = dia?.turnos.find((t) => t.hora === reserva.hora);
    setConfirmada({ fecha: reserva.fecha, hora: reserva.hora, rango: turno?.rango ?? reserva.hora, nombre: reserva.nombre });
    recargar();
  }

  if (confirmada) {
    return (
      <div className="card">
        <div className="mb-4 grid size-12 place-items-center rounded-full bg-accent-soft">
          <CalendarCheck className="size-6 text-accent" aria-hidden />
        </div>
        <h2 className="font-display text-2xl font-semibold">Listo, {confirmada.nombre.split(' ')[0]}</h2>
        <p className="mt-3 text-muted text-pretty">
          Tu llamada quedó para el <strong className="text-ink">{formatearFecha(confirmada.fecha)}</strong> de{' '}
          <strong className="text-ink">{confirmada.rango}</strong>, por videollamada.
        </p>
        <p className="mt-2 text-sm text-muted">Te confirmamos por WhatsApp y te llega la invitación al correo.</p>
        <button
          type="button"
          className="btn-ghost mt-6"
          onClick={() => {
            setConfirmada(null);
            recargar();
            setHora('');
          }}
        >
          Agendar otra
        </button>
      </div>
    );
  }

  return (
    <div className="card">
      <form onSubmit={enviar}>
        <fieldset>
          <legend className="label">1. Elige el día</legend>
          <div ref={tira} className="-mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-2">
            {dias.map((d) => (
              <BotonDia
                key={d.fecha}
                dia={d}
                activo={d.fecha === diaActivo}
                onClick={() => {
                  setDiaActivo(d.fecha);
                  setHora('');
                }}
              />
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-6">
          <legend className="label">2. Elige la hora</legend>

          {dia?.cerrado ? (
            <div className="rounded-xl border border-dashed border-line px-4 py-5 text-center">
              <p className="font-medium">Este día no tiene horarios disponibles.</p>
              {siguiente && (
                <button
                  type="button"
                  className="btn-ghost mt-3"
                  onClick={() => {
                    setDiaActivo(siguiente.fecha);
                    setHora('');
                  }}
                >
                  Ir al {formatearFecha(siguiente.fecha)}
                  <ArrowRight className="size-4" aria-hidden />
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <GrupoHoras titulo="Mañana" turnos={manana} elegida={hora} onElegir={setHora} />
              <GrupoHoras titulo="Tarde" turnos={tarde} elegida={hora} onElegir={setHora} />
            </div>
          )}
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
    </div>
  );
}

/** Un día de la tira. El punto de abajo dice de un vistazo cómo está. */
function BotonDia({ dia, activo, onClick }: { dia: Dia; activo: boolean; onClick: () => void }) {
  const pocos = dia.libres > 0 && dia.libres <= 2;

  return (
    <button
      type="button"
      disabled={dia.cerrado}
      aria-pressed={activo}
      onClick={onClick}
      className={`flex w-14 shrink-0 snap-start flex-col items-center gap-0.5 rounded-xl border px-2 py-2 transition ${
        activo ? 'border-ink bg-ink text-paper' : 'border-line hover:border-ink/40'
      } disabled:cursor-not-allowed disabled:border-line disabled:bg-paper disabled:text-muted/40`}
    >
      <span className="text-xs font-medium capitalize">{dia.diaLetra}</span>
      <span className="font-display text-lg font-semibold">{dia.diaNumero}</span>
      <span
        aria-hidden
        className={`mt-0.5 size-1.5 rounded-full border ${
          dia.cerrado
            ? 'border-transparent'
            : pocos
              ? activo
                ? 'border-paper'
                : 'border-accent'
              : activo
                ? 'border-paper bg-paper'
                : 'border-accent bg-accent'
        }`}
      />
    </button>
  );
}

function GrupoHoras({
  titulo,
  turnos,
  elegida,
  onElegir,
}: {
  titulo: string;
  turnos: Turno[];
  elegida: string;
  onElegir: (hora: string) => void;
}) {
  if (!turnos.length) return null;

  return (
    <div>
      <p className="mb-2 text-xs font-semibold tracking-wide text-muted uppercase">{titulo}</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {turnos.map((t) => (
          <button
            key={t.hora}
            type="button"
            disabled={t.estado !== 'libre'}
            aria-pressed={elegida === t.hora}
            onClick={() => onElegir(t.hora)}
            className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-medium transition ${
              elegida === t.hora ? 'border-ink bg-ink text-paper' : 'border-line hover:border-ink/40'
            } disabled:cursor-not-allowed disabled:border-line disabled:bg-paper disabled:text-muted/50 ${
              t.estado === 'ocupado' ? 'disabled:line-through' : ''
            }`}
          >
            {t.estado === 'cerrado' && <Lock className="size-3.5" aria-hidden />}
            {t.rango}
          </button>
        ))}
      </div>
    </div>
  );
}
