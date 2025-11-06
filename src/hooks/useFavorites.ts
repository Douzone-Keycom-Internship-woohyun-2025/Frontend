import { useState } from "react";

export function useFavorites(key = "patent-favorites") {
  const [favorites, setFavorites] = useState<number[]>(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  });

  const toggleFavorite = (id: number) => {
    const newFav = favorites.includes(id)
      ? favorites.filter((f) => f !== id)
      : [...favorites, id];
    setFavorites(newFav);
    localStorage.setItem(key, JSON.stringify(newFav));
  };

  return { favorites, toggleFavorite };
}
