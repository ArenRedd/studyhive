/**
 * StudyHive content — CS3691 Embedded Systems & IoT, 26 questions across five units.
 * Every count, percentage and hexagon segment in the app is computed from this file.
 *
 * Question = { id, text, answer? }
 * Unit     = { id: 'I' | 'II' | 'III' | 'IV' | 'V', title, shortTitle, questions[] }
 *
 * Keep question ids unique (e.g. "II.1", "II.2") — progress is stored by id.
 * Add an `answer` to any question to fill its practice flashcard.
 */

export const units = [
  {
    id: 'I',
    title: '8051 Microcontroller',
    shortTitle: '8051',
    questions: [
      { id: 'I.1', text: 'Explain the block diagram and architecture of 8051.' },
      { id: 'I.2', text: 'Explain the instruction set of 8051 with examples.' },
      { id: 'I.3', text: 'Explain the addressing modes of 8051 with examples.' },
      { id: 'I.4', text: 'Draw and explain the pin diagram of 8051.' },
      { id: 'I.5', text: 'Explain timers and counters of 8051.' },
    ],
  },
  {
    id: 'II',
    title: 'RTOS and Interfacing',
    shortTitle: 'RTOS & Interfacing',
    questions: [
      { id: 'II.1', text: 'Explain the characteristics, features and requirements of RTOS.' },
      { id: 'II.2', text: 'Explain memory and I/O device interfacing (Keyboard and LCD).' },
      { id: 'II.3', text: 'Explain multitasking, multiprocess systems and context switching.' },
      { id: 'II.4', text: 'Discuss priority-based scheduling policies in detail.' },
      {
        id: 'II.5',
        text: 'Explain interfacing an 8-bit seven-segment LED display with 8051 through Port 1 and Port 3.',
      },
      {
        id: 'II.6',
        text: 'Compare Rate Monotonic Scheduling (RMS) and Earliest Deadline First (EDF) scheduling.',
      },
      { id: 'II.7', text: 'Explain the memory organization of the 8051 microcontroller.' },
    ],
  },
  {
    id: 'III',
    title: 'IoT and Arduino',
    shortTitle: 'IoT & Arduino',
    questions: [
      { id: 'III.1', text: 'What is IoT? Explain its components, block diagram, working and life cycle.' },
      { id: 'III.2', text: 'Explain the integration of sensors and actuators with Arduino.' },
      {
        id: 'III.3',
        text: 'Explain Arduino architecture, features and programming structure with an example.',
      },
      { id: 'III.4', text: 'Explain the different types of Arduino boards with their features.' },
    ],
  },
  {
    id: 'IV',
    title: 'Raspberry Pi and IoT Communication',
    shortTitle: 'Raspberry Pi & IoT',
    questions: [
      { id: 'IV.1', text: 'What is ZigBee? Explain its architecture, various layers and components.' },
      { id: 'IV.2', text: 'What is Raspberry Pi? Explain its architecture and components.' },
      { id: 'IV.3', text: 'Explain IoT communication models and APIs (REST and WebSocket).' },
      { id: 'IV.4', text: 'Explain Bluetooth architecture, Piconets and Scatternets.' },
      { id: 'IV.5', text: 'Explain Wi-Fi architecture, BSS and ESS.' },
      { id: 'IV.6', text: 'Explain Raspberry Pi programming with an example.' },
    ],
  },
  {
    id: 'V',
    title: 'Embedded System Applications',
    shortTitle: 'Applications',
    questions: [
      { id: 'V.1', text: 'Explain the complete design of an embedded system.' },
      { id: 'V.2', text: 'Explain the concept of Home Automation.' },
      { id: 'V.3', text: 'Explain the concept of Smart Cities.' },
      { id: 'V.4', text: 'Explain the concept of Smart Healthcare and Smart Agriculture.' },
    ],
  },
];

/** Completed on first load — a fresh tracker starts at 0 of 26. */
export const DEFAULT_COMPLETED = [];

export const TOTAL_QUESTIONS = units.reduce((sum, unit) => sum + unit.questions.length, 0);

export const getUnit = (unitId) => units.find((unit) => unit.id === unitId) || units[0];

export const allQuestions = units.flatMap((unit) =>
  unit.questions.map((question) => ({ ...question, unitId: unit.id, unitTitle: unit.title, shortTitle: unit.shortTitle })),
);

export const getQuestion = (questionId) => allQuestions.find((question) => question.id === questionId);

export const createDefaultSubjectUnits = (code = '') => [
  { id: 'I', title: 'Unit I', shortTitle: 'Unit I', questions: [] },
  { id: 'II', title: 'Unit II', shortTitle: 'Unit II', questions: [] },
  { id: 'III', title: 'Unit III', shortTitle: 'Unit III', questions: [] },
  { id: 'IV', title: 'Unit IV', shortTitle: 'Unit IV', questions: [] },
  { id: 'V', title: 'Unit V', shortTitle: 'Unit V', questions: [] },
];

export const loadSubjectUnits = (subjectCode = 'CS3691') => {
  try {
    const raw = localStorage.getItem(`studyhive.custom_units.${subjectCode}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  if (subjectCode === 'CS3691') {
    return units;
  }
  return createDefaultSubjectUnits(subjectCode);
};