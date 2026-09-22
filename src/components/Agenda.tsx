import { CalendarCheck, Clock } from 'lucide-react';
import { useMemo, useState } from 'react';
import { formatearFecha, proximosDias, reservar } from '../lib/agenda';
import { Reveal } from './Reveal';
import { consultora } from '../site';

type Confirmada = { fecha: string; hora: string; nombre: string };

export function Agenda() {
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
    <section id="agenda" className="border-b border-line bg-ink py-16 text-paper sm:py-24">
      <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <p className="mb-3 text-sm font-semibold tracking-widest text-accent uppercase">Agenda</p>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Reserva tu llamada de 30 minutos
          </h2>
          <p className="mt-4 text-lg text-paper/70 text-pretty">
            Elige el horario que te sirva y cuéntame en una línea qué te está costando más. Llego a la llamada con esa
            información leída.
          </p>

          <ul className="mt-8 space-y-3 text-paper/80">
            <li className="flex items-center gap-3">
              <Clock className="size-5 text-accent" aria-hidden /> 30 minutos, por videollamada
            </li>
            <li className="flex items-center gap-3">
              <CalendarCheck className="size-5 text-accent" aria-hidden /> Sin costo y sin compromiso
            </li>
          </ul>

          <p className="mt-8 text-sm text-paper/60">
            ¿Prefieres escribir? {consultora.email} · {consultora.whatsapp}
          </p>
        </div>

        <Reveal>
          <div className="rounded-2xl bg-panel p-6 text-ink sm:p-8">
            {confirmada ? (
              <div>
                <div className="mb-4 grid size-12 place-items-center rounded-full bg-accent-soft">
                  <CalendarCheck className="size-6 text-accent" aria-hidden />
                </div>
                <h3 className="font-display text-2xl font-semibold">Listo, {confirmada.nombre.split(' ')[0]}</h3>
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
              <form onSubmit={enviar} noValidate={false}>
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
        </Reveal>
      </div>
    </section>
  );
}
