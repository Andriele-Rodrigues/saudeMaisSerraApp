import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppointmentProvider } from "./contexts/AppointmentContext";

import MenuScreen from "./screens/MenuScreen";
import SelectDoctorScreen from "./screens/SelectDoctorScreen";
import SelectDateScreen from "./screens/SelectDateScreen";
import SelectTimeScreen from "./screens/SelectTimeScreen";
import ConfirmScreen from "./screens/ConfirmScreen";
import MyAppointmentsScreen from "./screens/MyAppointmentsScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <AppointmentProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Menu" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Menu" component={MenuScreen} />
          <Stack.Screen name="SelectDoctor" component={SelectDoctorScreen} />
          <Stack.Screen name="SelectDate" component={SelectDateScreen} />
          <Stack.Screen name="SelectTime" component={SelectTimeScreen} />
          <Stack.Screen name="Confirm" component={ConfirmScreen} />
          <Stack.Screen name="MyAppointments" component={MyAppointmentsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppointmentProvider>
  );
}