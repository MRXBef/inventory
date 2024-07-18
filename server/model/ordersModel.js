import {DataTypes} from "sequelize";
import db from '../config/Databse.js'

const Orders = db.define(
    'orders',
    {
        transCode: {
            type: DataTypes.STRING,
            allowNull: false
        },
        items: {
            type: DataTypes.STRING,
            allowNull: false
        },
        totalDiscount: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        totalPayment: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        cash: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        return: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
    }
)

export default Orders