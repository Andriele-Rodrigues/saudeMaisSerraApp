import { Medico, Prestador } from '@/app/api/mockData';
import React, { createContext, ReactNode, useContext, useState } from 'react';

// Um tipo que pode representar qualquer item que possa ser favoritado
// Usamos uma união dos tipos originais para máxima flexibilidade
export type FavoriteItem = Prestador | Medico;

// Define a estrutura do que será fornecido pelo contexto
type FavoritesContextType = {
  favorites: FavoriteItem[];
  addFavorite: (item: FavoriteItem) => void;
  removeFavorite: (itemId: string) => void;
  isFavorite: (itemId: string) => boolean;
};

// Cria o contexto
const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

// Componente Provedor que irá "abraçar" a sua aplicação
export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  const addFavorite = (item: FavoriteItem) => {
    // Evita adicionar duplicados
    if (!favorites.some(fav => fav.id === item.id)) {
      setFavorites(prevFavorites => [...prevFavorites, item]);
    }
  };

  const removeFavorite = (itemId: string) => {
    setFavorites(prevFavorites => prevFavorites.filter(p => p.id !== itemId));
  };

  const isFavorite = (itemId: string) => {
    return favorites.some(p => p.id === itemId);
  };

  const value = {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

// Hook personalizado para aceder facilmente ao contexto
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};