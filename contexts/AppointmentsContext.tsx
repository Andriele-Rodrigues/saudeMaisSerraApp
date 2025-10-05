import React, { createContext, ReactNode, useContext, useState } from 'react';

// Define a estrutura de um agendamento
export type Appointment = {
  id: string;
  clinicName?: string;
  doctor: string;
  specialty: string;
  address?: string;
  phone?: string;
  date: string;
  time: string;
};

// Define os valores que o nosso contexto irá fornecer
type AppointmentsContextType = {
  appointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  removeAppointment: (id: string) => void;
};

// Dados iniciais para o aplicativo
const initialAppointments: Appointment[] = [
    {
        id: '1',
        clinicName: 'Clínica Bem Viver',
        doctor: 'Dra. Ana Souza',
        specialty: 'Cardiologia',
        address: 'Rua das Flores, 123, Centro',
        phone: '(54) 99999-1111',
        date: '25/10/2025',
        time: '10:30',
    },
];

// Cria o contexto
const AppointmentsContext = createContext<AppointmentsContextType | undefined>(undefined);

// Cria o Provedor que irá "abraçar" o nosso aplicativo
export const AppointmentsProvider = ({ children }: { children: ReactNode }) => {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);

  // Função para adicionar um novo agendamento
  const addAppointment = (newAppointmentData: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = {
      id: Date.now().toString(), // Gera um ID único
      ...newAppointmentData,
    };
    setAppointments(prev => [...prev, newAppointment]);
  };

  // Função para remover um agendamento
  const removeAppointment = (id: string) => {
    setAppointments(prev => prev.filter(app => app.id !== id));
  };

  const value = { appointments, addAppointment, removeAppointment };

  return <AppointmentsContext.Provider value={value}>{children}</AppointmentsContext.Provider>;
};

// Hook personalizado para usar o contexto facilmente nas telas
export const useAppointments = () => {
  const context = useContext(AppointmentsContext);
  if (context === undefined) {
    throw new Error('useAppointments must be used within an AppointmentsProvider');
  }
  return context;
};