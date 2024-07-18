import Sequelize from "sequelize";

const db = new Sequelize ('inventory', 'root', '', {
    host: "localhost",
    dialect: "mysql",
    // dialectOptions:{useUTC:false},
    timezone:"+08:00"
})

export default db