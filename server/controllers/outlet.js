import Outlet from "../model/outletModels.js"
import { Op } from "sequelize"
import Items from "../model/ItemsModel.js"

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

export const getOutlet = async(req, res) => {
    try { 
        const outlet = await Outlet.findAll({
            attributes: ['id', 'name', 'address', 'phone']
        })
        if(outlet.length <= 0) return res.status(403).json({msg: "Outlet belum dibuat"})
        res.status(200).json({
            ...outlet
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({msg: "Internal server error"})
    }
}

export const updateOutlet = async(req, res) => {
    const {outletId, name, address, phone} = req.body
    if(!outletId) return res.status(400).json({msg: "Outlet id are required"})
    try {
        const outlet = await Outlet.findOne({
            where: {id: outletId}
        })
        if(!outlet) return res.status(403).json({msg: "Outlet not found"})
        await outlet.update({
            name: name || outlet.name,
            address: address || outlet.address,
            phone: phone || outlet.phone
        })
        res.status(200).json({msg: "Update outlet successfully"})
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