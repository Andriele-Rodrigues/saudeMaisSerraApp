import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const MenuScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.title}>Menu</Text>
        <Text style={styles.location}>📍 Caxias do Sul - RS</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity
          style={styles.buttonPrimary}
          onPress={() => navigation.navigate("SelectDoctor")}
        >
          <Text style={styles.btnText}>Agendar Consulta</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonSecondary}
          onPress={() => navigation.navigate("MyAppointments")}
        >
          <Text style={styles.btnTextSecondary}>Meus Agendamentos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F9FC" },
  topBar: {
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#1A5FB4",
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { color: "#fff", fontSize: 22, fontWeight: "700" },
  location: { color: "#DDEBFF", fontSize: 14 },
  content: { marginTop: 60, paddingHorizontal: 12 },
  buttonPrimary: {
    backgroundColor: "#2A66B4",
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 20,
  },
  btnText: { color: "#fff", fontSize: 18, fontWeight: "700" },
  buttonSecondary: {
    backgroundColor: "#17A2B8",
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: "center",
  },
  btnTextSecondary: { color: "#fff", fontSize: 18, fontWeight: "700" },
});

export default MenuScreen;