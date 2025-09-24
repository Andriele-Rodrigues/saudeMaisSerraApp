import DoctorCard from "@/components/DoctorCard";
import React, { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

const doctorsMock = [
  { id: "d1", name: "Dr. Carlos Silva", specialty: "Clínico Geral", initials: "CS" },
  { id: "d2", name: "Dra. Ana Souza", specialty: "Cardiologista", initials: "AS" },
  { id: "d3", name: "Dr. João Mendes", specialty: "Dermatologista", initials: "JM" },
  { id: "d4", name: "Dr. Pedro Oliveira", specialty: "Oftalmologista", initials: "PO" },
];

const SelectDoctorScreen = ({ navigation }) => {
  const [doctors] = useState(doctorsMock);

  const handleSelect = (doctor) => {
    navigation.navigate("SelectDate", { doctor });
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.title}>Selecione o Médico</Text>
        <Text style={styles.location}>📍 Caxias do Sul - RS</Text>
      </View>

      <FlatList
        data={doctors}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <DoctorCard doctor={item} onPress={handleSelect} />}
        contentContainerStyle={{ paddingVertical: 20 }}
      />
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
});

export default SelectDoctorScreen;