import { getArticleDetail } from "$lib/atproto";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  const article = await getArticleDetail(params.rkey);
  if (!article) error(404, "Article not found");
  return { article };
};
