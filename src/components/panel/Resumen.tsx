import type { Dia } from '../../lib/agenda';

/**
 * Tres números, nada más. Un consultor no necesita que le llevemos las finanzas;
 * necesita saber cómo viene su semana de un vistazo.
 */
export function Resumen({ dias }: { dias: Dia[] }) {
  const semana = dias.slice(0, 7);
  const citas = semana.reduce((n, d) => n + d.turnos.filter((t) => t.estado === 'ocupado').length, 0);
  const libres = semana.reduce((n, d) => n + d.libres, 0);
  const cerradas = semana.reduce((n, d) => n + d.turnos.filter((t) => t.estado === 'cerrado').length, 0);

  const tarjetas = [
    { etiqueta: 'Citas agendadas', valor: citas },
    { etiqueta: 'Horas libres', valor: libres },
    { etiqueta: 'Horas cerradas', valor: cerradas },
  ];

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-3">
        {tarjetas.map((t) => (
          <div key={t.etiqueta} className="card">
            <p className="text-sm text-muted">{t.etiqueta}</p>
            <p className="font-display text-4xl font-semibold">{t.valor}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm text-muted">Los próximos 7 días.</p>
    </div>
  );
}
