import {DataTypes} from "sequelize";
import db from '../config/Databse.js'

const Items = db.define(
    'items',
    {
        code: {
            type: DataTypes.STRING,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        stock: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        discount: {
            type: DataTypes.FLOAT,
            allowNull: true
        }
    }
)

export default Items