import { ProductUpdated } from "@/generated/graphql";
import { createLogger } from "@/lib/logger";
import { updateProduct } from "@/meili/scripts/updateProduct";
import { saleorApp } from "@/saleor-app";
import { PRODUCT_UPDATED_SUBSCRIPTION } from "@/saleor/queries";
import { SaleorAsyncWebhook } from "@saleor/app-sdk/handlers/next";

export const config = {
  api: {
    bodyParser: false,
  },
};

const logger = createLogger("api/webhooks/product-updated-webhook", {
  webhook: "PRODUCT_UPDATED",
});

export const productUpdatedWebhook = new SaleorAsyncWebhook<ProductUpdated>({
  apl: saleorApp.apl,
  event: "PRODUCT_UPDATED",
  name: "Product Updated Webhook",
  query: PRODUCT_UPDATED_SUBSCRIPTION,
  webhookPath: "/api/webhooks/product-updated",
});

export default productUpdatedWebhook.createHandler(async (_, res, context) => {
  const { product } = context.payload;

  logger.info(`New event received from ${context.authData.saleorApiUrl}`);

  if (!product) {
    return;
  }

  try {
    await updateProduct(product.id);
    logger.info(`Product updated: ${product.name}`);
  } catch (err) {
    logger.error(err);
  } finally {
    res.status(200).end();
  }
});
