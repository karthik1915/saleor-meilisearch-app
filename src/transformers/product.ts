import { AssignedAttribute, Channel } from "@/generated/graphql";
import { Product } from "@/generated/graphql";

export const transformProduct = (product: Product, channel: Channel) => {
  const safeId = product.id.replace(/=/g, "").replace(/\//g, "_").replace(/\+/g, "-");
  const pricingStart = product.pricing?.priceRange?.start?.net;
  const price = pricingStart?.amount ?? 0;
  const currency = pricingStart?.currency ?? "USD";

  const attributes = transformAttributes(product.assignedAttributes || []);

  return {
    id: safeId,
    saleorId: product.id,
    name: product.name,
    slug: product.slug,
    ...attributes,
    price_amount: price,
    currency,
    channel_id: channel.id,
    channel_slug: channel.slug,
    channel_name: channel.name,
    channel_default_country: channel.defaultCountry.country,
    thumbnail_src: product.thumbnail?.url,
    thumbnail_at: product.thumbnail?.alt ?? "null",
    category_name: product.category?.name,
    category_slug: product.category?.slug,
    updated_at: product.updatedAt ? new Date(product.updatedAt).getTime() : 0,
    description_plain: product.description
      ? JSON.parse(product.description).blocks[0]?.data?.text
      : "",
    is_available: product.isAvailableForPurchase ?? false,
  };
};

export const transformAttributes = (assignedAttributes: ReadonlyArray<AssignedAttribute>) => {
  const attrs: Record<string, string | string[]> = {};

  assignedAttributes.forEach((assigned) => {
    const attr = assigned.attribute;
    const slug = attr?.slug;
    if (!slug) return;

    const values =
      attr?.choices?.edges?.map((edge) => edge.node.name).filter((v): v is string => !!v) || [];

    if (values.length === 0) return;

    attrs[slug] = values.length > 1 ? values : values[0];
  });

  return attrs;
};
