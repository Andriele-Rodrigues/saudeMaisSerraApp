import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const times = ["08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30"];

const SelectTimeScreen = ({ route, navigation }) => {
  const { doctor, date } = route.params;
  const [selected, setSelected] = useState(null);

  const choose = (t) => {
    setSelected(t);
    navigation.navigate("Confirm", { doctor, date, time: t });
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.title}>Selecione o Horário</Text>
        <Text style={styles.location}>📍 Caxias do Sul - RS</Text>
      </View>

      <View style={{ padding: 16 }}>
        <Text style={styles.hint}>Horários disponíveis para {date}</Text>
        <View style={styles.grid}>
          {times.map((t) => {
            const sel = t === selected;
            return (
              <TouchableOpacity
                key={t}
                style={[styles.slot, sel && styles.slotSelected]}
                onPress={() => choose(t)}
              >
                <Text style={[styles.slotText, sel && { color: "#fff" }]}>{t}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
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

  hint: { marginBottom: 12, color: "#1A2B3B", fontWeight: "700" },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  slot: {
    width: "48%",
    height: 70,
    borderRadius: 12,
    backgroundColor: "#fff",
    marginBottom: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  slotSelected: { backgroundColor: "#2A66B4" },
  slotText: { fontSize: 20, fontWeight: "700", color: "#1A2B3B" },
});

export default SelectTimeScreen;
