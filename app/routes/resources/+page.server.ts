import { getResources } from "$lib/atproto";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const resources = await getResources();
  return { resources };
};
