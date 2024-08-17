import React, { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import axios from 'axios'
import '../index.css'

const Cashier = () => {
    const [msg, setMsg] = useState(null)
    const [recordCode, setRecordCode] = useState('')
    const [productCode, setProductCode] = useState('')
    const [quantity, setQuantity] = useState('')
    const [records, setRecords] = useState([])
    const [total, setTotal] = useState('')
    const [cash, setCash] = useState('')
    const [returns, setReturns] = useState('_____________')
    const [discount, setDiscount] = useState('_____________')
    const [outlet, setOutlet] = useState({id: null, name: ''})
    const [formattedCash, setFormattedCash] = useState('');
    const [productList, setProductList] = useState([]) // S tate untuk daftar produk hasil pencarian
    const [showDropdownProductCode, setShowDropdownProductCode] = useState(false) // State untuk menampilkan dropdown
    const [outletList, setOutletList] = useState([]) // S tate untuk daftar produk hasil pencarian
    const [showDropdownOutlet, setShowDropdownOutlet] = useState(false) // State untuk menampilkan dropdown
    const [isStoreClicked, setIsStoreClicked] = useState(false) // State untuk tombol Store

    useEffect(() => {
        getTurnCode()
    }, [])

    useEffect(() => {
        if(recordCode) {
            getRecords()
        }
    }, [recordCode])

    const rupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(number).replace('IDR', 'Rp').trim();
    };

    const getTurnCode = async() => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASEURL}/record/code`)
            setRecordCode(response.data.turn_code)
        } catch (error) {
            console.log(error)
            setMsg({msg: error.response.data.msg, color: 'red'})
        }
    }

    const record = async(e) => {
        e.preventDefault()
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASEURL}/record`, {
                turnCode: recordCode,
                itemCode: productCode,
                quantity: quantity
            })
            if(response){
                setProductCode('')
                setQuantity('')
                getRecords()
            }
        } catch (error) {
            if(error.response) {
                console.log(error.response.data.msg)
                setMsg({msg: error.response.data.msg, color: 'red'})
            }
        }
    }

    const getRecords = async() => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASEURL}/record/turncode/${recordCode}`)
            setRecords(response.data.data)
            if(response){
                let price = []
                const items =  response.data.data
                items.forEach(item => {
                    price.push(item.finalPrice)
                })
                const totalPrice = price.reduce((acc, val) => acc + val, 0)
                setTotal(rupiah(totalPrice))
            }
    
        } catch (error) {
            console.log(error)
            setMsg({msg: error.response.data.msg, color: 'red'})
        }
    }

    const storeOrders = async(e) => {
        e.preventDefault()

        try {
            const response = await axios.post(`${import.meta.env.VITE_BASEURL}/orders`, {
                turnCode: recordCode,
                cash: cash,
                outlet: outlet.id
            })
            if(response){
                setReturns(rupiah(response.data.data.cashReturn))
                setDiscount(rupiah(response.data.data.sumDiscount))
                setIsStoreClicked(true)
                setMsg({msg: response.data.msg, color: 'green'})

                //membuat recipt
                createRecipt(response.data.recipt)
            }
        } catch (error) {
            console.log(error.response)
            setMsg({msg: error.response.data.msg, color: 'red'})
        }
    }

    const createRecipt = (datas) => {
        datas.forEach(data => {
            console.log(`${data.itemName} : ${data.finalPrice}`)
        })
    }

    const handleRefresh = () => {
        window.location.reload()
    }

    const searchProducts = async(query) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASEURL}/items/search`, {
                value: query
            })
            if(response) {
                setProductList(response.data.data)
                setShowDropdownProductCode(true)
            }
        } catch (error) {
            console.log(error.response)
            setProductList([])
            setShowDropdownProductCode(false)
        }
    }

    const handleProductCodeChange = (e) => {
        const value = e.target.value
        setProductCode(value)
        if(value.length > 1) {
            searchProducts(value)
        } else {
            setShowDropdownProductCode(false)
        }
    }

    const handleSelectProduct = (product) => {
        setProductCode(product.code)
        setShowDropdownProductCode(false)
    }

    const searchOutlet = async(query) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASEURL}/outlet/search`, {
                value: query
            })
            if(response){
                setOutletList(response.data.data)
                setShowDropdownOutlet(true)
            }
        } catch (error) {
            console.log(error.response)
            setOutletList([])
            setShowDropdownOutlet(false)
        }
    }

    const handleOutletChange = (e) => {
        const value = e.target.value
        setOutlet({id: null, name: value})
        if(value.length > 1) {
            searchOutlet(value)
        } else {
            setShowDropdownOutlet(false)
        }
    }

    const handleSelectOutlet = (outlet) => {
        setOutlet({id: outlet.id, name: outlet.name})
        setShowDropdownOutlet(false)
    }

    const handlePriceOnChange = async (e, id) => {
        e.preventDefault()
        
        const formattedValue = e.target.value;
        const rawValue = formattedValue.replace(/\D/g, '');
        const newPrice = Number(rawValue);

        try {
            const response = await axios.post(`${import.meta.env.VITE_BASEURL}/record/changePrice`, {
                itemId: id,
                newPrice: newPrice
            });
            if (response) {
                getRecords();
            }
        } catch (error) {
            console.log(error.response)
            setMsg({msg: error.response.data.msg, color: 'red'})
        }
    };

    const handleFormattedPriceChange = (e, id) => {
        const rawValue = e.target.value.replace(/\D/g, '');
        const formattedValue = rupiah(rawValue);
        setRecords((prevRecords) =>
            prevRecords.map((record) =>
                record.id === id ? { ...record, price: rawValue, formattedPrice: formattedValue } : record
            )
        );
    };

    const handleFormattedCashChange = (e) => {
        const rawValue = e.target.value.replace(/\D/g, '');
        const formattedValue = rupiah(rawValue);
        setCash(rawValue);
        setFormattedCash(formattedValue);
    };

    const handleCashOnChange = () => {
        const newCash = Number(cash);
        setCash(newCash);
        setFormattedCash(rupiah(newCash));
    };
    
    const handleDeleteRecord = async(recordId) => {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_BASEURL}/record/${recordId}`)
            if(response) {
                getRecords()
            }
        } catch (error) {
            console.log(error.response)
            setMsg({msg: error.response.data.msg, color: 'red'})
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
        width: '400px',
        overflow: 'hidden'
    }
    const totalBayar = {
        fontSize: '40px',
        color: 'black',
        fontWeight: 'bold',
    }
    const totalKembalian = {
        fontSize: '30px',
        color: 'green',
        fontWeight: 'bold',
        marginRight: '20px'
    }
    const returnAndDiscountStyle = {
        position: 'absolute',
        right: '0px'
    }

    const dropdownStyle = {
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        gap: '10px',
        backgroundColor: 'black',
        width: '580px',
        maxHeight: '200px',
        overflow: 'scroll',
        padding: '10px 0px 10px 0px',
        marginTop: '40px'
    }

    const dropdownStyleOutlet = {
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        gap: '10px',
        backgroundColor: 'black',
        width: '580px',
        maxHeight: '200px',
        overflow: 'scroll',
        padding: '10px 0px 10px 0px',
        marginTop: '40px'
    }

    return (
        <div className='is-flex'>
            <Sidebar/>
            {msg ? 
            <>
                <div className='messages' style={{backgroundColor: msg.color}}>
                    <p>{msg.msg}</p>
                    <p style={{display: 'none'}}>
                        {setTimeout(() => {setMsg(null)}, 3000)}
                    </p>
                </div>
            </>
            :
            ''
            }

            <div className='myCashierContainer'>
                <div className="judul">
                    <h1>Cashier</h1>
                </div>
                <div className="formContainer">
                    <form onSubmit={record} className='is-flex codeForm'>
                        <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
                            <input 
                                type="text" 
                                className='input' 
                                placeholder='Search Item with code or name of product' 
                                value={productCode} 
                                onChange={handleProductCodeChange}
                            />
                            {showDropdownProductCode && (
                                <ul className="dropdown" style={dropdownStyle}>
                                    {productList.map((product) => (
                                        <li style={{cursor: 'pointer', color: 'green'}} key={product.code} onClick={() => handleSelectProduct(product)}>
                                            [{product.code}] <span style={{color: 'white'}}>{product.name.toUpperCase()} ~ ({rupiah(product.price)})</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <input style={quantityStyle} type="number" className='input' placeholder='Quantity' value={quantity} onChange={(e) => setQuantity(e.target.value)}/>
                        <button style={addButtonStyle} className='button is-success'>+</button>
                    </form>
                    
                </div>
                <div className="orderView">
                    <table style={tableStyle} className="table">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Code</th>
                                <th style={{width: '400px'}}>Product Name</th>
                                <th>Unit Price</th> 
                                <th>Quantity</th> 
                                <th>Sub Total</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                records.map((record, index) => (
                                    <tr key={index}>
                                        <th>{index + 1}</th>
                                        <td>{record.itemCode}</td>
                                        <td style={nameTableStyle}>{record.itemName.toUpperCase()}</td>
                                        <td>
                                            <input 
                                                style={{padding: '5px', fontSize: '13px'}} 
                                                type="text" 
                                                value={record.formattedPrice || rupiah(record.price)} 
                                                onChange={(e) => handleFormattedPriceChange(e, record.id)}
                                                onBlur={(e) => handlePriceOnChange(e, record.id)}
                                            />
                                        </td>
                                        <td>x {record.quantity}</td>
                                        <td>{rupiah(record.finalPrice)} <span style={{color: 'red'}}>{record.discount > 0 ? `(-${record.discount * 100}%)` : ''}</span></td>
                                        <td>
                                            <button 
                                            className='button' style={{height: '30px'}}
                                            onClick={() => handleDeleteRecord(record.id)}
                                            >
                                                Hapus
                                            </button>
                                        </td>
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
                            <input 
                                style={quantityStyle} 
                                type="text" 
                                className='input' 
                                placeholder='Cash' 
                                value={formattedCash || cash} 
                                onChange={handleFormattedCashChange} 
                                onBlur={handleCashOnChange} 
                            />
                            <div style={{display: 'flex', flexDirection: 'column', width: '100%', marginLeft: '2px'}}>
                                <input 
                                    type="text" 
                                    className='input' 
                                    placeholder='Search Outlet' 
                                    value={outlet.name}
                                    onChange={handleOutletChange}
                                />
                                {showDropdownOutlet && (
                                        <ul className="dropdown" style={dropdownStyleOutlet}>
                                            {outletList.map((outlet) => (
                                                <li style={{cursor: 'pointer', color: 'white'}} key={outlet.id} onClick={() => handleSelectOutlet(outlet)}>
                                                    {outlet.name.toUpperCase()}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                            </div>
                            <button style={addButtonStyle} className='button is-success' disabled={isStoreClicked}>
                                Create Order
                            </button>
                    </form>
                    {isStoreClicked && (
                        <button onClick={handleRefresh} className='button is-danger' style={{...addButtonStyle, marginTop: '10px', backgroundColor: 'green', width: '100px', height: '100px', position: 'absolute', marginLeft: ''}}>Refresh</button>
                    )}
                    <div style={returnAndDiscountStyle} className='is-flex mt-5'>
                        <h1 style={totalKembalian}>Return <br />{returns}</h1>
                        <h1 className='ml-5' style={totalKembalian}>Discount <br />{discount}</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cashier
