/**
 * Horario del consultor: qué días trabaja, en qué franja, y qué ha cerrado a mano.
 *
 * Es la única fuente de verdad de la disponibilidad. Tanto la página pública
 * como el panel leen de aquí, así que no pueden contradecirse.
 *
 * Regla que viene de un error visto en otro proyecto: los siete días existen
 * siempre. Un día "cerrado" es un día apagado, nunca un día que desaparece;
 * si desaparece, el dueño no puede volver a abrirlo.
 */

const CLAVE = 'demo-consultor:horario';

export type DiaSemana = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = domingo

export type HorarioDia = {
  abierto: boolean;
  desde: string; // "09:00"
  hasta: string; // "17:00"
};

export type Horario = {
  /** Franja base de cada día de la semana. */
  semana: Record<DiaSemana, HorarioDia>;
  /** Cierres puntuales: "2026-10-03" (día entero) o "2026-10-03 11:00" (una hora). */
  cierres: string[];
  /** Horas sueltas que el consultor abre fuera de su franja: "2026-10-04 18:00". */
  extras: string[];
  /** Minutos que dura cada llamada. Una hora por defecto: de hora en hora
   *  salen la mitad de botones y la pantalla se lee mucho mejor. */
  duracion: number;
};

export const NOMBRES_DIA = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

/** Arranque razonable: de lunes a viernes, 9 a 5. El consultor lo cambia en su panel. */
const POR_DEFECTO: Horario = {
  semana: {
    0: { abierto: false, desde: '09:00', hasta: '13:00' },
    1: { abierto: true, desde: '09:00', hasta: '17:00' },
    2: { abierto: true, desde: '09:00', hasta: '17:00' },
    3: { abierto: true, desde: '09:00', hasta: '17:00' },
    4: { abierto: true, desde: '09:00', hasta: '17:00' },
    5: { abierto: true, desde: '09:00', hasta: '17:00' },
    6: { abierto: false, desde: '09:00', hasta: '13:00' },
  },
  cierres: [],
  extras: [],
  duracion: 60,
};

export function leerHorario(): Horario {
  try {
    const crudo = localStorage.getItem(CLAVE);
    if (!crudo) return POR_DEFECTO;
    const guardado = JSON.parse(crudo) as Horario;
    // Mezcla con el defecto por si un día quedó fuera en una versión vieja.
    return { ...POR_DEFECTO, ...guardado, semana: { ...POR_DEFECTO.semana, ...guardado.semana } };
  } catch {
    return POR_DEFECTO;
  }
}

export function guardarHorario(horario: Horario) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(horario));
  } catch {
    /* sin almacenamiento: la demo sigue, solo no recuerda */
  }
}

const aMinutos = (hora: string) => {
  const [h, m] = hora.split(':').map(Number);
  return h * 60 + m;
};

const aHora = (minutos: number) =>
  `${String(Math.floor(minutos / 60)).padStart(2, '0')}:${String(minutos % 60).padStart(2, '0')}`;

/** "09:00" + 30 min → "09:00 – 09:30". La persona tiene derecho a saber a qué hora sale. */
export function rango(hora: string, duracion: number): string {
  return `${hora} – ${aHora(aMinutos(hora) + duracion)}`;
}

/** Turnos que ofrece un día, ya contando la franja base, los cierres y los extras. */
export function turnosDelDia(fecha: string, horario: Horario): string[] {
  const dia = new Date(`${fecha}T00:00:00`).getDay() as DiaSemana;
  const base = horario.semana[dia];

  const turnos: string[] = [];
  if (base.abierto && !horario.cierres.includes(fecha)) {
    for (let m = aMinutos(base.desde); m + horario.duracion <= aMinutos(base.hasta); m += horario.duracion) {
      turnos.push(aHora(m));
    }
  }

  // Los extras entran aunque el día esté cerrado: son justamente para eso.
  horario.extras
    .filter((e) => e.startsWith(fecha))
    .forEach((e) => {
      const hora = e.split(' ')[1];
      if (hora && !turnos.includes(hora)) turnos.push(hora);
    });

  return turnos.filter((h) => !horario.cierres.includes(`${fecha} ${h}`)).sort();
}

/** Un día está cerrado si el dueño lo cerró o si su día de la semana no está abierto. */
export function diaCerrado(fecha: string, horario: Horario): boolean {
  return turnosDelDia(fecha, horario).length === 0;
}

export function cerrarHora(fecha: string, hora: string, horario: Horario): Horario {
  const marca = `${fecha} ${hora}`;
  return {
    ...horario,
    extras: horario.extras.filter((e) => e !== marca),
    cierres: horario.cierres.includes(marca) ? horario.cierres : [...horario.cierres, marca],
  };
}

export function abrirHora(fecha: string, hora: string, horario: Horario): Horario {
  const marca = `${fecha} ${hora}`;
  const sinCierre = horario.cierres.filter((c) => c !== marca);
  // Si la hora no cae en la franja base, se guarda como extra para que exista.
  const dentroDeFranja = turnosDelDia(fecha, { ...horario, cierres: sinCierre }).includes(hora);
  return {
    ...horario,
    cierres: sinCierre.filter((c) => c !== fecha),
    extras: dentroDeFranja || horario.extras.includes(marca) ? horario.extras : [...horario.extras, marca],
  };
}

export function cerrarDia(fecha: string, horario: Horario): Horario {
  return {
    ...horario,
    extras: horario.extras.filter((e) => !e.startsWith(fecha)),
    cierres: horario.cierres.includes(fecha) ? horario.cierres : [...horario.cierres, fecha],
  };
}

export function abrirDia(fecha: string, horario: Horario): Horario {
  const dia = new Date(`${fecha}T00:00:00`).getDay() as DiaSemana;
  const base = horario.semana[dia];
  const limpio = {
    ...horario,
    cierres: horario.cierres.filter((c) => c !== fecha && !c.startsWith(`${fecha} `)),
  };

  // Abrir un día que la semana tiene apagado (el domingo, por ejemplo) no debe
  // obligar a cambiar el horario base: se abre solo esa fecha, con extras.
  if (base.abierto) return limpio;

  const extras: string[] = [];
  for (let m = aMinutos(base.desde); m + horario.duracion <= aMinutos(base.hasta); m += horario.duracion) {
    extras.push(`${fecha} ${aHora(m)}`);
  }
  return { ...limpio, extras: [...limpio.extras, ...extras] };
}
