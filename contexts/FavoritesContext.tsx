import {
  adicionarFavorito,
  listarFavoritos,
  removerFavorito,
} from '@/src/database/repositories/favoritoRepository';
import { ID_PACIENTE_PADRAO } from '@/src/database/repositories/pacienteRepository';
import type { Estabelecimento } from '@/src/database/repositories/prestadorRepository';
import { useSQLiteContext } from 'expo-sqlite';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

type FavoritesContextType = {
  favorites: Estabelecimento[];
  addFavorite: (idEstabelecimento: number) => Promise<void>;
  removeFavorite: (idEstabelecimento: number) => Promise<void>;
  isFavorite: (idEstabelecimento: number) => boolean;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

// Favoritos são estabelecimentos marcados pelo usuário e ficam salvos na tabela `favorito`.
export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const db = useSQLiteContext();
  const [favorites, setFavorites] = useState<Estabelecimento[]>([]);

  const reload = useCallback(async () => {
    setFavorites(await listarFavoritos(db, ID_PACIENTE_PADRAO));
  }, [db]);

  useEffect(() => {
    reload();
  }, [reload]);

  const addFavorite = async (idEstabelecimento: number) => {
    await adicionarFavorito(db, ID_PACIENTE_PADRAO, idEstabelecimento);
    await reload();
  };

  const removeFavorite = async (idEstabelecimento: number) => {
    await removerFavorito(db, ID_PACIENTE_PADRAO, idEstabelecimento);
    await reload();
  };

  const isFavorite = (idEstabelecimento: number) => favorites.some(f => f.id === idEstabelecimento);

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
