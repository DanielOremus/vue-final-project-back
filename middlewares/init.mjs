import cookieParser from "cookie-parser"
import logger from "morgan"
import { fileURLToPath } from "url"
import path from "path"
import cors from "cors"
import express from "express"
import expressMongoSanitize from "express-mongo-sanitize"

const __filename = fileURLToPath(import.meta.url) // get the resolved path to the file
const __dirname = path.dirname(__filename) // get the name of the directory
export default (app) => {
  app.set("views", path.join(__dirname, "../views"))
  app.set("view engine", "ejs")

  app.use(
    expressMongoSanitize({
      allowDots: true,
    })
  )

  app.use(logger("dev"))
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  app.use(cookieParser())
  app.use(express.static(path.join(__dirname, "public")))

  //Cors
  const corsOptions = {
    origin: "*", // або '*' для всіх доменів
    methods: ["GET", "POST", "PUT", "DELETE"], // Дозволені методи
    allowedHeaders: ["Content-Type", "Authorization"], // Дозволені заголовки
    credentials: true, // Якщо потрібно дозволити cookies
  }
  app.use(cors(corsOptions))
}
