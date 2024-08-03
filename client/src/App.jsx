import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Dashboard from './components/Dashboard'
import Cashier from './components/Cashier'
import Inventory from './components/Inventory'
import Outlet from './components/Outlet'

function App() {
  return (
    // <div><Dashboard/></div>
    <>
   <Router> 
     <Routes>
       <Route path="/" element={<Dashboard/>}/>
       <Route path="/inventory" element={<Inventory/>}/>
       <Route path="/cashier" element={<Cashier/>}/>
       <Route path="/Outlet" element={<Outlet/>}/>
     </Routes>
   </Router>
    </>
  )
}

export default App
