import express from 'express'
import db from './config/Databse.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import router from './router/index.js'
// import bestSeller from './model/bestSellerModel.js'

const app = express()

try {
    await db.authenticate()
    console.log("Database connected")
    // await db.sync(bestSeller)
} catch (error) {
    console.log(error)
}

app.use(cors({credentials: true, origin: "http://localhost:5173"}))
app.use(cookieParser())
app.use(express.json())
app.use(router)

app.listen(5000, () => {console.log("Server running at port 5000")})