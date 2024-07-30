import express from 'express'
import db from './config/Databse.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import router from './router/index.js'
import orderRecords from './model/orderRecordModel.js'
import Items from './model/ItemsModel.js'
import Orders from './model/ordersModel.js'
import Outlet from './model/outletModels.js'

const app = express()

try {
    await db.authenticate()
    console.log("Database connected")
    // await db.sync(orderRecords)
    // await db.sync(Items)
    // await db.sync(Orders)
    // await db.sync(Outlet)
} catch (error) {
    console.log(error)
}

app.use(cors({credentials: true, origin: "http://localhost:5173"}))
app.use(cookieParser())
app.use(express.json())
app.use(router)

app.listen(5000, () => {console.log("Server running at port 5000")})