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
    expireTime: "0.5h",
  },
  port: process.env.PORT,
})
