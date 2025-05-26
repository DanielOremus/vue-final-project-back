import express from "express"
import connectDB from "./db/connectDB.mjs"
import routes from "./api/v1/routes/index.mjs"
import init from "./middlewares/init.mjs"
const app = express()

//Connecting to DB
connectDB()

//App Init
init(app)

//Adding routes
app.use("/v1", routes)

export default app
