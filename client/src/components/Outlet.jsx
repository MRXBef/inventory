import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import outletBackground from '../assets/img/outletBackground.jpeg';
import CIcon from '@coreui/icons-react';
import * as icon from '@coreui/icons';
import axios from 'axios';

const Outlet = () => {
    const [outlets, setOutlets] = useState([]);
    const [msg, setMsg] = useState(null);

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
                </div>
                <div className="outletContent">
                    {currentOutlets.map((outlet, index) => (
                        <div key={index} className="outletBox">
                            <i style={{ position: 'absolute', top: '15px', right: '15px', display: 'flex', justifyContent: 'center', cursor: 'pointer' }}><CIcon icon={icon.cilPen} /></i>
                            <img src={outletBackground} />
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
                                <a href={`https://wa.me/+62${outlet.phone}`} target="_blank" className='button' style={{ height: '30px', marginTop: '-5px', backgroundColor: 'green', border: 'none', position: 'absolute', left: '165px', bottom: '-13px', padding: '20px' }}>
                                    <i style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><CIcon icon={icon.cilChatBubble} /></i>
                                </a>
                                <button className='button' style={{ height: '30px', marginTop: '-5px', backgroundColor: 'red', border: 'none', position: 'absolute', left: '220px', bottom: '-13px', padding: '20px' }}>
                                    <i style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><CIcon icon={icon.cilTrash} /></i>
                                </button>
                            </div>
                        </div>
                    ))}
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

