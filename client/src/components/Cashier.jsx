import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import Sidebar from './Sidebar'
import axios from 'axios'
import '../index.css'

const Cashier = () => {
    const [recordMsg, setRecordMsg] = useState('')
    const [recordCode, setRecordCode] = useState('')
    const [productCode, setProductCode] = useState('')
    const [quantity, setQuantity] = useState('')
    const [records, setRecords] = useState([])
    const [total, setTotal] = useState('')
    const [cash, setCash] = useState('')
    const [returns, setReturns] = useState('_____________')
    const [discount, setDiscount] = useState('_____________')

    useEffect(() => {
        getTurnCode()
    }, [])

    useEffect(() => {
        if(recordCode) {
            const interval = setInterval(() => {
                getRecords()
            }, 500)
            return () => clearInterval(interval)
        }
    }, [recordCode])

    const rupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(number);
      };

    const getTurnCode = async() => {
        try {
            const response = await axios.get('http://localhost:5000/record/code')
            console.log(response.data.turn_code)
            setRecordCode(response.data.turn_code)
        } catch (error) {
            console.log(error)
        }
    }

    const record = async(e) => {
        e.preventDefault()

        try {
            const response = await axios.post('http://localhost:5000/record', {
                turnCode: recordCode,
                itemCode: productCode,
                quantity: quantity
            })
            if(response) setRecordMsg('')
        } catch (error) {
            if(error.response) {
                console.log(error.response.data.msg)
                console.log(recordCode)
                setRecordMsg(error.response.data.msg)
            }
        }
    }

    const getRecords = async() => {
        try {
            const response = await axios.get(`http://localhost:5000/record/turncode/${recordCode}`)
            setRecords(response.data.data)
    
            let price = []
            const items =  response.data.data
            items.forEach(e => {
                price.push(e.finalPrice)
            })
            const totalPrice = price.reduce((acc, val) => acc + val, 0)

            setTotal(rupiah(totalPrice))
        } catch (error) {
            console.log(error)
        }
    }

    const storeOrders = async(e) => {
        e.preventDefault()

        try {
            const response = await axios.post('http://localhost:5000/orders', {
                turnCode: recordCode,
                cash: cash
            })
            const cashReturn = response.data.data.cashReturn
            const discount = response.data.data.sumDiscount
            setReturns(rupiah(cashReturn))
            setDiscount(rupiah(discount))
        } catch (error) {
            console.log(error.response)
        }
    }

    const quantityStyle = {
        width: '200px',
        marginLeft: '2px'
    }
    const addButtonStyle={
        width: '300px',
        backgroundColor: 'darkorange',
        fontWeight: 'bold',
        color: 'white',
        marginLeft: '10px'
    }
    const tableStyle = {
        width: '100%'
    }
    const nameTableStyle = {
        width: '600px',
        overflow: 'hidden'
    }
    const totalBayar = {
        fontSize: '40px',
        color: 'black',
        fontWeight: 'bold',
        borderBottom: '3px solid lightgray',
    }
    const totalKembalian = {
        fontSize: '30px',
        color: 'green',
        fontWeight: 'bold',
        marginRight: '20px'
    }
    const returnAndDiscountStyle = {
        position: 'relative',
        marginTop: '-100px',
        marginLeft: '650px'
        // top: '685px',
        // left: '850px'
    }
  return (
    <div className='is-flex'>
        <Sidebar/>

        <div className='myCashierContainer'>
            <div className="judul">
                <h1>Cashier</h1>
            </div>
            <div className="formContainer">
                <h1 className='mb-1'>{recordMsg}</h1>
                <form onSubmit={record} className='is-flex codeForm'>
                    <input type="text" className='input' placeholder='Insert Product Code' value={productCode} onChange={(e) => setProductCode(e.target.value)}/>
                    <input style={quantityStyle} type="number" className='input' placeholder='Quantity' value={quantity} onChange={(e) => setQuantity(e.target.value)}/>
                    <button style={addButtonStyle} className='button is-success'>+</button>
                </form>
            </div>
            <div className="orderView">
                <table style={tableStyle} className="table">
                    <thead>
                        <tr>
                            <th><abbr title="Position">No</abbr></th>
                            <th>Code</th>
                            <th>Product Name</th>
                            <th>Quantity</th> 
                            <th>Price</th> 
                        </tr>
                    </thead>
                    <tbody>
                        {
                            records.map((record, index) => (
                                <tr key={index}>
                                    <th>{index + 1}</th>
                                    <td>{record.itemCode}</td>
                                    <td style={nameTableStyle}>{record.itemName.toUpperCase()}</td>
                                    <td>x {record.quantity}</td>
                                    <td>{record.finalPrice}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
            <div className="formContainer">
                <h1 style={totalBayar}>Total: {total}</h1>
                <form onSubmit={storeOrders} className='is-flex codeForm mt-5'>
                        <input style={quantityStyle} type="hidden" value={recordCode} className='input'/>
                        <input style={quantityStyle} type="number" className='input' placeholder='Cash' value={cash} onChange={(e) => setCash(e.target.value)}/>
                        <button style={addButtonStyle} className='button is-success'>Store</button>
                </form>
                <div style={returnAndDiscountStyle} className='is-flex mt-5'>
                    <h1 style={totalKembalian}>Return {returns}</h1>
                    <h1 className='ml-5' style={totalKembalian}>Discount {discount}</h1>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Cashier