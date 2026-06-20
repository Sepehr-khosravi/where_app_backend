import { ConfigService } from "@nestjs/config"

const config = new ConfigService();
export const configuration = {
    DATABASE_URL : config.get("DATABASE_URL"),
    PORT : config.get("PORT"),
    REDIS_HOST : config.get("REDIS_HOST"),
    REDIS_PORT : config.get("REDIS_PORT"),
    JWT_KEY : config.get("JWT_KEY"),
    SMTP_HOST : config.get("SMTP_HOST"),
    SMTP_PORT : config.get("SMTP_PORT"),
    SMTP_USER : config.get("SMTP_USER"),
    SMTP_PASS : config.get("SMTP_PASS"),
    SMTP_FROM : config.get("SMTP_FROM")
}