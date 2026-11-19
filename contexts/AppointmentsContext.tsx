import {
  Agendamento,
  atualizarAgendamentosRealizados,
  cancelarAgendamento,
  confirmarAgendamento,
  listarAgendamentos,
  NovoAgendamento,
} from '@/src/database/repositories/agendamentoRepository';
import { ID_PACIENTE_PADRAO } from '@/src/database/repositories/pacienteRepository';
import { useSQLiteContext } from 'expo-sqlite';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

type AppointmentsContextType = {
  appointments: Agendamento[];
  loading: boolean;
  addAppointment: (dados: Omit<NovoAgendamento, 'paciente'>) => Promise<void>;
  cancelAppointment: (id: number, motivo: string) => Promise<void>;
  reload: () => Promise<void>;
};

const AppointmentsContext = createContext<AppointmentsContextType | undefined>(undefined);

// Mantém em memória apenas uma cópia da lista; a fonte dos dados é o SQLite.
export const AppointmentsProvider = ({ children }: { children: ReactNode }) => {
  const db = useSQLiteContext();
  const [appointments, setAppointments] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    await atualizarAgendamentosRealizados(db);
    setAppointments(await listarAgendamentos(db, ID_PACIENTE_PADRAO));
    setLoading(false);
  }, [db]);

  useEffect(() => {
    reload();
  }, [reload]);

  // Lança ConflitoHorarioError se o horário já estiver ocupado.
  const addAppointment = async (dados: Omit<NovoAgendamento, 'paciente'>) => {
    await confirmarAgendamento(db, { ...dados, paciente: ID_PACIENTE_PADRAO });
    await reload();
  };

  const cancelAppointment = async (id: number, motivo: string) => {
    await cancelarAgendamento(db, id, motivo);
    await reload();
  };

  const value = { appointments, loading, addAppointment, cancelAppointment, reload };

  return <AppointmentsContext.Provider value={value}>{children}</AppointmentsContext.Provider>;
};

export const useAppointments = () => {
  const context = useContext(AppointmentsContext);
  if (context === undefined) {
    throw new Error('useAppointments must be used within an AppointmentsProvider');
  }
  return context;
};
