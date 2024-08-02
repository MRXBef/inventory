import { Op } from 'sequelize'
import Items from '../model/ItemsModel.js'

export const addItem = async(req, res) => {
    //list category [foods = FOO****, drinks = DRI****, bathroom = BAT****, kitchen = KIT****]
    const {name, category, price, stock, discount} = req.body

    if(!name || !price || !stock) return res.status(400).json({msg: "name, price or stock field are required!"})

    if(discount > 100) return res.status(400).json({msg: "Discount most in range 0 - 100 %"})
    const convDiscount = parseFloat(discount) / 100

    async function createItemCode(_category) {
        let code
        let isUnique = false

        while(!isUnique){
            switch (category) {
                case "foods":
                    code = `FOO${Math.floor(Math.random() * 9000) + 1000}`
                    break;
                case "drinks":
                    code = `DRI${Math.floor(Math.random() * 9000) + 1000}`
                    break;
                case "bathroom":
                    code = `BAT${Math.floor(Math.random() * 9000) + 1000}`
                    break;
                case "kitchen":
                    code = `KIT${Math.floor(Math.random() * 9000) + 1000}`
                    break;
                default:
                    break;
            }
            const checkDuplicateDb = await Items.findOne({
                where: {
                    code: code
                }
            })
            if(!checkDuplicateDb) isUnique = true
        }

        return code
    }
    
    const toUpperCaseFirstStr = (str) => {
        let arr = [], finalArr = []
        str.split(' ').forEach(element => {
              arr.push(element)
        });
        arr.forEach(e => {finalArr.push(e.replace(/^\w/, (c) => c.toUpperCase()))})
      return finalArr.join(' ')
    }

    try {
        const validCode = await createItemCode(category)
        await Items.create({
            code: validCode.toUpperCase(),
            name: name,
            category: category,
            price: price,
            stock: stock,
            discount: convDiscount ?? 0
        })

        const itemData = await Items.findAll({
            where: {category: category}
        })
        res.status(200).json({
            msg: `${name.toUpperCase()} Successfully added`,
            dataView: itemData,
            activeButton: toUpperCaseFirstStr(category)

        })
    } catch (error) {
        console.log(error)
        res.status(500).json({msg: "Internal server error"})
    }
}

export const getAllItem = async(req, res) => {
    try {
        const get = await Items.findAll({
            attributes: ['code', 'name', 'category', 'price', 'price', 'stock', 'discount']
        })
        return res.status(200).json({data: [...get]})
    } catch (error) {
        console.log(error)
        res.status(500).json({msg: "Internal server error"})
    }
}

export const getFoods = async(req, res) => {
    try {
        const get = await Items.findAll({
            where: {
                category: 'foods'
            },
            attributes: ['code', 'name', 'category', 'price', 'price', 'stock', 'discount']
        })
        return res.status(200).json({data: [...get]})
    } catch (error) {
        console.log(error)
        res.status(500).json({msg: "Internal server error"})
    }
}

export const getDrinks = async(req, res) => {
    try {
        const get = await Items.findAll({
            where: {
                category: 'drinks'
            },
            attributes: ['code', 'name', 'category', 'price', 'price', 'stock', 'discount']
        })
        return res.status(200).json({data: [...get]})
    } catch (error) {
        console.log(error)
        res.status(500).json({msg: "Internal server error"})
    }
}

export const getBathroom = async(req, res) => {
    try {
        const get = await Items.findAll({
            where: {
                category: 'bathroom'
            },
            attributes: ['code', 'name', 'category', 'price', 'price', 'stock', 'discount']
        })
        return res.status(200).json({data: [...get]})
    } catch (error) {
        console.log(error)
        res.status(500).json({msg: "Internal server error"})
    }
}

export const getKitchen = async(req, res) => {
    try {
        const get = await Items.findAll({
            where: {
                category: 'kitchen'
            },
            attributes: ['code', 'name', 'category', 'price', 'price', 'stock', 'discount']
        })
        return res.status(200).json({data: [...get]})
    } catch (error) {
        console.log(error)
        res.status(500).json({msg: "Internal server error"})
    }
}

export const updateItem = async(req, res) => {
    const {name, price, stock, discount} = req.body
    const itemCode = req.params['kode']

    try {
        const item = await Items.findOne({
            where: {
                code: itemCode
            }
        })
        if(!item) return res.status(400).json({msg: "Item not found!"})

        await item.update({
            name: name || item.name,
            price: price || item.price,
            stock: stock || item.stock,
            discount: discount || item.discount
        })

        res.status(200).json({msg: "Data updated!"})
    } catch (error) {
        console.log(error)
        res.status(500).json({msg: "Internal server error"})
    }

}

export const deleteItem = async(req, res) => {
    const itemCode = req.params['kode']
    const {dataView} = req.body
    console.log(dataView)
    if(!itemCode || !dataView) return res.status(400).json({msg: "error"})
    const attr = ['code', 'name', 'category', 'price', 'price', 'stock', 'discount']

    try {
        const item = await Items.findOne({
            where: {
                code: itemCode
            }
        })
        if(!item) return res.status(400).json({msg: "Item not found"})
        
        await item.destroy()

        let itemData = []
        if(dataView == 'All Category'){
            itemData = await Items.findAll({
                attributes: attr
            })
        }else if(dataView != 'All Category' && dataView != 'Foods' && dataView != 'Drinks' && dataView != 'Kitchen' && dataView != 'Bathroom') {
            itemData = await Items.findAll({
                where: {
                    [Op.or] : {
                        name : {
                            [Op.like] : `%${dataView}%`
                        },
                        code : {
                            [Op.like] : `%${dataView}%`
                        }
                    }
                },
                attributes: attr
            })
        }else {
            itemData = await Items.findAll({
                where: {category : dataView},
                attributes: attr
            })
        }

        res.status(200).json({
            msg: `"${item.name.toUpperCase()}" Deleted`,
            dataView: itemData
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({msg: "Internal server error"})
    }
}

export const addStock = async(req, res) => {
    const {stockAdded, dataView} = req.body
    if(!stockAdded) return res.status(400).json({msg: "Stock is required"})
    const itemCode = req.params['kode']
    const attr = ['code', 'name', 'category', 'price', 'price', 'stock', 'discount']

    try {
        const item = await Items.findOne({
            where: {
                code: itemCode
            }
        })
        if(!item) return res.status(400).json({msg: "Item not found"})

        item.stock += parseInt(stockAdded)
        await item.save()

        let itemData = []
        if(dataView == 'All Category'){
            itemData = await Items.findAll({
                attributes: attr
            })
        }else if(dataView != 'All Category' && dataView != 'Foods' && dataView != 'Drinks' && dataView != 'Kitchen' && dataView != 'Bathroom') {
            itemData = await Items.findAll({
                where: {
                    [Op.or] : {
                        name : {
                            [Op.like] : `%${dataView}%`
                        },
                        code : {
                            [Op.like] : `%${dataView}%`
                        }
                    }
                },
                attributes: attr
            })
        }else {
            itemData = await Items.findAll({
                where: {category : dataView},
                attributes: attr
            })
        }

        res.status(200).json({
            msg: `"${item.name.toUpperCase()}" Stock Changed to ${item.stock}`,
            data: item.stock,
            dataView : itemData
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({error: error.message})
    }
}

export const searchItem = async(req, res) => {
    const {value} = req.body
    if(!value) return res.status(400).json({msg: "Must insert a value"})
    try {
        const item = await Items.findAll({
            attributes: ['code', 'name', 'category', 'stock', 'discount', 'price'],
            where: {
                [Op.or] : {
                    name : {
                        [Op.like] : `%${value}%`
                    },
                    code : {
                        [Op.like] : `%${value}%`
                    }
                }
            }
        })
        if(item.length < 1) return res.status(403).json({msg: "Item not found"})
        res.status(200).json({data: item})
   } catch (error) {
        console.log(error)
        res.status(500).json({error: error.message})
    }
}