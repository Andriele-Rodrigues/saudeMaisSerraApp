import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const DoctorCard = ({ doctor, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(doctor)}>
      <View style={styles.avatar}>
        <Text style={styles.initials}>{doctor.initials}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{doctor.name}</Text>
        <Text style={styles.spec}>{doctor.specialty}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    marginVertical: 10,
    marginHorizontal: 16,
    borderRadius: 12,
    elevation: 2,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "#D4E5FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  initials: { fontSize: 28, color: "#2A66B4", fontWeight: "700" },
  info: { flex: 1 },
  name: { fontSize: 18, fontWeight: "700", color: "#1A2B3B" },
  spec: { marginTop: 6, fontSize: 14, color: "#6F7A87" },
});

export default DoctorCard;