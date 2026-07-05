import { getAllArticles, getResources } from "$lib/atproto";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const [articles, resources] = await Promise.all([getAllArticles(), getResources()]);
  const en = articles.filter((a) => a.source === "leaflet");
  const de = articles.filter((a) => a.source === "pckt");
  return {
    en: en.slice(0, 3),
    de: de.slice(0, 3),
    resources: resources.slice(0, 5),
  };
};
