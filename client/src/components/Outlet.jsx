import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import outletBackground from '../assets/img/outletBackground2.png';
import CIcon from '@coreui/icons-react';
import * as icon from '@coreui/icons';
import axios from 'axios';

const Outlet = () => {
    const [outlets, setOutlets] = useState([]);
    const [msg, setMsg] = useState(null);
    const [search, setSearch] = useState('');
    const [outlet, setOutlet] = useState({
        name: '',
        address: '',
        phone: ''
    })
    const [hideFormAddProduct, setHideFormAddProduct] = useState('hideFormAddProduct')

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8; // Number of items per page

    useEffect(() => {
        getOutlet();
    }, []);

    const getOutlet = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASEURL}/outlet`);
            if (response) {
                setOutlets(response.data.data);
            }
        } catch (error) {
            console.log(error);
            setMsg({ msg: error.response.data.msg, color: 'red' });
        }
    };

    const handleSearchOutlet = async(e) => {
        e.preventDefault()

        //handleSearch
    }

    const handleAddOutlet = async(e) => {
        e.preventDefault()

        try {
            const response = await axios.post(`${import.meta.env.VITE_BASEURL}/outlet`, {
                name: outlet.name,
                address: outlet.address,
                phone: outlet.phone
            })
            if(response) {
                setMsg({msg: response.data.msg, color: 'green'})
                setOutlets(response.data.data)
                setHideFormAddProduct('hideFormAddProduct')
                setCurrentPage(1)
                setOutlet({name: '', address: '', phone: ''})
            }
        } catch (error) {
            setMsg({msg: error.response.data.msg, color: 'red'})
        }

    }

    const handleDeleteOutlet = async(outletId, outletName) => {
        if(confirm(`Are you sure want to delete ${outletName.toUpperCase()}`) != true) return
        try {
            const response = await axios.delete(`${import.meta.env.VITE_BASEURL}/outlet/${outletId}`)            
            if(response) {
                setMsg({msg: response.data.msg, color: 'green'})
                setOutlets(response.data.data)
            }
        } catch (error) {
            setMsg({msg: error.response.data.msg, color: 'red'})
        }
    }

    const handleInputChange = (e) => {
        const {name, value} = e.target
        setOutlet((prevOutlet) => ({
            ...prevOutlet,
            [name]: value
        }))
    }

    const handleShowFormAddProduct = () => {
        setHideFormAddProduct('')
      }
    
    const handleHideFormAddProduct = () => {
        setHideFormAddProduct('hideFormAddProduct')
    }

    const stopPropagation = (e) => {
        e.stopPropagation();
    };

    // Calculate the current items to display
    const indexOfLastOutlet = currentPage * itemsPerPage;
    const indexOfFirstOutlet = indexOfLastOutlet - itemsPerPage;
    const currentOutlets = outlets.slice(indexOfFirstOutlet, indexOfLastOutlet);

    // Calculate the total number of pages
    const totalPages = Math.ceil(outlets.length / itemsPerPage);

    // Determine the pages to display
    const maxButtons = 5; // Maximum number of page buttons to display
    let startPage, endPage;

    if (totalPages <= maxButtons) {
        // Total pages less than or equal to maxButtons 
        startPage = 1;
        endPage = totalPages;
    } else {
        // Total pages more than maxButtons
        if (currentPage <= Math.floor(maxButtons / 2)) {
            // Near the beginning
            startPage = 1;
            endPage = maxButtons;
        } else if (currentPage + Math.floor(maxButtons / 2) >= totalPages) {
            // Near the end
            startPage = totalPages - maxButtons + 1;
            endPage = totalPages;
        } else {
            // Middle
            startPage = currentPage - Math.floor(maxButtons / 2);
            endPage = currentPage + Math.floor(maxButtons / 2);
        }
    }

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Handle previous and next page
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <div className='is-flex'>
            <Sidebar />

            {msg && 
                <div className='messages' style={{ backgroundColor: msg.color }}>
                    <p>{msg.msg}</p>
                    <p style={{ display: 'none' }}>
                        {setTimeout(() => { setMsg(null) }, 3000)}
                    </p>
                </div>
            }

            <div className="outletContainer">
                <div className="outletHeader">
                    <div className="judul">
                        <h1>Outlet</h1>
                    </div>
                    <div className="addOutlet">
                        <form onSubmit={handleSearchOutlet}>
                            <input onChange={(e) => setSearch(e.target.value)} type="text"  placeholder='Search'/>
                            <button style={{width: '50px'}} type='button' className='button'><i><CIcon icon={icon.cilSearch}/></i></button>
                        </form>
                        <button onClick={handleShowFormAddProduct} className="button">Add Outlet</button>
                    </div>
                </div>
                <div className="outletContent">
                    {currentOutlets.map((outlet, index) => (
                        <div key={index} className="outletBox">
                            <i style={{ position: 'absolute', top: '15px', right: '15px', display: 'flex', justifyContent: 'center', cursor: 'pointer' }}><CIcon icon={icon.cilPen} /></i>
                            <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                                <img src={outletBackground} style={{height: '150px'}} />
                            </div>
                            <div style={{ display: 'flex', gap: '5px' }}>
                                <i style={{ marginTop: '5px' }}>
                                    <CIcon icon={icon.cilHouse} />
                                </i>
                                <h1 style={{ fontSize: '25px', color: 'darkorange' }}>{outlet.name}</h1>
                            </div>
                            <div style={{ display: 'flex', gap: '5px', marginBottom: '55px' }}>
                                <i>
                                    <CIcon icon={icon.cilLocationPin} />
                                </i>
                                <p>{outlet.address}</p>
                            </div>
                            <div style={{ display: 'flex', gap: '5px', position: 'absolute', bottom: '25px', borderTop: '1px solid grey', width: '85%', paddingTop: '10px' }}>
                                <i>
                                    <CIcon style={{ color: 'green' }} icon={icon.cilPhone} />
                                </i>
                                <p>{outlet.phone}</p>
                                <a href={`https://wa.me/+62${outlet.phone}`} target="_blank" className='button' style={{ height: '30px', marginTop: '-5px', backgroundColor: 'darkgreen', border: 'none', position: 'absolute', left: '155px', bottom: '-13px', padding: '20px' }}>
                                    <i style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><CIcon icon={icon.cilChatBubble} /></i>
                                </a>
                                <button onClick={() =>handleDeleteOutlet(outlet.id, outlet.name)} className='button' style={{ height: '30px', marginTop: '-5px', backgroundColor: 'darkred', border: 'none', position: 'absolute', left: '210px', bottom: '-13px', padding: '20px' }}>
                                    <i style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><CIcon icon={icon.cilTrash} /></i>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* form add outlet */}
                <div onClick={handleHideFormAddProduct} className={`formAddProduct ${hideFormAddProduct}`}>
                <form style={{height: 'auto'}} onSubmit={handleAddOutlet} onClick={stopPropagation} action="">
                    <div className="field">
                        <label className="label">Name</label>
                        <div className="control">
                            <input className="input" type="text" placeholder="" value={outlet.name} name="name" onChange={handleInputChange}/>
                        </div>
                        <p className="help">Masukkan nama outlet</p>
                    </div>
                    <div className="field">
                        <label className="label">Address</label>
                        <div className="control">
                            <input className="input" type="text" placeholder="" value={outlet.address} name="address" onChange={handleInputChange}/>
                        </div>
                        <p className="help">Masukkan alamat outlet</p>
                    </div>
                    <div className="field">
                        <label className="label">Phone</label>
                        <div className="control">
                            <input className="input" type="number" placeholder="" value={outlet.phone} name="phone" onChange={handleInputChange}/>
                        </div>
                        <p className="help">Masukkan nomor hp pemilik outlet</p>
                    </div>
                    <button className='button is-success is-fullwidth'>Add Outlet</button>
                </form>
                </div>

                {/* Pagination Controls */}
                <div className="pagination">
                    <button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className="pagination-arrow"
                    >
                        &laquo; Prev
                    </button>
                    {startPage > 1 && (
                        <>
                            <button onClick={() => handlePageChange(1)}>1</button>
                            {startPage > 2 && <span>...</span>}
                        </>
                    )}
                    {Array.from({ length: endPage - startPage + 1 }, (_, index) => (
                        <button
                            key={startPage + index}
                            onClick={() => handlePageChange(startPage + index)}
                            className={currentPage === startPage + index ? 'active' : ''}
                        >
                            {startPage + index}
                        </button>
                    ))}
                    {endPage < totalPages && (
                        <>
                            {endPage < totalPages - 1 && <span>...</span>}
                            <button onClick={() => handlePageChange(totalPages)}>{totalPages}</button>
                        </>
                    )}
                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="pagination-arrow"
                    >
                        Next &raquo;
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Outlet;

