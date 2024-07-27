import {DataTypes} from "sequelize";
import db from '../config/Databse.js'

const orderRecords = db.define(
    'orderRecords',
    {
        turnCode: {
            type: DataTypes.STRING,
            allowNull: false
        },
        itemName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        itemCode: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        discount: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        finalPrice: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    }
)

export default orderRecords