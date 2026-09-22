/**
 * Agenda de la demo: genera los horarios disponibles y guarda las reservas.
 *
 * En un cliente real esto habla con la base de datos (como en Agenda YA);
 * aquí se guarda en el navegador para que la demo funcione sin servidor.
 */

const CLAVE = 'demo-consultor:reservas';

/** Horarios que la consultora ofrece cada día laboral. */
const HORAS = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

export type Reserva = {
  fecha: string; // YYYY-MM-DD
  hora: string; // HH:MM
  nombre: string;
  email: string;
  empresa: string;
  reto: string;
  creada: string;
};

export type Dia = {
  fecha: string;
  etiqueta: string; // "lun 29 sep"
  horas: { hora: string; libre: boolean }[];
};

function aISO(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function leerReservas(): Reserva[] {
  try {
    const crudo = localStorage.getItem(CLAVE);
    return crudo ? (JSON.parse(crudo) as Reserva[]) : [];
  } catch {
    // Modo incógnito o almacenamiento bloqueado: la demo sigue funcionando sin historial.
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

/** Próximos días laborables con sus horas libres. */
export function proximosDias(cantidad = 5): Dia[] {
  const ocupadas = new Set(leerReservas().map((r) => `${r.fecha} ${r.hora}`));
  const formato = new Intl.DateTimeFormat('es-PA', { weekday: 'short', day: 'numeric', month: 'short' });

  const dias: Dia[] = [];
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  while (dias.length < cantidad) {
    cursor.setDate(cursor.getDate() + 1);
    const finDeSemana = cursor.getDay() === 0 || cursor.getDay() === 6;
    if (finDeSemana) continue;

    const fecha = aISO(cursor);
    dias.push({
      fecha,
      etiqueta: formato.format(cursor).replace('.', ''),
      horas: HORAS.map((hora) => ({ hora, libre: !ocupadas.has(`${fecha} ${hora}`) })),
    });
  }
  return dias;
}

/** Guarda la cita. Devuelve null si alguien tomó ese horario antes. */
export function reservar(datos: Omit<Reserva, 'creada'>): Reserva | null {
  const reservas = leerReservas();
  const tomada = reservas.some((r) => r.fecha === datos.fecha && r.hora === datos.hora);
  if (tomada) return null;

  const reserva: Reserva = { ...datos, creada: new Date().toISOString() };
  guardarReservas([...reservas, reserva]);
  return reserva;
}

export function formatearFecha(fecha: string): string {
  const [a, m, d] = fecha.split('-').map(Number);
  return new Intl.DateTimeFormat('es-PA', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(a, m - 1, d));
}
