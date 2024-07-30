import Outlet from "../model/outletModels.js"
import { Op } from "sequelize"

export const addOutlet = async(req, res) => {
    const {name, address, phone} = req.body
    if(!name || !address) return res.status(400).json({msg: "Name or address are required!"})

    try {
        const checkIsDuplicate = await Outlet.findOne({
            where: {name: name}
        })
        if(checkIsDuplicate) return res.status(400).json({msg: "Outlet is already exists"})

        await Outlet.create({
            name: name,
            address: address,
            phone: phone
        })
        res.status(200).json({msg: "Outlet successfully created"})
    } catch (error) {
        console.log(error.message)
        res.status(500).json({msg: "Internal server error"})
    }
}

export const deleteOutlet = async(req, res) => {
    const outletId = req.params['outletId']
    if(!outletId) return res.status(400).json({msg: "Outlet id required"})

    try {
        const outlet = await Outlet.findOne({
            where: {id: outletId}
        })
        if(!outlet) return res.status(403).json({msg: "Outlet not found"})

        await outlet.destroy()
        return res.status(200).json({
            msg: "Outlet successfully deleted",
            data: {
                "name" : outlet.name, 
                "address" : outlet.address, 
                "phone" : outlet.phone
            }
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({msg: "Internal server error"})
    }
}