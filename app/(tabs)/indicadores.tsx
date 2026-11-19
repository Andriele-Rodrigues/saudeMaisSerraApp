import {
  agendamentosPorStatus,
  especialidadesMaisProcuradas,
  horariosMaisAgendados,
  ItemIndicador,
  prestadoresMaisBemAvaliados,
  totalAgendamentos,
} from '@/src/database/repositories/indicadoresRepository';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Painel = {
  total: number;
  especialidades: ItemIndicador[];
  status: ItemIndicador[];
  avaliados: ItemIndicador[];
  horarios: ItemIndicador[];
};

const ROTULO_STATUS: Record<string, string> = {
  agendado: 'Agendados',
  realizado: 'Realizados',
  cancelado: 'Cancelados',
  faltou: 'Não compareceu',
};

// Gráfico de barras horizontais desenhado com View (largura proporcional ao maior valor).
const GraficoBarras = ({
  titulo,
  descricao,
  itens,
  maximo,
  formatarValor,
}: {
  titulo: string;
  descricao: string;
  itens: ItemIndicador[];
  maximo?: number;
  formatarValor: (item: ItemIndicador) => string;
}) => {
  const maior = maximo ?? Math.max(...itens.map(i => i.valor), 1);
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitulo}>{titulo}</Text>
      <Text style={styles.cardDescricao}>{descricao}</Text>
      {itens.length === 0 ? (
        <Text style={styles.semDados}>Ainda não há dados suficientes para este indicador.</Text>
      ) : (
        itens.map(item => (
          <View key={item.rotulo} style={styles.linha}>
            <View style={styles.linhaTopo}>
              <Text style={styles.rotulo} numberOfLines={1}>{item.rotulo}</Text>
              <Text style={styles.valor}>{formatarValor(item)}</Text>
            </View>
            <View style={styles.trilho}>
              <View style={[styles.barra, { width: `${Math.max((item.valor / maior) * 100, 2)}%` }]} />
            </View>
          </View>
        ))
      )}
    </View>
  );
};

export default function IndicadoresScreen() {
  const router = useRouter();
  const db = useSQLiteContext();
  const [painel, setPainel] = useState<Painel | null>(null);

  // Recarrega sempre que a tela recebe foco, para refletir novos agendamentos e avaliações.
  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      (async () => {
        const [total, especialidades, status, avaliados, horarios] = await Promise.all([
          totalAgendamentos(db),
          especialidadesMaisProcuradas(db),
          agendamentosPorStatus(db),
          prestadoresMaisBemAvaliados(db),
          horariosMaisAgendados(db),
        ]);
        if (ativo) setPainel({ total, especialidades, status, avaliados, horarios });
      })();
      return () => { ativo = false; };
    }, [db])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerIcon}>
          <Ionicons name="arrow-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Painel de indicadores</Text>
        <View style={styles.headerIcon} />
      </View>

      {painel === null ? (
        <ActivityIndicator size="large" style={{ marginTop: 40 }} />
      ) : painel.total === 0 ? (
        <View style={styles.vazio}>
          <Ionicons name="bar-chart-outline" size={60} color="#ccc" />
          <Text style={styles.vazioTexto}>Nenhum agendamento registrado ainda.</Text>
          <Text style={styles.vazioSub}>Os indicadores aparecem assim que houver agendamentos no aparelho.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.amostra}>
            Dados do banco local · {painel.total} agendamento{painel.total === 1 ? '' : 's'} no total
          </Text>

          <GraficoBarras
            titulo="Especialidades mais procuradas"
            descricao="Top 5 por número de agendamentos"
            itens={painel.especialidades}
            formatarValor={i => String(i.valor)}
          />
          <GraficoBarras
            titulo="Agendamentos por status"
            descricao="Percentual sobre o total de agendamentos"
            itens={painel.status.map(i => ({ ...i, rotulo: ROTULO_STATUS[i.rotulo] ?? i.rotulo }))}
            maximo={100}
            formatarValor={i => `${i.valor}% (${i.detalhe})`}
          />
          <GraficoBarras
            titulo="Prestadores mais bem avaliados"
            descricao="Nota média de 1 a 5 (número de avaliações)"
            itens={painel.avaliados}
            maximo={5}
            formatarValor={i => `${Number(i.valor).toFixed(1)} (${i.detalhe})`}
          />
          <GraficoBarras
            titulo="Horários com mais agendamentos"
            descricao="Por faixa de horário, sem contar cancelados"
            itens={painel.horarios}
            formatarValor={i => String(i.valor)}
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 15, paddingVertical: 10, backgroundColor: '#fff', elevation: 2,
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  headerIcon: { width: 40 },
  content: { padding: 16, paddingBottom: 30 },
  amostra: { fontSize: 13, color: '#666', marginBottom: 12, textAlign: 'center' },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 16, marginBottom: 16, elevation: 2 },
  cardTitulo: { fontSize: 17, fontWeight: 'bold', color: '#005A59' },
  cardDescricao: { fontSize: 13, color: '#777', marginTop: 2, marginBottom: 12 },
  semDados: { fontSize: 14, color: '#999', fontStyle: 'italic' },
  linha: { marginBottom: 10 },
  linhaTopo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  rotulo: { flex: 1, fontSize: 14, color: '#333', marginRight: 8 },
  valor: { fontSize: 14, fontWeight: '600', color: '#333' },
  trilho: { height: 12, backgroundColor: '#E0F2F1', borderRadius: 6, overflow: 'hidden' },
  barra: { height: 12, backgroundColor: '#00A896', borderRadius: 6 },
  vazio: { alignItems: 'center', marginTop: 80, paddingHorizontal: 30 },
  vazioTexto: { fontSize: 17, color: '#666', marginTop: 12, textAlign: 'center' },
  vazioSub: { fontSize: 14, color: '#999', marginTop: 6, textAlign: 'center' },
});
