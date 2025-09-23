import { useContext } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AppointmentContext } from "../contexts/AppointmentContext";

const ConfirmScreen = ({ route, navigation }) => {
  const { doctor, date, time } = route.params;
  const { addAppointment } = useContext(AppointmentContext);

  const onConfirm = () => {
    addAppointment({
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorSpec: doctor.specialty,
      date,
      time,
      city: "Caxias do Sul - RS",
    });
    navigation.navigate("MyAppointments");
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.title}>Confirmar Agendamento</Text>
        <Text style={styles.location}>📍 Caxias do Sul - RS</Text>
      </View>

      <View style={{ padding: 16 }}>
        <View style={styles.card}>
          <Text style={styles.label}>Médico</Text>
          <Text style={styles.value}>{doctor.name} — {doctor.specialty}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Data</Text>
          <Text style={styles.value}>{date}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Horário</Text>
          <Text style={styles.value}>{time}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Cidade/Estado</Text>
          <Text style={styles.value}>Caxias do Sul - RS</Text>
        </View>

        <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm}>
          <Text style={styles.confirmText}>Confirmar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F9FC" },
  topBar: {
    paddingTop: 60,
    paddingBottom: 18,
    backgroundColor: "#1A5FB4",
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { color: "#fff", fontSize: 20, fontWeight: "700" },
  location: { color: "#DDEBFF", fontSize: 13 },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  label: { color: "#6F7A87", fontWeight: "700", marginBottom: 6 },
  value: { color: "#1A2B3B", fontSize: 16, fontWeight: "700" },

  confirmBtn: {
    marginTop: 18,
    backgroundColor: "#2A66B4",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  confirmText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});

export default ConfirmScreen;
