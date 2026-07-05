import { getAllArticles } from "$lib/atproto";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const articles = await getAllArticles();
  const en = articles.filter((a) => a.source === "leaflet");
  const de = articles.filter((a) => a.source === "pckt");
  return { en, de };
};
