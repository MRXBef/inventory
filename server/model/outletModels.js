import { DataTypes } from "sequelize"
import db from "../config/Databse.js"

const Outlet = db.define(
    'outlet',
    {
        name: {
            type: DataTypes.STRING,
            allowNull : false
        },
        address: {
            type: DataTypes.STRING,
            allowNull : false
        },
        phone: {
            type: DataTypes.STRING
        },
    }
)

export default Outlet