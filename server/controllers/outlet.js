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

        const outlet = await Outlet.findAll({
            attributes: ['id', 'name', 'address', 'phone'],
            order: [
                ['createdAt', 'DESC']
            ]
        })
        res.status(200).json({
            msg: "Outlet successfully created",
            data: outlet
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({msg: "Internal server error"})
    }
}

export const getOutlet = async(req, res) => {
    try { 
        const outlet = await Outlet.findAll({
            attributes: ['id', 'name', 'address', 'phone'],
            order: [
                ['createdAt', 'DESC']
            ]
        })
        if(outlet.length <= 0) return res.status(403).json({msg: "Outlet belum dibuat"})
        res.status(200).json({
            data: outlet
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
        const findDuplicateNameOutlet = await Outlet.findAll({
            where: {name: name}
        })
        if(findDuplicateNameOutlet.length > 0 && findDuplicateNameOutlet[0].dataValues.name !== name) return res.status(409).json({msg: `Outlet for ${name} already exists`})
        const outlet = await Outlet.findOne({
            where: {id: outletId}
        })
        if(!outlet) return res.status(403).json({msg: "Outlet not found"})
        await outlet.update({
            name: name || outlet.name,
            address: address || outlet.address,
            phone: phone || outlet.phone
        })

        const outlets = await Outlet.findAll({
            attributes: ['id', 'name', 'address', 'phone'],
            order: [
                ['createdAt', 'DESC']
            ]
        })
        res.status(200).json(
            {msg: "Update outlet successfully",
            data: outlets
        })
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

        const outlets = await Outlet.findAll({
            attributes: ['id', 'name', 'address', 'phone'],
            order: [
                ['createdAt', 'DESC']
            ]
        })
        res.status(200).json({
            msg: `${outlet.name} successfully Deleted`,
            data: outlets
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({msg: "Internal server error"})
    }
}

export const searchOutlet = async(req, res) => {
    const {value} = req.body
    if(!value) return res.status(400).json({msg: "Value required"})

    try {
        const outlets = await Outlet.findAll({
            where: {
                [Op.or]: {
                    name: {
                        [Op.like] : `%${value}%`
                    },
                    address: {
                        [Op.like] : `%${value}%`
                    },
                    phone: {
                        [Op.like] : `%${value}%`
                    }
                }
            },
            attributes: ['id', 'name', 'address', 'phone'],
            order: [
                ['createdAt', 'DESC']
            ]
        })
        if(outlets.length <= 0) return res.status(404).json({msg: "Outlet's not found"})

        res.status(200).json({
            data: outlets
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({msg: "Internal server error"})
    }
}
