import pino from "pino";
import { loggerConfig } from "./config";

export const logger = pino({
  level: loggerConfig.level,
  transport: loggerConfig.isDev
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "yyyy-mm-dd HH:MM:ss",
          ignore: "pid,hostname",
        },
      }
    : undefined,
});
