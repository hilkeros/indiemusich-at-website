import { getLeafletArticles, getPcktArticles, getResources } from "$lib/atproto";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const [en, de, resources] = await Promise.all([
    getLeafletArticles(),
    getPcktArticles(),
    getResources(),
  ]);
  return {
    en: en.slice(0, 3),
    de: de.slice(0, 3),
    resources: resources.slice(0, 5),
  };
};
