import { CalendarDays, CalendarClock, Clock, Home, LayoutGrid, MessageCircle, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { formatearFecha, proximosDias, type Dia } from '../lib/agenda';
import {
  abrirDia,
  abrirHora,
  cerrarDia,
  cerrarHora,
  guardarHorario,
  leerHorario,
  NOMBRES_DIA,
  type DiaSemana,
  type Horario,
} from '../lib/horarios';
import { consultora } from '../site';

const PESTANAS = [
  { id: 'dashboard', texto: 'Dashboard', icono: LayoutGrid },
  { id: 'calendario', texto: 'Calendario', icono: CalendarDays },
  { id: 'horarios', texto: 'Horarios', icono: Clock },
  { id: 'citas', texto: 'Citas', icono: CalendarClock },
] as const;

type Pestana = (typeof PESTANAS)[number]['id'];

/**
 * Panel del consultor, con el mismo diseño del admin de Agenda YA:
 * cabecera, pestañas, tarjetas de indicadores, calendario mensual,
 * cuadrícula de horarios y tabla de citas.
 *
 * Fuera quedaron servicios, equipo y estadísticas: un consultor no cobra
 * por servicio ni tiene equipo, así que esas pantallas solo estorbarían.
 */
export function Panel() {
  const [pestana, setPestana] = useState<Pestana>('dashboard');
  const [horario, setHorario] = useState<Horario>(() => leerHorario());
  const [dias, setDias] = useState(() => proximosDias(30));

  const hoy = new Date().toLocaleDateString('es-PA', { weekday: 'long', day: 'numeric', month: 'long' });

  function aplicar(nuevo: Horario) {
    guardarHorario(nuevo);
    setHorario(nuevo);
    setDias(proximosDias(30, nuevo));
  }

  return (
    <div className="min-h-screen bg-paper">
      <header className="admin-header">
        <div>
          <div className="ah-title">Panel de {consultora.nombre.split(' ')[0]}</div>
          <div className="ah-date">{hoy}</div>
        </div>
        <div className="ah-actions">
          <Link to="/diagnostico" className="ah-btn">
            <CalendarClock className="size-4" aria-hidden /> Mi página de citas
          </Link>
          <Link to="/" className="ah-btn">
            <Home className="size-4" aria-hidden /> Sitio
          </Link>
        </div>
      </header>

      <div className="panel-content">
        <div className="demo-banner">
          <Users className="size-5 shrink-0 text-accent" aria-hidden />
          <div>
            <strong>Vista del dueño</strong>
            <p>En tu web real esta sección va protegida con acceso. Aquí está abierta para que la pruebes.</p>
          </div>
        </div>

        <div className="tab-nav">
          {PESTANAS.map(({ id, texto, icono: Icono }) => (
            <button
              key={id}
              type="button"
              className={`tab-btn ${pestana === id ? 'active' : ''}`}
              onClick={() => setPestana(id)}
            >
              <span className="mr-2 inline-flex align-middle">
                <Icono className="size-4" aria-hidden />
              </span>
              {texto}
            </button>
          ))}
        </div>

        <div className="tab-panel" key={pestana}>
          {pestana === 'dashboard' && <Dashboard dias={dias} />}
          {pestana === 'calendario' && <CalendarioMes dias={dias} />}
          {pestana === 'horarios' && (
            <Horarios
              dias={dias}
              horario={horario}
              onAplicar={aplicar}
            />
          )}
          {pestana === 'citas' && <Citas dias={dias} />}
        </div>
      </div>
    </div>
  );
}

/* ── Dashboard: cuatro números, sin gráficas ─────────────────── */
function Dashboard({ dias }: { dias: Dia[] }) {
  const citas = dias.flatMap((d) => d.turnos.filter((t) => t.estado === 'ocupado').map((t) => ({ d, t })));
  const semana = dias.slice(0, 7);
  const proxima = citas[0];

  const tarjetas = [
    { lbl: 'Citas de la semana', val: semana.reduce((n, d) => n + d.turnos.filter((t) => t.estado === 'ocupado').length, 0), sub: 'Próximos 7 días' },
    { lbl: 'Citas del mes', val: citas.length, sub: 'Próximos 30 días' },
    { lbl: 'Horas libres', val: semana.reduce((n, d) => n + d.libres, 0), sub: 'Esta semana' },
    {
      lbl: 'Próxima cita',
      val: proxima ? proxima.t.hora : '—',
      sub: proxima ? `${formatearFecha(proxima.d.fecha)} · ${proxima.t.reserva?.nombre}` : 'Sin citas agendadas',
    },
  ];

  return (
    <div className="kpi-grid">
      {tarjetas.map((t, i) => (
        <div key={t.lbl} className={`kpi-card ${i % 2 ? 'tinta' : ''}`}>
          <div className="kpi-icon-wrap">
            <CalendarClock className="size-5" aria-hidden />
          </div>
          <div className="kpi-lbl">{t.lbl}</div>
          <div className="kpi-val">{t.val}</div>
          <div className="kpi-sub">{t.sub}</div>
        </div>
      ))}
    </div>
  );
}

/* ── Calendario mensual, igual al del salón ──────────────────── */
function CalendarioMes({ dias }: { dias: Dia[] }) {
  const [mes, setMes] = useState(() => new Date());

  const celdas = useMemo(() => {
    const primero = new Date(mes.getFullYear(), mes.getMonth(), 1);
    const arranque = new Date(primero);
    arranque.setDate(1 - ((primero.getDay() + 6) % 7)); // la semana arranca el lunes
    return Array.from({ length: 42 }, (_, i) => {
      const f = new Date(arranque);
      f.setDate(arranque.getDate() + i);
      return f;
    });
  }, [mes]);

  const aISO = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const hoy = aISO(new Date());

  return (
    <div className="panel-card">
      <div className="card-head">
        <div className="flex items-center gap-3">
          <button type="button" className="hz-btn" onClick={() => setMes(new Date(mes.getFullYear(), mes.getMonth() - 1, 1))}>
            ‹
          </button>
          <h2 className="card-title min-w-48 text-center capitalize">
            {mes.toLocaleDateString('es-PA', { month: 'long', year: 'numeric' })}
          </h2>
          <button type="button" className="hz-btn" onClick={() => setMes(new Date(mes.getFullYear(), mes.getMonth() + 1, 1))}>
            ›
          </button>
        </div>
        <span className="flex items-center gap-2 text-xs text-muted">
          <i className="hz-m hz-reservado" /> Cita agendada
        </span>
      </div>

      <div className="card-body">
        <div className="cal-grid">
          {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((d) => (
            <div key={d} className="cal-day-header">
              {d}
            </div>
          ))}
          {celdas.map((f) => {
            const iso = aISO(f);
            const dia = dias.find((d) => d.fecha === iso);
            const citas = dia?.turnos.filter((t) => t.estado === 'ocupado') ?? [];
            const otroMes = f.getMonth() !== mes.getMonth();

            return (
              <div
                key={iso}
                className={`cal-day ${otroMes ? 'other-month' : ''} ${iso === hoy ? 'today' : ''} ${citas.length ? 'has-appts' : ''}`}
              >
                {!otroMes && <span className="cal-day-num">{f.getDate()}</span>}
                {citas.slice(0, 3).map((c) => (
                  <span key={c.hora} className="cal-event-pill pill-pendiente">
                    {c.hora} {c.reserva?.nombre.split(' ')[0]}
                  </span>
                ))}
                {citas.length > 3 && <span className="cal-more">+{citas.length - 3} más</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── Horarios: la cuadrícula de abrir y cerrar del salón ─────── */
function Horarios({
  dias,
  horario,
  onAplicar,
}: {
  dias: Dia[];
  horario: Horario;
  onAplicar: (h: Horario) => void;
}) {
  const visibles = dias.slice(0, 14);
  const horas = useMemo(() => {
    const todas = new Set<string>();
    visibles.forEach((d) => d.turnos.forEach((t) => todas.add(t.hora)));
    // También las horas del horario base, para poder abrir un día cerrado.
    Object.values(horario.semana).forEach((h) => {
      for (let n = Number(h.desde.split(':')[0]); n < Number(h.hasta.split(':')[0]); n++) {
        todas.add(`${String(n).padStart(2, '0')}:00`);
      }
    });
    return [...todas].sort();
  }, [visibles, horario]);

  function alternar(dia: Dia, hora: string) {
    const turno = dia.turnos.find((t) => t.hora === hora);
    if (turno?.estado === 'ocupado') return; // una hora con cita no se toca
    onAplicar(turno?.estado === 'libre' ? cerrarHora(dia.fecha, hora, horario) : abrirHora(dia.fecha, hora, horario));
  }

  return (
    <div className="panel-card">
      <div className="card-head">
        <div>
          <h2 className="card-title">Abrir y cerrar horarios</h2>
          <p className="hz-ayuda">
            Toca una hora para cerrarla. Vuelve a tocarla para abrirla. Lo que cierres desaparece al instante de lo que ve
            tu cliente.
          </p>
        </div>
      </div>

      <div className="card-body">
        <div className="hz-leyenda">
          <span>
            <i className="hz-m hz-libre" /> Libre
          </span>
          <span>
            <i className="hz-m hz-cerrado" /> Cerrada por ti
          </span>
          <span>
            <i className="hz-m hz-reservado" /> Ya reservada
          </span>
          <span>
            <i className="hz-m hz-nodisponible" /> Fuera de horario
          </span>
        </div>

        <div className="hz-scroll">
          <table className="hz-tabla">
            <thead>
              <tr>
                <th className="hz-dia-col">Día</th>
                {horas.map((h) => (
                  <th key={h}>{h}</th>
                ))}
                <th />
              </tr>
            </thead>
            <tbody>
              {visibles.map((d) => (
                <tr key={d.fecha}>
                  <th className="hz-dia-col">
                    {NOMBRES_DIA[new Date(`${d.fecha}T00:00:00`).getDay()]}
                    <small>{formatearFecha(d.fecha).replace(/^[^,]+, /, '')}</small>
                  </th>
                  {horas.map((h) => {
                    const turno = d.turnos.find((t) => t.hora === h);
                    const clase = !turno
                      ? 'hz-nodisponible'
                      : turno.estado === 'ocupado'
                        ? 'hz-reservado'
                        : turno.estado === 'cerrado'
                          ? 'hz-cerrado'
                          : 'hz-libre';
                    return (
                      <td key={h}>
                        <div
                          className={`hz-celda ${clase}`}
                          role="button"
                          tabIndex={0}
                          title={turno?.reserva ? `${turno.reserva.nombre} · ${turno.reserva.empresa}` : h}
                          onClick={() => alternar(d, h)}
                          onKeyDown={(e) => e.key === 'Enter' && alternar(d, h)}
                        >
                          {turno?.estado === 'ocupado' ? turno.reserva?.nombre.split(' ')[0]?.slice(0, 6) : ''}
                        </div>
                      </td>
                    );
                  })}
                  <td className="hz-acciones">
                    <button
                      type="button"
                      className="hz-btn"
                      onClick={() => onAplicar(d.cerrado ? abrirDia(d.fecha, horario) : cerrarDia(d.fecha, horario))}
                    >
                      {d.cerrado ? 'Abrir día' : 'Cerrar día'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <details className="mt-6">
          <summary className="cursor-pointer text-sm font-semibold">Mi horario de siempre</summary>
          <div className="mt-3 space-y-2">
            {([1, 2, 3, 4, 5, 6, 0] as DiaSemana[]).map((d) => {
              const dato = horario.semana[d];
              return (
                <div key={d} className="flex flex-wrap items-center gap-3 rounded-xl border border-line px-4 py-2.5">
                  <label className="flex min-w-32 items-center gap-2 text-sm font-medium">
                    <input
                      type="checkbox"
                      checked={dato.abierto}
                      onChange={(e) =>
                        onAplicar({
                          ...horario,
                          semana: { ...horario.semana, [d]: { ...dato, abierto: e.target.checked } },
                        })
                      }
                    />
                    {NOMBRES_DIA[d]}
                  </label>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted">de</span>
                    <input
                      type="time"
                      value={dato.desde}
                      className="field w-auto py-1"
                      onChange={(e) =>
                        onAplicar({ ...horario, semana: { ...horario.semana, [d]: { ...dato, desde: e.target.value } } })
                      }
                    />
                    <span className="text-muted">a</span>
                    <input
                      type="time"
                      value={dato.hasta}
                      className="field w-auto py-1"
                      onChange={(e) =>
                        onAplicar({ ...horario, semana: { ...horario.semana, [d]: { ...dato, hasta: e.target.value } } })
                      }
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </details>
      </div>
    </div>
  );
}

/* ── Citas: tabla igual a la de reservas del salón ───────────── */
function Citas({ dias }: { dias: Dia[] }) {
  const citas = dias.flatMap((d) =>
    d.turnos.filter((t) => t.estado === 'ocupado' && t.reserva).map((t) => ({ dia: d, turno: t })),
  );

  return (
    <div className="panel-card">
      <div className="card-head">
        <h2 className="card-title">Todas las citas</h2>
        <span className="text-sm text-muted">{citas.length} en los próximos 30 días</span>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Quién</th>
              <th>Empresa</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Qué le está costando</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {citas.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center">
                  Todavía no hay citas. Cuando alguien reserve desde tu página, aparece aquí.
                </td>
              </tr>
            )}
            {citas.map(({ dia, turno }) => {
              const r = turno.reserva!;
              const mensaje = `Hola ${r.nombre.split(' ')[0]}, te confirmo nuestra llamada del ${formatearFecha(dia.fecha)} a las ${turno.hora}.`;
              return (
                <tr key={dia.fecha + turno.hora}>
                  <td className="font-medium">
                    {r.nombre}
                    <br />
                    <span className="text-xs text-muted">{r.email}</span>
                  </td>
                  <td>{r.empresa || '—'}</td>
                  <td className="capitalize">{formatearFecha(dia.fecha)}</td>
                  <td>{turno.rango}</td>
                  <td className="max-w-64 text-pretty">{r.reto || '—'}</td>
                  <td>
                    <span className="badge badge-pendiente">Pendiente</span>
                  </td>
                  <td>
                    <a
                      className="hz-btn inline-flex items-center gap-1.5"
                      href={`https://wa.me/?text=${encodeURIComponent(mensaje)}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MessageCircle className="size-3.5" aria-hidden /> WhatsApp
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
