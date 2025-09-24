import { AppointmentProvider } from "@/src/components/contexts/AppointmentContext";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ConfirmScreen from "@/src/components/screens/ConfirmScrean";
import MenuScreen from "@/src/components/screens/MenuScreen";
import SelectDateScreen from "@/src/components/screens/SelectDataScreana";
import SelectDoctorScreen from "@/src/components/screens/SelectDoctorScreen";
import SelectTimeScreen from "@/src/components/screens/SelectTimeScreena";

const Stack = createNativeStackNavigator();
function AppNavigator() {
  return (
    <AppointmentProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Menu" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Menu" component={MenuScreen} />
          <Stack.Screen name="SelectDoctor" component={SelectDoctorScreen} />
          <Stack.Screen name="SelectDate" component={SelectDateScreen} />
          <Stack.Screen name="SelectTime" component={SelectTimeScreen} />
          <Stack.Screen name="Confirm" component={ConfirmScreen} />
         
        </Stack.Navigator>
      </NavigationContainer>
    </AppointmentProvider>
  );
}

export default AppNavigator;