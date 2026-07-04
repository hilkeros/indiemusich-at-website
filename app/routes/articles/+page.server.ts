import { getLeafletArticles, getPcktArticles } from "$lib/atproto";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const [en, de] = await Promise.all([getLeafletArticles(), getPcktArticles()]);
  return { en, de };
};
