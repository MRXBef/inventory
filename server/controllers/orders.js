import Orders from '../model/ordersModel.js'
import OrderRecordModel from '../model/orderRecordModel.js'
import Items from '../model/ItemsModel.js'
import {Op} from 'sequelize'
import orderRecords from '../model/orderRecordModel.js'

export const getTurnCode = async(req, res) => {
    const date = new Date()

    try {
        const turnCode = `${date.getDate()}${date.getMonth()}${date.getFullYear()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}`
        res.status(200).json({turn_code: turnCode})
    } catch (error) {
        console.log(error)
        res.status(500).json({msg: "Internal server error"})
    }
}

export const getRecordsByTurnCode = async(req, res) => {
    const turnCode = req.params['turnCode']

    try {
        const records = await OrderRecordModel.findAll({
            attributes: ['id', 'itemCode', 'itemName', 'price', 'quantity', 'discount', 'finalPrice'],
            where: {
                turnCode: turnCode
            }
        })
        res.status(200).json({data: [...records]})
    } catch (error) {
        console.log(error)
        res.status(500).json({msg: "Internal server error"})  
    }
}

export const changePriceForSelectedItem = async(req, res) => {
    const {itemId, newPrice} = req.body
    if(!itemId || !newPrice) return res.status(400).json({ msg: "Item ID and new price are required"})

    try {
        const itemRecord = await orderRecords.findOne({
            where: {id: itemId}
        })
        if(!itemRecord) return res.status(403).json({msg: "Item not found!"})

        itemRecord.price = newPrice
        if(itemRecord.discount > 0) {
            const discountAmount = newPrice * itemRecord.discount;
            itemRecord.finalPrice = (newPrice - discountAmount) * itemRecord.quantity;
        }else{
            itemRecord.finalPrice = itemRecord.quantity * newPrice
        }
        await itemRecord.save()

        return res.status(200).json({msg: "Price Record Updated Successfully!"})
    } catch (error) {
        console.log(error)
        res.status(500).json({msg: "Internal server error"})          
    }
}

export const createRecordOrder = async(req, res) => {
    const {turnCode, itemCode, quantity} = req.body
    if(!turnCode || !itemCode || !quantity){
        return res.status(400).json({msg: "All field are required!"})
    }

    try {
        const item = await Items.findOne({
            where: {
                code: itemCode.toUpperCase()
            }
        })
        if(!item) {
            return res.status(400).json({msg: "Item not found"}) 
        }else if(item.dataValues.stock == 0){
            return res.status(400).json({msg: "Out of stock"}) 
        }else if(item.dataValues.stock < quantity) {
            return res.status(400).json({msg: "Stock not enought"})
        } 

        const checkItemIsRecorded = await orderRecords.findOne({
            where: {
                [Op.and] : {
                    turnCode: turnCode,
                    itemCode: itemCode
                }
            }
        })
        if(checkItemIsRecorded) {
            const newQuantity = checkItemIsRecorded.quantity += Number(quantity)
            if(checkItemIsRecorded.discount > 0){
                const discountAmmount = checkItemIsRecorded.price * checkItemIsRecorded.discount
                checkItemIsRecorded.finalPrice = (checkItemIsRecorded.price - discountAmmount) * newQuantity
            }else{
                checkItemIsRecorded.finalPrice = checkItemIsRecorded.price * newQuantity
            }
            await checkItemIsRecorded.save()
            return res.status(208).json({msg: "Order record already created!"})
        }

        const itemName = item.dataValues.name
        const price = item.dataValues.price
        const discount = item.dataValues.discount
        const finalPrice = (price - (discount * price)) * quantity
        
        await OrderRecordModel.create({
            turnCode: turnCode.toUpperCase(),
            itemName: itemName,
            itemCode: itemCode,
            price: price,
            quantity: quantity,
            discount: discount,
            finalPrice: finalPrice
        })

        res.status(201).json({msg: "Order record created"})
    } catch (error) {
        console.log(error)
        res.status(500).json({msg: "Internal server error"})
    }
}

export const deleteRecordOrder = async(req, res) => {
    const recordId = req.params['recordId']
    if(!recordId) return res.status(400).json({msg: "Record id is reuired!"})

    try {
        const item = await orderRecords.findOne({
            where: {
                id: recordId
            }
        })
        if(!item) return res.status(403).json({msg: "Order record not found"})
        
        await item.destroy()
        res.status(200).json({msg: "Record successfully deleted"})
    } catch (error) {
        console.log(error)
        res.status(500).json({msg: "Internal server error"})
    }
}


export const createFinalOrder = async(req, res) => {
    const {turnCode, cash, outlet} = req.body
    if(!cash || !outlet) return res.status(400).json({msg: "Cash and Outlet required"})
    
try {
    const recordsOrdered = await OrderRecordModel.findAll({
        where: {
            turnCode: turnCode
        }
    })
    if(recordsOrdered.length <= 0) return res.status(400).json({msg: "No item added yet"})

    //membuat gabungan item dan membuat total diskon (start)
    let items = []
    let discountItems = []

    recordsOrdered.forEach(element => {
        items.push(`${element.dataValues.itemCode}:${element.dataValues.quantity}`)
        discountItems.push(element.dataValues.itemCode)
    })
    
    const encItems = items.join(",")
    discountItems.join(',')

    const findPriceAndDiscount = await Items.findAll({
        attributes: ['price', 'discount'],
        where: {
            code: {
                [Op.or]: [discountItems]
            }
        }
    })

    let totalDiscount = []

    findPriceAndDiscount.forEach(element => {
        totalDiscount.push(element.dataValues.discount * element.dataValues.price)
    })
    
    const sumDiscount = totalDiscount.reduce((acc, val) => {
        return acc + val
    })
    //membuat gabungan item dan membuat total diskon (end)

    //membuat pembayaran beserta kembalian (start)
    const getPayment = await OrderRecordModel.findAll({
        attributes: ['finalPrice'],
        where: {
            turnCode: turnCode
        }
    })

    let allPayments = []
    getPayment.forEach(element => {
        allPayments.push(element.dataValues.finalPrice)
    })

    const totalPayment = allPayments.reduce((acc, val) => {
        return acc + val
    })

    if(cash < totalPayment) return res.status(400).json({msg: "Not enought cash"})
    const cashReturn = cash - totalPayment
    //membuat pembayaran beserta kembalian (end)

    //membuat transaksi kode (start)
    const date = new Date()
    const transCode = `${Math.floor(Math.random() * 9000) + 1000}${date.getDate()}${date.getMonth()}${date.getFullYear()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}`
    //membuat transaksi kode (end)

    //membuat orderan (start)
    await Orders.create({
        transCode: transCode,
        items: encItems,
        totalDiscount: sumDiscount,
        totalPayment: totalPayment,
        cash: cash,
        return: cashReturn,
        outlet: outlet,
    })
    //membuat orderan (end)

    //mengupdate stock barang yang di order (start)
    let ordersByRecord = []
    recordsOrdered.forEach(element => {
        ordersByRecord.push(`${element.itemCode},${element.quantity}`)
    })

    for (const element of ordersByRecord) {
        const turnExe = element.split(',');      
        try {
          const item = await Items.findOne({
            where: {
              code: turnExe[0]
            }
          });
          if(item.stock < turnExe[1]) return res.status(400).json({msg: `Stock for ${turnExe[0]} code is not enought`})

          item.stock -= turnExe[1]

          await item.save()
        } catch (error) {
          console.error(error);
        }
    }
    //mengupdate stock barang yang di order (end)

    res.status(200).json({
        msg: "Order successfully created",
        data: {cashReturn, sumDiscount},
        recipt: [...recordsOrdered]
    })
    } catch (error) {
        console.log(error)
        res.status(500).json({msg: "Internal server error"})
    }
}