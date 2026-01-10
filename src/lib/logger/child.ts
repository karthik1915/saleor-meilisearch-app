import { logger } from "./instance";

export const createLogger = (context: string, bindings?: Record<string, any>) =>
  logger.child({
    context,
    ...bindings,
  });
