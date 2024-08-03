import React, { act, useEffect } from 'react'
import Sidebar from './Sidebar'
import axios from 'axios'
import '../index.css'
import { useState } from 'react'
import {useNavigate} from 'react-router-dom'


const Inventory = () => {
  const [msg, setMsg] = useState(null)
  const [items, setItems] = useState([])
  const [activeButton, setActiveButton] = useState('All Category')
  const [dataView, setDataView] = useState('')
  const [hideFormAddProduct, setHideFormAddProduct] = useState('hideFormAddProduct')
  const [hideFormAddStock, setHideFormAddStock] = useState('hideFormAddStock')
  
  const [name, setName] = useState('')
  const [category, setCategory] = useState('foods')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [discount, setDiscount] = useState('')

  const [codeAddStock, setCodeAddStock] = useState('')
  const [nameAddStock, setNameAddStock] = useState('')
  const [stockAddStock, setStockAddStock] = useState('')
  const [search, setSearch] = useState('')

  const [totalAddStock, setTotalAddStock] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    handleButtonClick('All Category')
  }, [])
  
  const addproduct = async(e) => {
    e.preventDefault()
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASEURL}/items`, {
        name: name,
        category: category,
        price: price,
        stock: stock,
        discount: discount
      })
      if(response) {
        setHideFormAddProduct('hideFormAddProduct')
        setActiveButton(response.data.activeButton)
        setItems(response.data.dataView)
        setMsg({msg: response.data.msg, color: 'green'})
      } 
    } catch (error) {
      setMsg({msg: error.response.data.msg, color: 'red'})
    }
  }

  const addstock = async(e) => {
    e.preventDefault()

    try {
      const response = await axios.put(`${import.meta.env.VITE_BASEURL}/items/stock/${codeAddStock}`, {
        stockAdded: totalAddStock,
        dataView: dataView
      })
      if(response) {
        setHideFormAddStock('hideFormAddStock')
        setStockAddStock(response.data.data)
        setItems(response.data.dataView)
        setMsg({msg: response.data.msg, color: 'green'})
      }
    } catch (error) {
      setMsg({msg: error.response.data.msg, color: 'red'})
    }
  }

  const handleDeleteItems = async(code, name) => {
    if(confirm(`Are you sure want to delete ${name.toUpperCase()}?`) != true) return
    try {
      const response = await axios.delete(`${import.meta.env.VITE_BASEURL}/items/${code}`, {
        data: {dataView: dataView}
      })
      if(response) {
        setItems(response.data.dataView)
        setMsg({msg: response.data.msg, color: 'green'})
      }
    } catch (error) {
      console.log(error)
      setMsg({msg: error.response.data.msg, color: 'red'})
    }
  }

  const handleButtonClick = async(category) => {
    setActiveButton(category)
    try {
      let response
      switch (category) {
        case 'Foods':
          response = await axios.get(`${import.meta.env.VITE_BASEURL}/items/foods`)
          setItems(response.data.data)
          setDataView(category)
          break;
        case 'Drinks':
          response = await axios.get('http://localhost:5000/items/drinks')
          setItems(response.data.data)
          setDataView(category)
          break;
        case 'Bathroom':
          response = await axios.get('http://localhost:5000/items/bathroom')
          setItems(response.data.data)
          setDataView(category)
          break;
        case 'Kitchen':
          response = await axios.get('http://localhost:5000/items/kitchen')
          setItems(response.data.data)
          setDataView(category)
          break;
        default:
          response = await axios.get('http://localhost:5000/items')
          setItems(response.data.data)
          setDataView(category)
          break;
      }
    } catch (error) {
      console.log(error)
      setMsg({msg: error.response.data.msg, color: 'red'})
    }
  }

  const rupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };

  const handleAddStock = (code, name, stock) => {
    setCodeAddStock(code)
    setNameAddStock(name)
    setStockAddStock(stock)
    setHideFormAddStock('')
  }

  const handleShowFormAddProduct = () => {
    setHideFormAddProduct('')
  }

  const handleHideFormAddProduct = () => {
    setHideFormAddProduct('hideFormAddProduct')
  }

  const handleHideFormAddStock = () => {
    setHideFormAddStock('hideFormAddStock')
  }

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  const handleSearch = async(e) => {
    e.preventDefault()

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASEURL}/items/search`, {
        value: search
      })
      setDataView(search)
      setItems(response.data.data)
      setActiveButton('')
    } catch (error) {
      setItems([])
      setMsg({msg: error.response.data.msg, color: 'red'})
    }
  }

  const tableStyle = {
    width: '100%'
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

        <div className="inventoryContainer">
            <div className="judul">
                <h1>Inventory</h1>
            </div>
            <div className="inventoryMenu">
                <ul>
                  <li>
                    <button className={activeButton === 'All Category' ? 'is-active-btn' : ''} onClick={() => handleButtonClick('All Category')}>All Category</button>
                  </li>
                  <li>
                    <button className={activeButton === 'Foods' ? 'is-active-btn' : ''} onClick={() => handleButtonClick('Foods')}>Foods</button>
                  </li>
                  <li>
                    <button className={activeButton === 'Drinks' ? 'is-active-btn' : ''} onClick={() => handleButtonClick('Drinks')}>Drinks</button>
                  </li>
                  <li>
                    <button className={activeButton === 'Bathroom' ? 'is-active-btn' : ''} onClick={() => handleButtonClick('Bathroom')}>Bathrooms</button>
                  </li>
                  <li>
                    <button className={activeButton === 'Kitchen' ? 'is-active-btn' : ''} onClick={() => handleButtonClick('Kitchen')}>Kithcens</button>
                  </li>
                  <li>
                    <button onClick={handleShowFormAddProduct}>Add Product</button>
                  </li>
                  <li>
                    <form onSubmit={handleSearch}>
                      <input placeholder='Cari' type="text" className="searchItem" onChange={(e) => setSearch(e.target.value)} />
                    </form>
                  </li>
                </ul>
            </div>
            <div className="tableContainer">
            <table style={tableStyle} className="table">
                    <thead>
                        <tr>
                            <th><abbr title="Position">No</abbr></th>
                            <th>Code</th>
                            <th>Product Name</th>
                            <th>Stock</th> 
                            <th>Discount</th> 
                            <th>Original Price</th> 
                            <th>Control</th> 
                        </tr>
                    </thead>
                    <tbody>
                      {
                        items.map((item, index) => (
                          <tr key={index} className={item.stock <= 0 ? 'stockHabis' : ''}>
                            <td>{index + 1}</td>
                            <td>{item.code}</td>
                            <td>{item.name.toUpperCase()}</td>
                            <td>{item.stock}</td>
                            <td>{item.discount * 100}%</td>
                            <td>{rupiah(item.price)}</td>
                            <td>
                              <button onClick={() => handleAddStock(item.code, item.name, item.stock)} className='button is-success is-small'>Add Stock</button>
                              <button onClick={() => handleDeleteItems(item.code, item.name)} className='button ml-3 is-danger is-small'>Remove</button>
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                </table>
            </div>

            {/* form add product */}
            <div onClick={handleHideFormAddProduct} className={`formAddProduct ${hideFormAddProduct}`}>
              <form onSubmit={addproduct} onClick={stopPropagation} action="">
                <div className="field">
                  <label className="label">Name</label>
                  <div className="control">
                    <input className="input" type="text" placeholder="" value={name} onChange={(e) => setName(e.target.value)}/>
                  </div>
                  <p className="help">Masukkan nama produk</p>
                </div>
                <div className="field">
                  <label className="label">Category</label>
                  <div className="control">
                    <div className="select is-fullwidth">
                    <select className='' name="category" id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                      <option value="foods">Foods</option>
                      <option value="drinks">Drinks</option>
                      <option value="bathroom">Bathrooms</option>
                      <option value="kitchen">Kitchens</option>
                    </select>
                    </div>
                  </div>
                  <p className="help">Pilih kategori produk</p>
                </div>
                <div className="field">
                  <label className="label">Price</label>
                  <div className="control has-icons-left">
                    <input className="input" type="number" placeholder="" value={price} onChange={(e) => setPrice(e.target.value)}/>
                    <span className="icon is-small is-left">Rp</span>
                  </div>
                  <p className="help">Masukkan harga produk</p>
                </div>
                <div className="field">
                  <label className="label">Stock</label>
                  <div className="control">
                    <input className="input" type="number" placeholder="" value={stock} onChange={(e) => setStock(e.target.value)}/>
                  </div>
                  <p className="help">Masukkan stok produk</p>
                </div>
                <div className="field">
                  <label className="label">Discount</label>
                  <div className="control has-icons-right">
                    <input className="input" type="number" placeholder="" value={discount} onChange={(e) => setDiscount(e.target.value)}/>
                    <span className='icon is-small is-right'>%</span>
                  </div>
                  <p className="help">Tambahkan diskon (jika perlu)</p>
                </div>
                <button className='button is-success is-fullwidth'>Add</button>
              </form>
            </div>

            {/* form tambah stock */}
            <div onClick={handleHideFormAddStock} className={`formAddStock ${hideFormAddStock}`}>
              <form onSubmit={addstock} onClick={stopPropagation} action="">
              <div className="label stockNameInfo">{nameAddStock.toUpperCase()}</div>
                <div className="field">
                  <div className="label">Current Stock: {stockAddStock}</div>
                  <div className="control is-flex has-icons-left">
                    <input type="hidden" className='input' value={codeAddStock}/>
                    <input type="number" className='input' value={totalAddStock} onChange={(e) => setTotalAddStock(e.target.value)}/>
                    <span className='icon is-left is-small'>+</span>
                    <button className='button ml-3 is-primary'>Add Stock</button>
                  </div>
                </div>
              </form>
            </div>
        </div>
    </div>
  )
}

export default Inventory