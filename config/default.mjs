import { configDotenv } from "dotenv"
configDotenv()

export const config = Object.freeze({
  db: {
    databaseName: process.env.DB_NAME,
    databaseUrl: process.env.DB_URL,
    mongoURI: `${process.env.DB_URL}/${process.env.DB_NAME}`,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expireTime: "1h",
  },
  port: process.env.PORT,
  fallbackLocale: process.env.FALLBACK_LOCALE,
})
