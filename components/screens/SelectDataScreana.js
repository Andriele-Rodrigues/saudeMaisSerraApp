import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import dayjs from "dayjs";

const generateDates = (n = 30) => {
  const arr = [];
  const start = dayjs();
  for (let i = 0; i < n; i++) {
    const d = start.add(i, "day");
    arr.push({ iso: d.format("YYYY-MM-DD"), label: d.format("DD/MM"), dayName: d.format("ddd") });
  }
  return arr;
};

const SelectDateScreen = ({ route, navigation }) => {
  const { doctor } = route.params;
  const [selected, setSelected] = useState(null);
  const dates = generateDates(30);

  const onChooseDate = (d) => {
    setSelected(d.iso);
    navigation.navigate("SelectTime", { doctor, date: d.iso });
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.title}>Selecione a Data</Text>
        <Text style={styles.location}>📍 Caxias do Sul - RS</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.subtitle}>Próximos dias</Text>
        <View style={styles.grid}>
          {dates.map((d) => {
            const highlighted = d.iso === selected;
            return (
              <TouchableOpacity
                key={d.iso}
                style={[styles.dateBox, highlighted && styles.dateBoxSelected]}
                onPress={() => onChooseDate(d)}
              >
                <Text style={[styles.dayName, highlighted && { color: "#fff" }]}>{d.dayName}</Text>
                <Text style={[styles.dateLabel, highlighted && { color: "#fff", fontWeight: "700" }]}>{d.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
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

  subtitle: { marginVertical: 12, marginLeft: 4, color: "#1A2B3B", fontWeight: "700" },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  dateBox: {
    width: "30%",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: "center",
  },
  dateBoxSelected: { backgroundColor: "#2A66B4" },
  dayName: { color: "#6F7A87", fontSize: 12 },
  dateLabel: { color: "#1A2B3B", fontSize: 16, fontWeight: "700" },
});

export default SelectDateScreen;
