import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface SelectedDateContextType {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

const SelectedDateContext = createContext<SelectedDateContextType | undefined>(undefined);

export function useSelectedDate() {
  const ctx = useContext(SelectedDateContext);
  if (!ctx) throw new Error('useSelectedDate must be used within SelectedDateProvider');
  return ctx;
}

export function SelectedDateProvider({ children }: { children: ReactNode }) {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  });
  return (
    <SelectedDateContext.Provider value={{ selectedDate, setSelectedDate }}>
      {children}
    </SelectedDateContext.Provider>
  );
}
