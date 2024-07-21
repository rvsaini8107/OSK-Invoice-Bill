import React, { useState, useEffect } from "react";
// import "jspdf-autotable";
import maakarni from "./../assets/makarni.png"
// import handleDownload from "./JsPDF.js"
import handleDownload from "./pdfMake.js"

import fromDataObject from "./fromDataObject.js" 

const InvoiceBillPc = () => {
  const [isInState, setIsInState] = useState(true);
  const [formData, setFormData] = useState(fromDataObject);

  const [tableRows, setTableRows] = useState([
    { item: "Granite", hsn: "6802", gstRate: 18, quantity: 0, rate: 0, amount: 0 },
  ]);

  const [totals, setTotals] = useState({
    totalAmount: 0,
    cgst: 0,
    sgst: 0,
    igst: 0,
    grandTotal: 0,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTableRowChange = (index, e) => {
    const { name, value } = e.target;
    const rows = [...tableRows];
    rows[index][name] = value;
    rows[index].amount = rows[index].quantity * rows[index].rate;
    setTableRows(rows);
  };

  const addTableRow = () => {
    setTableRows([
      ...tableRows,
      { item: "", hsn: "", gstRate: 18, quantity: 0, rate: 0, amount: 0 },
    ]);
  };

  const removeTableRow = (index) => {
    const rows = [...tableRows];
    rows.splice(index, 1);
    setTableRows(rows);
  };

  useEffect(() => {
    const totalAmount = tableRows.reduce((sum, row) => sum + row.amount, 0);
    let cgst = 0,
      sgst = 0,
      igst = 0;

    if (isInState) {
      cgst = (totalAmount * formData.cgstRate) / 100;
      sgst = (totalAmount * formData.sgstRate) / 100;
    } else {
      igst = (totalAmount * (formData.cgstRate + formData.sgstRate)) / 100; // For IGST
    }

    const grandTotal = totalAmount + cgst + sgst + igst;

    setTotals({
      totalAmount,
      cgst,
      sgst,
      igst,
      grandTotal,
    });

    setFormData({
      ...formData,
      amountChargeable: totalAmount.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
      }),
      taxAmount: (cgst + sgst + igst).toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
      }),
    });
  }, [tableRows, formData.cgstRate, formData.sgstRate, isInState]);

  


  // Example usage
  // console.log(convertToWords()); // "Twelve Thousand Three Hundred Forty Five"
  return (
    <div className="invoice-form">
      <h1>OM SHREE KARNI MARBLES GRANITES Invoice Bill</h1>
      <form>
        <div className="fullForm">
          <div className="form-one-section">
            <div className="form-one-section-left">
              <div>
                <input
                  type="text"
                  name="buyerName"
                  required
                  placeholder="Customer Name or No."
                  value={formData.buyerName}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <textarea
                  className="textarea"
                  rows="6"
                  type="text"
                  name="buyerAddress"
                  placeholder="Billing Address"
                  value={formData.buyerAddress}
                  onChange={handleInputChange}
                ></textarea>
              </div>
            </div>
            <div className="form-one-section-center">
              <img src={maakarni} alt="Jai Maa Karni" className="logomaakarni" />
            </div>
            <div className="form-one-section-right">
              <div className="div-flex-row">
                <div className="div-flex-row-col-1">
                  <label>Invoice No:</label>
                  <input
                    type="text"
                    name="invoiceNo"
                    required
                    className="input-box-border"
                    value={formData.invoiceNo}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="div-flex-row-col-2">
                  <label>Invoice Date:</label>
                  <input
                    type="date"
                    required
                    name="invoiceDate"
                    value={formData.invoiceDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              {/* Add toggle button for In-State/Out-of-State */}
              <div>
                <button
                  className="toggle-button"
                  type="button"
                  onClick={() => setIsInState(true)}
                >
                  In-State
                </button>
                <button
                  className="toggle-button"
                  type="button"
                  onClick={() => setIsInState(false)}
                >
                  Out-of-State
                </button>
              </div>
            </div>
          </div>
          {/* Table Section */}
          <div className="table-section">
            <h3>Item Details</h3>
            <div className="addbtn">
              <button type="button" onClick={addTableRow}>
                Add Row
              </button>
            </div>
            <div className="table-coverbox">
              <table className="table_osk">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>HSN/SAC</th>
                    <th>Quantity</th>
                    <th>Rate</th>
                    <th>GST Rate</th>
                    <th>Amount</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((row, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="text"
                          name="item"
                          value={row.item}
                          required
                          onChange={(e) => handleTableRowChange(index, e)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="hsn"
                          required
                          value={row.hsn}
                          onChange={(e) => handleTableRowChange(index, e)}
                        />
                      </td>

                      <td>
                        <input
                          type="number"
                          name="quantity"
                          required
                          value={row.quantity}
                          onChange={(e) => handleTableRowChange(index, e)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          name="rate"
                          required
                          value={row.rate}
                          onChange={(e) => handleTableRowChange(index, e)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="gstRate"
                          required
                          value={row.gstRate}
                          onChange={(e) => handleTableRowChange(index, e)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          name="amount"
                          value={row.amount}
                          readOnly
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          className="remove-button"
                          onClick={() => removeTableRow(index)}
                        >
                          X
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Rest of the Form */}
          <div className="row">
            <div className="com-1">
              <div>
                <label>{isInState ? "CGST:" : "IGST:"}</label>
                <input
                  type="number"
                  name={isInState ? "cgst" : "igst"}
                  value={isInState ? totals.cgst : totals.igst}
                  readOnly
                />
              </div>
              {isInState && (
                <div>
                  <label>SGST:</label>
                  <input
                    type="number"
                    name="sgst"
                    value={totals.sgst}
                    readOnly
                  />
                </div>
              )}
            </div>
            <div className="com-2">
              <div>
                <label>Total Amount:</label>
                <input
                  type="number"
                  name="totalAmount"
                  value={totals.totalAmount}
                  readOnly
                />
              </div>
              <div>
                <label>Grand Total:</label>
                <input
                  type="number"
                  name="grandTotal"
                  value={totals.grandTotal.toFixed(2)}
                  readOnly
                />
              </div>
            </div>
            <div className="com-3">
            <div className="div-flex-row">
            <div className="div-flex-row-col-1">
              <input
                type="text"
                name="lorryNo"
                required
                placeholder="Lorry No / Vehicle No:"
                value={formData.lorryNo}
                onChange={handleInputChange}
              />
            </div>
            <button type="button" className="printbtn" onClick={()=>handleDownload(formData,tableRows,totals,isInState)}>
            Print
          </button>
          </div>
          </div>
          </div>
          
        </div>
      </form>
    </div>
  );
};

export default InvoiceBillPc;
