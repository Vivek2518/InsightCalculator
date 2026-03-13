"use client";

import { Heart, HeartOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/lib/favorites-context";

type FavoriteToggleProps = {
  slug: string;
  className?: string;
};

export function FavoriteToggle({ slug, className }: FavoriteToggleProps) {
  const { favoritesSet, toggleFavorite } = useFavorites();
  const isFavorite = favoritesSet.has(slug);

  return (
    <Button
      size="icon"
      variant="ghost"
      className={className}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
      onClick={() => toggleFavorite(slug)}
    >
      {isFavorite ? (
        <Heart className="h-5 w-5 text-red-500" />
      ) : (
        <HeartOff className="h-5 w-5" />
      )}
    </Button>
  );
}
