/**
 * Contenido de la demo. Todo el texto vive aquí para que cambiar de cliente
 * sea editar un archivo, no tocar los componentes.
 *
 * La consultora es ficticia: esta página es una muestra de cómo queda el sitio.
 */

export const consultora = {
  nombre: 'Marcela Ruiz',
  titulo: 'Consultora de operaciones para pymes de servicios',
  promesa: 'Ayudo a clínicas, academias y despachos de Panamá a dejar de apagar incendios y a ordenar su operación en 90 días.',
  ubicacion: 'Ciudad de Panamá · También en remoto',
  email: 'hola@marcelaruiz.com',
  whatsapp: '+507 6000-0000',
  anios: 12,
  empresas: 40,
};

export const dolores = [
  {
    titulo: 'Todo pasa por ti',
    texto: 'Si te vas una semana, el negocio se detiene. Cada decisión, por pequeña que sea, espera tu respuesta.',
  },
  {
    titulo: 'El equipo hace las cosas a su manera',
    texto: 'Cada quien atiende distinto porque nunca se escribió cómo se hace. La calidad depende de quién esté de turno.',
  },
  {
    titulo: 'Vendes más y ganas igual',
    texto: 'Facturas más que el año pasado, pero el margen no sube y nadie sabe explicar exactamente por qué.',
  },
];

export const pilares = [
  {
    numero: '01',
    titulo: 'Primero medimos, después opinamos',
    texto: 'Reviso tus números reales y acompaño un día de operación. Las recomendaciones salen de datos, no de teoría.',
  },
  {
    numero: '02',
    titulo: 'Procesos que el equipo sí usa',
    texto: 'Documentos cortos y visuales, escritos con tu gente. Si nadie los abre, no sirven de nada.',
  },
  {
    numero: '03',
    titulo: 'Te dejo la capacidad instalada',
    texto: 'Entreno a tu coordinador para que sostenga el sistema cuando yo ya no esté. No creo dependencia.',
  },
];

export const servicios = [
  {
    nombre: 'Diagnóstico operativo',
    duracion: '2 semanas',
    resumen: 'Una radiografía de tu operación y un plan priorizado de qué arreglar primero.',
    incluye: ['Entrevistas con tu equipo', 'Mapa de procesos actual', 'Informe con 10 acciones priorizadas', 'Sesión de presentación de resultados'],
    destacado: false,
  },
  {
    nombre: 'Programa 90 días',
    duracion: '3 meses',
    resumen: 'Implementamos juntos los cambios: procesos, indicadores y reuniones que sí sirven.',
    incluye: [
      'Todo lo del diagnóstico',
      'Manuales de los 5 procesos críticos',
      'Tablero de indicadores semanal',
      'Acompañamiento quincenal',
      'Entrenamiento al coordinador',
    ],
    destacado: true,
  },
  {
    nombre: 'Mentoría mensual',
    duracion: 'Continuo',
    resumen: 'Para cuando ya tienes el sistema y quieres a alguien que te ayude a sostenerlo.',
    incluye: ['2 sesiones al mes', 'Revisión de indicadores', 'Respuesta por WhatsApp entre sesiones'],
    destacado: false,
  },
];

export const testimonios = [
  {
    texto: 'Llegué pensando que necesitaba contratar a dos personas más. Terminé con el mismo equipo y 30 % más de citas atendidas.',
    autor: 'Directora, clínica dental',
    lugar: 'Ciudad de Panamá',
  },
  {
    texto: 'Lo que más valoro es que no nos dejó un PDF bonito: se sentó con el equipo hasta que el proceso funcionó.',
    autor: 'Fundador, academia de idiomas',
    lugar: 'David, Chiriquí',
  },
  {
    texto: 'Por primera vez sé cuánto cuesta atender a un cliente. Eso cambió cómo cotizamos.',
    autor: 'Socia, despacho contable',
    lugar: 'Ciudad de Panamá',
  },
];

export const proceso = [
  { paso: 'Llamada de 30 minutos', texto: 'Me cuentas cómo trabajan hoy. Si no puedo ayudarte, te lo digo en esa misma llamada.' },
  { paso: 'Propuesta en 48 horas', texto: 'Alcance, tiempos y precio cerrado. Sin letra chica ni horas sorpresa.' },
  { paso: 'Trabajo en sitio y en remoto', texto: 'Avances cada dos semanas, con responsables y fechas visibles para todos.' },
  { paso: 'Cierre y seguimiento', texto: 'Te entrego el sistema funcionando y volvemos a medir a los 60 días.' },
];

export const preguntas = [
  {
    p: '¿Trabajas con empresas pequeñas?',
    r: 'Sí. La mayoría de mis clientes tienen entre 5 y 40 personas. Por debajo de 5 suele ser más útil una mentoría que un programa completo.',
  },
  {
    p: '¿Cuánto cuesta?',
    r: 'El diagnóstico parte de un precio cerrado y el programa de 90 días se cotiza según el tamaño del equipo. En la llamada te doy el rango antes de mandarte nada.',
  },
  {
    p: '¿Tengo que parar la operación?',
    r: 'No. Todo el trabajo se hace sobre la operación andando; por eso acompaño turnos reales en vez de pedir reuniones largas.',
  },
];
