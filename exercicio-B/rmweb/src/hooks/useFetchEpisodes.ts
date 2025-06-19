import { useEffect, useState } from "react";

interface Episode {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  characters: string[];
}

export function useFetchEpisodes(url: string) {
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!url) return;
    setLoading(true);
    fetch(url)
      .then((res) => res.json())
      .then(setEpisode)
      .finally(() => setLoading(false));
  }, [url]);

  return { episode, loading };
}