/**
 * StudyHive content — Curated question sets across five units.
 * CS3691: Embedded Systems & IoT (26 questions)
 * CS3591: Computer Networks (26 questions)
 *
 * Question = { id, text, answer? }
 * Unit     = { id: 'I' | 'II' | 'III' | 'IV' | 'V', title, shortTitle, questions[] }
 *
 * Keep question ids unique (e.g. "I.1", "II.2") — progress is stored by id.
 * Add an `answer` to any question to fill its practice flashcard.
 */

export const cs3691Units = [
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

export const cs3591Units = [
  {
    id: 'I',
    title: 'Introduction to Computer Networks',
    shortTitle: 'Intro to CN',
    questions: [
      { id: 'I.1', text: 'Explain OSI Network Architecture (OSI Model) and its seven layers.' },
      { id: 'I.2', text: 'Explain the different types of computer networks (PAN, LAN, CAN, MAN and WAN).' },
      { id: 'I.3', text: 'Explain the TCP/IP Protocol Suite and its four layers.' },
      { id: 'I.4', text: 'Explain Email Protocols (SMTP, POP3, IMAP and MIME).' },
      { id: 'I.5', text: 'Explain File Transfer Protocol (FTP).' },
      { id: 'I.6', text: 'Explain Domain Name System (DNS).' },
    ],
  },
  {
    id: 'II',
    title: 'Transport Layer',
    shortTitle: 'Transport Layer',
    questions: [
      { id: 'II.1', text: 'Explain TCP and UDP protocols and compare their features.' },
      { id: 'II.2', text: 'Explain Congestion Control and its techniques.' },
      { id: 'II.3', text: 'Explain Flow Control using the Sliding Window Technique.' },
      { id: 'II.4', text: 'Explain Congestion Avoidance, including the DECbit Scheme and RED algorithm.' },
    ],
  },
  {
    id: 'III',
    title: 'Network Layer',
    shortTitle: 'Network Layer',
    questions: [
      { id: 'III.1', text: 'Explain IPv4 and IPv6 protocols.' },
      { id: 'III.2', text: 'Explain Internet Control Message Protocol (ICMP).' },
      { id: 'III.3', text: 'Explain Dynamic Host Configuration Protocol (DHCP).' },
      { id: 'III.4', text: 'Explain Address Resolution Protocol (ARP).' },
      { id: 'III.5', text: 'Explain Reverse Address Resolution Protocol (RARP).' },
      { id: 'III.6', text: 'Explain Subnetting with an example.' },
    ],
  },
  {
    id: 'IV',
    title: 'Routing Protocols',
    shortTitle: 'Routing Protocols',
    questions: [
      { id: 'IV.1', text: 'Explain Routing Information Protocol (RIP).' },
      { id: 'IV.2', text: 'Explain Distance Vector Routing and its working.' },
      { id: 'IV.3', text: 'Explain Open Shortest Path First (OSPF) protocol.' },
      { id: 'IV.4', text: 'Explain Border Gateway Protocol (BGP).' },
      { id: 'IV.5', text: 'Explain Distance Vector Multicast Routing Protocol (DVMRP).' },
    ],
  },
  {
    id: 'V',
    title: 'Data Link Layer and Wireless Networks',
    shortTitle: 'Data Link & Wireless',
    questions: [
      { id: 'V.1', text: 'Explain Wireless LAN (IEEE 802.11) architecture and its components.' },
      { id: 'V.2', text: 'Explain CSMA/CD (Carrier Sense Multiple Access with Collision Detection).' },
      { id: 'V.3', text: 'Explain High-Level Data Link Control (HDLC) protocol.' },
      { id: 'V.4', text: 'Explain Point-to-Point Protocol (PPP).' },
      { id: 'V.5', text: 'Explain the different types of Switching (Packet, Circuit and Message Switching).' },
    ],
  },
];

export const units = cs3691Units;

/** Completed on first load — a fresh tracker starts at 0. */
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
      if (Array.isArray(parsed) && parsed.length > 0) {
        const totalQ = parsed.reduce((sum, u) => sum + (u.questions?.length || 0), 0);
        if (totalQ > 0) return parsed;
      }
    }
  } catch {}
  if (subjectCode === 'CS3691') {
    return cs3691Units;
  }
  if (subjectCode === 'CS3591') {
    return cs3591Units;
  }
  return createDefaultSubjectUnits(subjectCode);
};