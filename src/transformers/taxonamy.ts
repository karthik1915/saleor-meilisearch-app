import { getSafeId } from "@/utils/safeId";

export const transformTaxonomy = (item: any) => {
  const safeId = getSafeId(item.id.replace(/=/g, "").replace(/\//g, "_").replace(/\+/g, "-"));
  return {
    id: safeId,
    saleorId: item.id,
    name: item.name,
    slug: item.slug,
    level: item.level || 0, // Only for categories
    description_plain: item.description ? JSON.parse(item.description).blocks[0]?.data?.text : "",
    image: item.backgroundImage?.url,
  };
};
