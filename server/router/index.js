import express from "express";
import { addItem, getAllItem, getFoods, getDrinks, getBathroom, getKitchen, updateItem, deleteItem, addStock, searchItem } from "../controllers/Items.js";
import {getTurnCode, getRecordsByTurnCode, createRecordOrder, createFinalOrder, changePriceForSelectedItem, deleteRecordOrder} from "../controllers/orders.js"
import {getTotalOfItemsStock, getTotalOFItemsProduct, getTodayOrders, getTodayIncomes, getLast6DaysIncomes, getBestSeller} from "../controllers/dashboard.js"

const router = express.Router()

router.post('/items', addItem)
router.put('/items/:kode', updateItem)
router.delete('/items/:kode', deleteItem)
router.get('/items', getAllItem)

router.put('/items/stock/:kode', addStock)
router.get('/items/bestseller', getBestSeller)

//get item berdasarkan kategori
router.get('/items/foods', getFoods)
router.get('/items/drinks', getDrinks)
router.get('/items/bathroom', getBathroom)
router.get('/items/kitchen', getKitchen)

router.post('/items/search', searchItem)

router.get('/record/code', getTurnCode)
router.get('/record/turncode/:turnCode', getRecordsByTurnCode)
router.post('/record', createRecordOrder)
router.post('/record/changePrice', changePriceForSelectedItem)
router.delete('/record/:recordId', deleteRecordOrder)
router.post('/orders', createFinalOrder)

router.get('/dashboard/stock', getTotalOfItemsStock)
router.get('/dashboard/items', getTotalOFItemsProduct)
router.get('/dashboard/todayOrders', getTodayOrders)
router.get('/dashboard/todayIncome', getTodayIncomes)
router.get('/dashboard/last6DaysIncome', getLast6DaysIncomes)



export default router