import { CalendarDays, ClipboardList, Clock, Info, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { CalendarioSemana } from '../components/panel/CalendarioSemana';
import { HorarioSemanal } from '../components/panel/HorarioSemanal';
import { ListaCitas } from '../components/panel/ListaCitas';
import { Resumen } from '../components/panel/Resumen';
import { proximosDias } from '../lib/agenda';
import {
  abrirDia,
  abrirHora,
  cerrarDia,
  cerrarHora,
  guardarHorario,
  leerHorario,
  type Horario,
} from '../lib/horarios';
import { consultora } from '../site';

const PESTANAS = [
  { id: 'resumen', texto: 'Resumen', icono: LayoutDashboard },
  { id: 'calendario', texto: 'Calendario', icono: CalendarDays },
  { id: 'horario', texto: 'Horario', icono: Clock },
  { id: 'citas', texto: 'Citas', icono: ClipboardList },
] as const;

type Pestana = (typeof PESTANAS)[number]['id'];

/** El panel del consultor: ver cómo viene la semana y abrir o cerrar sus horas. */
export function Panel() {
  const [pestana, setPestana] = useState<Pestana>('resumen');
  const [horario, setHorario] = useState<Horario>(() => leerHorario());
  const [dias, setDias] = useState(() => proximosDias(30));

  function aplicar(nuevo: Horario) {
    guardarHorario(nuevo);
    setHorario(nuevo);
    setDias(proximosDias(30, nuevo));
  }

  function alternarHora(fecha: string, hora: string) {
    const turno = dias.find((d) => d.fecha === fecha)?.turnos.find((t) => t.hora === hora);
    if (!turno || turno.estado === 'ocupado') return; // una hora con cita no se cierra
    aplicar(turno.estado === 'cerrado' ? abrirHora(fecha, hora, horario) : cerrarHora(fecha, hora, horario));
  }

  function alternarDia(fecha: string, cerrar: boolean) {
    const conCita = dias.find((d) => d.fecha === fecha)?.turnos.some((t) => t.estado === 'ocupado');
    if (cerrar && conCita) {
      alert('Ese día ya tiene una cita. Muévela o cancélala antes de cerrar el día.');
      return;
    }
    aplicar(cerrar ? cerrarDia(fecha, horario) : abrirDia(fecha, horario));
  }

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-line">
        <div className="container-page flex h-20 items-center justify-between gap-4">
          <div>
            <Link to="/" className="font-display text-lg font-semibold tracking-tight">
              {consultora.nombre}
            </Link>
            <p className="text-sm text-muted">Panel</p>
          </div>
          <Link to="/diagnostico" className="btn-ghost px-4 py-2">
            Ver mi página
          </Link>
        </div>
      </header>

      <div className="border-b border-line bg-panel">
        <div className="container-page flex items-start gap-3 py-2.5 text-sm">
          <Info className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
          <p className="text-pretty">
            Vista del dueño. En tu web real esta sección va protegida con acceso; aquí está abierta para que la pruebes.
          </p>
        </div>
      </div>

      <main className="container-page py-8">
        <nav className="mb-6 flex gap-2 overflow-x-auto pb-1">
          {PESTANAS.map(({ id, texto, icono: Icono }) => (
            <button
              key={id}
              type="button"
              onClick={() => setPestana(id)}
              aria-pressed={pestana === id}
              className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
                pestana === id ? 'border-ink bg-ink text-paper' : 'border-line hover:border-ink/40'
              }`}
            >
              <Icono className="size-4" aria-hidden />
              {texto}
            </button>
          ))}
        </nav>

        {pestana === 'resumen' && <Resumen dias={dias} />}
        {pestana === 'calendario' && (
          <CalendarioSemana dias={dias} onAlternarHora={alternarHora} onAlternarDia={alternarDia} />
        )}
        {pestana === 'horario' && <HorarioSemanal horario={horario} onCambiar={aplicar} />}
        {pestana === 'citas' && <ListaCitas dias={dias} />}
      </main>
    </div>
  );
}
