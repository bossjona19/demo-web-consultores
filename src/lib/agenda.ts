/**
 * Agenda: junta el horario del consultor con las citas ya tomadas y dice
 * qué se puede ofrecer. La pantalla no calcula nada; solo pinta lo que sale de aquí.
 *
 * En un cliente real esto habla con la base de datos (como en Agenda YA);
 * aquí se guarda en el navegador para que la demo funcione sin servidor.
 */

import { leerHorario, rango, turnosDelDia, type Horario } from './horarios';

const CLAVE = 'demo-consultor:reservas';

export type Reserva = {
  fecha: string; // YYYY-MM-DD
  hora: string; // HH:MM
  nombre: string;
  email: string;
  empresa: string;
  reto: string;
  creada: string;
};

export type EstadoTurno = 'libre' | 'ocupado' | 'cerrado';

export type Turno = {
  hora: string;
  rango: string;
  estado: EstadoTurno;
  /** Solo cuando está ocupado: para que el panel muestre de quién es la cita. */
  reserva?: Reserva;
};

export type Dia = {
  fecha: string;
  etiqueta: string; // "jue 2 oct"
  diaNumero: string; // "2"
  diaLetra: string; // "jue"
  libres: number;
  cerrado: boolean;
  turnos: Turno[];
};

function aISO(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function leerReservas(): Reserva[] {
  try {
    const crudo = localStorage.getItem(CLAVE);
    return crudo ? (JSON.parse(crudo) as Reserva[]) : [];
  } catch {
    // Modo incógnito o almacenamiento bloqueado: la demo sigue sin historial.
    return [];
  }
}

function guardarReservas(reservas: Reserva[]) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(reservas));
  } catch {
    /* sin almacenamiento: no pasa nada */
  }
}

/** Los turnos de una fecha con su estado. Incluye los cerrados: verlos da confianza. */
export function turnosDe(fecha: string, horario: Horario, reservas: Reserva[]): Turno[] {
  const delDia = reservas.filter((r) => r.fecha === fecha);
  const abiertos = turnosDelDia(fecha, horario);

  // Una hora reservada se muestra aunque el dueño la haya cerrado después:
  // esconder una cita que existe es la peor forma de perderla.
  const horas = [...new Set([...abiertos, ...delDia.map((r) => r.hora)])].sort();

  const ahora = new Date();
  const hoy = aISO(ahora);

  return horas.map((hora) => {
    const reserva = delDia.find((r) => r.hora === hora);
    const pasada = fecha === hoy && hora <= `${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`;
    const estado: EstadoTurno = reserva ? 'ocupado' : !abiertos.includes(hora) || pasada ? 'cerrado' : 'libre';
    return { hora, rango: rango(hora, horario.duracion), estado, reserva };
  });
}

/**
 * Los próximos días, todos los de la semana. Sábado y domingo también aparecen:
 * quién trabaja y quién no lo decide el consultor en su panel, no el código.
 */
export function proximosDias(cantidad = 30, horario = leerHorario(), reservas = leerReservas()): Dia[] {
  const formatoCorto = new Intl.DateTimeFormat('es-PA', { weekday: 'short' });
  const dias: Dia[] = [];
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  for (let i = 0; i < cantidad; i++) {
    cursor.setDate(cursor.getDate() + 1);
    const fecha = aISO(cursor);
    const turnos = turnosDe(fecha, horario, reservas);
    const libres = turnos.filter((t) => t.estado === 'libre').length;

    dias.push({
      fecha,
      etiqueta: `${formatoCorto.format(cursor).replace('.', '')} ${cursor.getDate()}`,
      diaLetra: formatoCorto.format(cursor).replace('.', ''),
      diaNumero: String(cursor.getDate()),
      libres,
      cerrado: libres === 0,
      turnos,
    });
  }
  return dias;
}

/** Para no dejar a nadie mirando una cuadrícula vacía: el siguiente día con espacio. */
export function proximoDiaLibre(dias: Dia[], desde: string): Dia | undefined {
  return dias.find((d) => d.fecha > desde && !d.cerrado);
}

/** Guarda la cita. Devuelve null si el turno dejó de estar libre mientras llenaba el formulario. */
export function reservar(datos: Omit<Reserva, 'creada'>): Reserva | null {
  const reservas = leerReservas();
  const turnos = turnosDe(datos.fecha, leerHorario(), reservas);
  const turno = turnos.find((t) => t.hora === datos.hora);
  if (!turno || turno.estado !== 'libre') return null;

  const reserva: Reserva = { ...datos, creada: new Date().toISOString() };
  guardarReservas([...reservas, reserva]);
  return reserva;
}

export function formatearFecha(fecha: string): string {
  const [a, m, d] = fecha.split('-').map(Number);
  return new Intl.DateTimeFormat('es-PA', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(a, m - 1, d));
}

export function esManana(hora: string): boolean {
  return Number(hora.split(':')[0]) < 12;
}
