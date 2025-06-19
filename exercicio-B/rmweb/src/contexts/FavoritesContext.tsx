import React, { createContext, useContext, useEffect, useState } from "react";

import type { Character } from "../hooks/useFetchCharacters";

interface FavoritesContextType {
  favorites: Character[];
  toggleFavorite: (character: Character) => void;
  isFavorite: (id: number) => boolean;
  getFilteredFavorites: (filter: string) => Character[];
  isFavoritesMode: boolean;
  toggleFavoriteMode: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const FAVORITES_KEY = "rmweb_favorites";

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Character[]>([]);
  const [isFavoritesMode, setIsFavoritesMode] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (stored) setFavorites(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (character: Character) => {
    setFavorites((prev) => {
      const exists = prev.find((c) => c.id === character.id);
      if (exists) return prev.filter((c) => c.id !== character.id);
      return [...prev, character];
    });
  };

  const isFavorite = (id: number) => favorites.some((c) => c.id === id);

  const getFilteredFavorites = (filter: string) =>
    favorites.filter((c) =>
      c.name.toLowerCase().includes(filter.toLowerCase())
    );
  
  const toggleFavoriteMode = () => {
    setIsFavoritesMode((prev) => !prev);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
        getFilteredFavorites,
        isFavoritesMode,
        toggleFavoriteMode
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites must be used within a FavoritesProvider");
  return context;
};