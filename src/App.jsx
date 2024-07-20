import { useState } from 'react'

import './App.css'
import InvoiceBill from './components/InvoiceBill'
import InvoiceBillPc from './components/InvoiceBillPc'
import NumberToWord from './components/NumberToWord'

function App() {
  const [count, setCount] = useState(0)

  return (
   <>
      <InvoiceBillPc/>
      {/* <NumberToWord/> */}
      {/* <InvoiceBill/> */}
   </>
    )
}

export default App
