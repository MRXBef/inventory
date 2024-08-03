import React from 'react'
import Sidebar from './Sidebar'
import outletBackground from '../assets/img/outletBackground.jpeg'
import CIcon from '@coreui/icons-react'
import * as icon from '@coreui/icons'
import axios from 'axios'
import { useState } from 'react'
import { useEffect } from 'react'

const Outlet = () => {
    const [outlets, setOutlets] = useState([])
    const [msg, setMsg] = useState(null)

    useEffect(() => {
        getOutlet()
    }, [])

    const getOutlet = async() => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASEURL}/outlet`)
            console.log(response)
            if(response){
                setOutlets(response.data.data)
            }
        } catch (error) {
            console.log(error)
            setMsg({msg: error.response.data.msg, color: 'red'})
        }
    }
  return (
    <div className='is-flex'>
        <Sidebar/>

        {msg ? 
            <>
                <div className='messages' style={{ backgroundColor: msg.color }}>
                    <p>{msg.msg}</p>
                    <p style={{display: 'none'}}>
                        {setTimeout(() => {setMsg(null)}, 3000)}
                    </p>
                </div>
            </>
            :
            ''
        }

        <div className='outletContainer'>
            <div className="outletHeader">
                <div className="judul">
                    <h1>Outlet</h1>
                </div>
            </div>
            <div className="outletContent">
                {
                    outlets.map((outlet, index) => (
                        <div key={index} className="outletBox">
                            <i style={{position: 'absolute', top: '10px', right: '10px', padding: '10px', backgroundColor: 'darkorange', borderRadius: '10px', display: 'flex', justifyContent: 'center', cursor: 'pointer'}}><CIcon icon={icon.cilPen}/></i>
                            <img src={outletBackground}/>
                            <div style={{display: 'flex', gap: '5px'}}>
                                <i style={{marginTop: '5px'}}>
                                    <CIcon icon={icon.cilHouse}/>
                                </i>
                                <h1 style={{fontSize: '25px', color: 'darkorange'}}>{outlet.name}</h1>
                            </div>
                            <div style={{display: 'flex', gap: '5px', marginBottom: '55px'}}>
                                <i >
                                    <CIcon icon={icon.cilLocationPin}/>
                                </i>
                                <p>{outlet.address}</p>
                            </div>
                            <div style={{display: 'flex', gap: '5px', position: 'absolute', bottom: '25px', borderTop: '1px solid grey', width: '85%', paddingTop: '10px'}}>
                                <i >
                                    <CIcon style={{color: 'green'}} icon={icon.cilPhone}/>
                                </i>
                                <p>{outlet.phone}</p>
                                <a href={`https://wa.me/+62${outlet.phone}`} target="_blank" className='button' style={{height: '30px', marginTop: '-5px', backgroundColor: 'green', outlet: 'none', border: 'none', position: 'absolute', left: '220px', bottom: '-13px', padding: '20px'}}>
                                    <i style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}><CIcon icon={icon.cilChatBubble}/></i>
                                </a>
                            </div>
                        </div>
                    ))
                }
                
            </div>
        </div>
    </div>
  )
}

export default Outlet