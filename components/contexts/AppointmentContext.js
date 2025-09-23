import React, { createContext, useState } from "react";

export const AppointmentContext = createContext();

export const AppointmentProvider = ({ children }) => {
  const [appointments, setAppointments] = useState([
    {
      id: "a1",
      doctorId: "d1",
      doctorName: "Dr. Carlos Silva",
      doctorSpec: "Clínico Geral",
      date: "2023-09-08",
      time: "09:00",
      city: "Caxias do Sul - RS",
    },
    {
      id: "a2",
      doctorId: "d2",
      doctorName: "Dra. Ana Souza",
      doctorSpec: "Cardiologia",
      date: "2023-09-12",
      time: "14:30",
      city: "Caxias do Sul - RS",
    },
  ]);

  const addAppointment = (appt) => {
    setAppointments((prev) => [...prev, { id: Date.now().toString(), ...appt }]);
  };

  const removeAppointment = (id) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <AppointmentContext.Provider
      value={{ appointments, addAppointment, removeAppointment }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};