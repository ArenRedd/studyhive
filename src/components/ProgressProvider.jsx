import { createContext, useContext } from 'react';
import { useProgressState } from '@/hooks/useProgress';

const ProgressContext = createContext(null);

export function ProgressProvider({ children }) {
  const value = useProgressState();
  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const value = useContext(ProgressContext);
  if (!value) throw new Error('useProgress must be used inside ProgressProvider');
  return value;
}