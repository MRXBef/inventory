import React, { useEffect } from 'react'
import axios from 'axios'
import { useState } from 'react'
import CIcon from '@coreui/icons-react';
import * as icon from '@coreui/icons';

const Orders = () => {
    const [ordersData, setOrdersData] = useState([])
    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async() => {
        const response = await axios.get(`${import.meta.env.VITE_BASEURL}/dashboard/orders`)
        setOrdersData(response.data)
    }

    const rupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(number).replace('IDR', 'Rp').trim();
    };
    console.log(ordersData)

    return (
        <div className='orders-container'>
            {/* <div className="formOrders">
                <form >
                    <input type="date" style={{width: '300px'}} />
                    <button className="button">Search</button>
                </form>
            </div> */}
            <a href="/" style={{marginLeft: '20px', marginTop: '20px', width: '20px'}}>
                <i style={{color: 'black'}}><CIcon icon={icon.cilMediaStepBackward}/></i>
            </a>
            <div className="viewOrders">
                {ordersData.map((data, index) => (
                    <div key={index} className='orders'>
                        <div className="infoOrders">
                            <p style={{fontWeight: 'bold', color: 'darkorange'}}>{`${data[2].toUpperCase()} ~ [${rupiah(data[3])}]`}</p>
                            <div style={{display: 'flex', gap: '5px'}}>
                                <i style={{color: 'white'}}><CIcon icon={icon.cilClock}/></i>
                                <p>{data[1]}</p>
                            </div>
                        </div>
                        <div className='itemOrders'>
                            {data[0].map((item, i) => (
                                <div key={i} className='itemOrder'>
                                    <p>{item.itemName.toUpperCase()}</p>
                                    <p>{`x ${item.quantity}`}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Orders