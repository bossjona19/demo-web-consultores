import { MessageCircle } from 'lucide-react';
import { formatearFecha, type Dia } from '../../lib/agenda';
import { consultora } from '../../site';

/**
 * Las citas que vienen, con lo que la persona escribió.
 * El botón de WhatsApp abre el chat con el mensaje escrito: confirmar una cita
 * no debería costar más de un toque.
 */
export function ListaCitas({ dias }: { dias: Dia[] }) {
  const citas = dias.flatMap((d) =>
    d.turnos.filter((t) => t.estado === 'ocupado' && t.reserva).map((t) => ({ dia: d, turno: t })),
  );

  if (!citas.length) {
    return (
      <div className="card text-center">
        <p className="font-display text-xl font-semibold">Todavía no hay citas</p>
        <p className="mt-2 text-muted">Cuando alguien reserve desde tu página, aparece aquí con lo que escribió.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {citas.map(({ dia, turno }) => {
        const r = turno.reserva!;
        const mensaje = `Hola ${r.nombre.split(' ')[0]}, te confirmo nuestra llamada del ${formatearFecha(dia.fecha)} de ${turno.rango}. Nos vemos.`;
        const enlace = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;

        return (
          <article key={dia.fecha + turno.hora} className="card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-display text-lg font-semibold capitalize">{formatearFecha(dia.fecha)}</p>
                <p className="text-sm text-accent">{turno.rango}</p>
              </div>
              <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold tracking-wide uppercase">
                Pendiente
              </span>
            </div>

            <dl className="mt-4 grid gap-1 text-sm">
              <div className="flex gap-2">
                <dt className="text-muted">Quién:</dt>
                <dd className="font-medium">{r.nombre}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-muted">Empresa:</dt>
                <dd>{r.empresa}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-muted">Correo:</dt>
                <dd>{r.email}</dd>
              </div>
            </dl>

            <p className="mt-3 rounded-xl bg-paper px-4 py-3 text-sm text-pretty">“{r.reto}”</p>

            <a href={enlace} target="_blank" rel="noreferrer" className="btn-ghost mt-4">
              <MessageCircle className="size-4" aria-hidden />
              Escribirle por WhatsApp
            </a>
            <p className="mt-2 text-xs text-muted">Se abre WhatsApp con el mensaje listo desde {consultora.whatsapp}.</p>
          </article>
        );
      })}
    </div>
  );
}
