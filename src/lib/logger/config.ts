export const loggerConfig = {
  level: process.env.LOG_LEVEL ?? "info",
  isDev: process.env.NODE_ENV !== "production",
};
