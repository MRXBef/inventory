import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import '../index.css';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [product, setProduct] = useState('0');
  const [stock, setStock] = useState('0');
  const [todayOrders, setTodayOrders] = useState('0');
  const [todayIncomes, setTodayIncomes] = useState('0');
  const [chartData, setChartData] = useState([])
  const [bestSeller, setBestSeller] = useState('')
  const [todayBestSeler, setTodayBestSeller] = useState('')

  const getLast7Days = () => {
    const days = [];
    for (let i = 1; i <= 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const day = date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' });
      days.push(day);
    }
    return days.reverse();
  };

  const rupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };

  useEffect(() => {
    // const interval = setInterval(() => {
      getProduct();
      getStock();
      getTodayOrders();
      getTodayIncomes();
      getLast6DaysIncomes()
      getBestSellerProduct()
      getTodayBestSellerProduct()
    // }, 500);
    // return () => clearInterval(interval);
  }, []);

  const getProduct = async () => {
    try {
      const response = await axios.get('http://localhost:5000/dashboard/items');
      setProduct(response.data.total_product);
    } catch (error) {
      console.log(error.response)
    }
  };

  const getStock = async () => {
    try {
      const response = await axios.get('http://localhost:5000/dashboard/stock');
      setStock(response.data.total_stock);
    } catch (error) {
      console.log(error.response)
    }
  };

  const getTodayOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/dashboard/todayOrders');
      setTodayOrders(response.data.total_today_orders);
    } catch (error) {
      console.log(error.response)
    }
  };

  const getTodayIncomes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/dashboard/todayIncome');
      setTodayIncomes(rupiah(response.data.total_today_income));
    } catch (error) {
      console.log(error.response)
    }
  };

  const getLast6DaysIncomes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/dashboard/last6DaysIncome')
      setChartData(response.data.incomes)
    } catch (error) {
      console.log(error.response)
    }
  }

  const getBestSellerProduct = async() => {
    try {
      const response = await axios.get('http://localhost:5000/dashboard/bestseller')
      setBestSeller(response.data.item.toUpperCase())
    } catch (error) {
      console.log(error.response)
    }
  }

  const getTodayBestSellerProduct = async() => {
    try {
      const response = await axios.get('http://localhost:5000/dashboard/todayBestSeller')
      setTodayBestSeller(response.data.item.toUpperCase())
    } catch (error) {
      console.log(error.response)
    }
  }

  const data = {
    labels: getLast7Days(),
    datasets: [
      {
        label: 'Last 7 days Incomes',
        data: chartData,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        ticks: {
          font: {
            size: 8, // Ukuran font label sumbu X
          },
        },
      },
      y: {
        ticks: {
          font: {
            size: 10, // Ukuran font label sumbu Y
          },
          beginAtZero: true,
        },
      },
    },
  };

  // CSS styling
  const myHeroStyle = {
    display: 'block',
  };
  const myDashboardTextStyle = {
    fontSize: '70px',
    fontWeight: 'bold',
    color: 'black',
    borderLeft: '10px solid darkorange',
    paddingLeft: '10px',
    marginTop: '3px'
  };
  const judulStyle = {
    position: 'absolute',
    marginLeft: '-0px',
    marginTop: '-200px',
    fontWeight: 'bold',
    color: 'black',
    borderBottom: '3px solid lightgrey',
    paddingRight: '670px',
  };
  const incomeStyle = {
    backgroundColor: 'darkorange',
  };
  const incomeTextStyle = {
    color: 'white',
  };

  return (
    <div className="is-flex">
      <Sidebar />

      <div className="my-dashboard">
        <div className="my-dashboardChild">
          <div style={myHeroStyle} className="my-headMenu">
            <h1 style={myDashboardTextStyle}>Dashboard</h1>
          </div>
          <div className="my-headMenu">
            <div className='chartContainer'>
              <Bar className='chartView' data={data} options={options} />
            </div>
          </div>
        </div>
        <div className="my-dashboardChild">
          <div className="my-headMenu">
            <h1 style={judulStyle}>Product</h1>
            <div className="my-menu">
              <h3>Total Of Product</h3>
              <h1>{product}</h1>
            </div>
            <div className="my-menu">
              <h3>Total Of Stock</h3>
              <h1>{stock}</h1>
            </div>
          </div>
          <div className="my-headMenu">
            <h1 style={judulStyle}>Incomes</h1>
            <div style={incomeStyle} className="my-menu">
              <h3>Today Orders</h3>
              <h1 style={incomeTextStyle}>{todayOrders}</h1>
            </div>
            <div style={incomeStyle} className="my-menu">
              <h3>Today Incomes</h3>
              <h1 style={incomeTextStyle}>{todayIncomes}</h1>
            </div>
          </div>
        </div>
        <div className="my-dashboardChild">
          <div className="my-headMenu">
            <div className="my-menu">
              <h3>Best Seller Last 1 Weeks</h3>
              <h1>{bestSeller || "-"}</h1>
            </div>
          </div>
          <div className="my-headMenu">
            <div className="my-menu">
              <h3>Today Best Seller</h3>
              <h1>{todayBestSeler || "-"}</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;