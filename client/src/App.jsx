import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Dashboard from './components/Dashboard'
import Cashier from './components/Cashier'
import Inventory from './components/Inventory'

function App() {
  return (
    // <div><Dashboard/></div>
    <>
   <Router> 
     <Routes>
       <Route path="/" element={<Dashboard/>}/>
       <Route path="/inventory" element={<Inventory/>}/>
       <Route path="/cashier" element={<Cashier/>}/>
     </Routes>
   </Router>
    </>
  )
}

export default App
