import {
  Home,
  PlayCircle,
  Hexagon,
  Layers,
  RotateCcw,
  BookOpen,
  Link2,
  Trophy,
} from 'lucide-react';

export const NAV_ITEMS = [
  { label: 'Home', to: '/', icon: Home },
  { label: 'Quiz Mode', to: '/quiz-mode', icon: PlayCircle },
  { label: 'Question Hive', to: '/question-hive', icon: Hexagon },
  { label: 'Unit Nests', to: '/unit-nests', icon: Layers },
  { label: 'Revision', to: '/revision', icon: RotateCcw },
  { label: 'Notes', to: '/notes', icon: BookOpen },
  { label: 'Resources', to: '/resources', icon: Link2 },
  { label: 'Exam Readiness', to: '/exam-readiness', icon: Trophy },
];

export const MOBILE_NAV_ITEMS = [
  NAV_ITEMS[0],
  NAV_ITEMS[1],
  NAV_ITEMS[2],
  NAV_ITEMS[4],
  NAV_ITEMS[7],
];