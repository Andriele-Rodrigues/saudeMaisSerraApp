import { FavoriteItem, useFavorites } from '@/contexts/FavoritesContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Card para exibir um item favoritado (agora lida com Médicos e Prestadores)
const FavoriteCard = ({ item, onRemove }: { item: FavoriteItem; onRemove: () => void }) => {
    const router = useRouter();
    
    // Verifica se o item é um prestador para decidir para onde navegar
    const isPrestador = 'tipo' in item;
    const onPress = () => {
        // Apenas navega para detalhes se for um Prestador (Clínica, Hospital, etc.)
        if (isPrestador) {
            router.push({ pathname: '/guia-medico/detalhes', params: { id: item.id } });
        }
    };

    return (
        <TouchableOpacity style={styles.card} onPress={onPress} disabled={!isPrestador}>
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.nome}</Text>
                <Text style={styles.cardSubtitle}>{item.especialidades.join(' / ')}</Text>
                <Text style={styles.cardText}>{item.endereco}</Text>
            </View>
            <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
                <Ionicons name="trash-outline" size={24} color="#E74C3C" />
            </TouchableOpacity>
        </TouchableOpacity>
    );
};


export default function FavoritosScreen() {
    const { favorites, removeFavorite } = useFavorites();
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => router.back()} style={styles.headerIcon}>
                    <Ionicons name="arrow-back" size={28} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Meus Favoritos</Text>
                <View style={styles.headerIcon} />
            </View>

            <FlatList
                data={favorites}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <FavoriteCard item={item} onRemove={() => removeFavorite(item.id)} />}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="star-outline" size={60} color="#ccc" />
                        <Text style={styles.emptyText}>Nenhum favorito salvo.</Text>
                        <Text style={styles.emptySubtext}>Salve prestadores e médicos para os ver aqui.</Text>
                    </View>
                }
                contentContainerStyle={{ padding: 20 }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerTitle: { fontSize: 20, fontWeight: 'bold' },
    headerIcon: { width: 40 },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    cardSubtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
        flexWrap: 'wrap',
    },
    cardText: {
        fontSize: 14,
        color: '#888',
        marginTop: 8,
    },
    removeButton: {
        padding: 10,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#888',
        marginTop: 10,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#aaa',
        marginTop: 5,
        textAlign: 'center',
    },
});