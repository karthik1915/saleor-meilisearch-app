import { meili } from "../client";
import { createLogger } from "@/lib/logger";
import { Channel, Product } from "@/generated/graphql";
import { getAppSaleorClient } from "@/saleor/client";
import { CHANNELS_LIST_QUERY, GET_PRODUCT_BY_SLUG } from "@/saleor/queries";

import { transformProductUpd } from "@/transformers/product-update";

const logger = createLogger("update-product-index", {
  webhook: "PRODUCT_UPDATED",
});

export const updateProduct = async (productId: string) => {
  if (!productId) return;

  const saleorClient = await getAppSaleorClient();
  const channelData = (await saleorClient.request(CHANNELS_LIST_QUERY)) as {
    channels: Channel[];
  };

  const transformedProducts = [];

  for (const ch of channelData.channels) {
    console.log("productId", productId, "channel", ch.slug);
    const data = (await saleorClient.request(GET_PRODUCT_BY_SLUG, {
      id: productId,
      channel: ch.slug,
    })) as { product: Product };
    console.log("product data", data);
    const transformedProduct = transformProductUpd(data.product, ch);
    console.log("transormedProduct", transformedProduct);
    logger.info(`Transformed product: ${transformedProduct.name} for channel ${ch.slug}`);
    transformedProducts.push(transformedProduct);
  }

  logger.info(`Updating product in MeiliSearch: ${productId}`);
  await meili.index("products").addDocuments(transformedProducts);
};
