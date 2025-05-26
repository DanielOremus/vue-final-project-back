import mongoose from "mongoose"
import { config } from "../config/default.mjs"
export default async () => {
  try {
    await mongoose.connect(config.db.mongoURI)
    console.log("Connected to DB successfully")
  } catch (error) {
    console.log("Failed connect to DB")
    console.log(error)
  }
}
