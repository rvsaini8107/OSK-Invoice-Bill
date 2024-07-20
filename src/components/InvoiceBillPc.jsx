import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

const InvoiceBillPc = () => {
  const [formData, setFormData] = useState({
    plotNumber: "PLOT NO 2,3,36 and 37",
    location: "MOINABAD MANDAL 500075,Hyderabad,Telangana",
    gstin: "36AAHFO0962G1Z9",
    invoiceNo: "",
    invoiceDate: "",
    lorryNo: "",
    paymentTerms: "7 Days",
    supplierRef: "",
    otherRef: "Verbally",
    buyerName: "",
    buyerAddress: "",
    buyerOrderNo: "",
    buyerOrderDate: "",
    deliveryTerms: "Verbal",
    cgstRate: 9,
    sgstRate: 9,
    amountChargeable: "",
    taxAmount: "",
    companyPan: "AAHFO0962G",
  });

  const [tableRows, setTableRows] = useState([
    { description: "", hsn: "", gstRate: 18, quantity: 0, rate: 0, amount: 0 },
  ]);

  const [totals, setTotals] = useState({
    totalAmount: 0,
    cgst: 0,
    sgst: 0,
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
    setTableRows([...tableRows, { description: "", hsn: "", gstRate: 18, quantity: 0, rate: 0, amount: 0 }]);
  };

  const removeTableRow = (index) => {
    const rows = [...tableRows];
    rows.splice(index, 1);
    setTableRows(rows);
  };

  useEffect(() => {
    const totalAmount = tableRows.reduce((sum, row) => sum + row.amount, 0);
    const cgst = (totalAmount * formData.cgstRate) / 100;
    const sgst = (totalAmount * formData.sgstRate) / 100;
    const grandTotal = totalAmount + cgst + sgst;

    setTotals({
      totalAmount,
      cgst,
      sgst,
      grandTotal,
    });

    setFormData({
      ...formData,
      amountChargeable: totalAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }),
      taxAmount: (cgst + sgst).toLocaleString('en-IN', { style: 'currency', currency: 'INR' }),
    });
  }, [tableRows, formData.cgstRate, formData.sgstRate]);

  
  const handleDownload = () => {
    const doc = new jsPDF();
    
    // Add header
    doc.setFontSize(20);
    doc.text("OM SHREE KARNI MARBLES & GRANITES", 105, 10, null, null, "center");
    doc.setFontSize(12);
    doc.text("SURVEY NO 112/A2/PLOT NO 2.3.36 and 37", 105, 20, null, null, "center");
    doc.text("DIAMOND COLONY, HIMAYATHNAGAR VILLAGE AND GRAM PM MOINABAD MANDAL", 105, 25, null, null, "center");
    doc.text("State: 36-Telangana", 105, 30, null, null, "center");
    doc.text("Phone no. : 6302608064", 105, 35, null, null, "center");
    doc.text("Email : oskgranite008@gmail.com", 105, 40, null, null, "center");
    doc.text(`GSTIN: ${formData.gstin}`, 105, 45, null, null, "center");
    

    // Add Buyer Information
    doc.setFontSize(14);
    doc.text("Tax Invoice", 10, 60);
    doc.setFontSize(12);
    doc.text(`Bill To: ${formData.buyerName}`, 10, 70);
    doc.text(`Address: ${formData.buyerAddress}`, 10, 80);
    doc.text(`Invoice No: ${formData.invoiceNo}`, 10, 90);
    // doc.text(`Dated: ${formData.invoiceDate}`, 10, 100);

    // Add Item Details using autoTable plugin
    const tableData = tableRows.map((row, index) => [
      index + 1,
      row.hsn,
      row.rate,
      row.quantity,
      row.amount,
      `${row.gstRate}%`,
    ]);

    doc.autoTable({
      startY: 110,
      head: [
        ["# Item", "HSN/SAC", "MRP", "Quantity", "Unit", "Price/Unit", "GST"],
      ],
      body: tableData,
      theme: "striped",
    });

    // Add Totals and Taxes
    const yPosition = doc.autoTable.previous.finalY + 10;
    doc.text(`Total: ${totals.totalAmount}`, 10, yPosition);
    doc.text(`CGST: ${totals.cgst}`, 10, yPosition + 10);
    doc.text(`SGST: ${totals.sgst}`, 10, yPosition + 20);
    doc.text(`Grand Total: ${totals.grandTotal}`, 10, yPosition + 30);

    // Additional sections for Invoice Amount in Words and Terms
    doc.text("Invoice Amount in Words: " + convertToWords(totals.grandTotal), 10, yPosition + 50);
    doc.text("Terms and Conditions", 10, yPosition + 70);
    doc.text("Thanks for doing business with us!", 10, yPosition + 80);

    // Save PDF
    doc.save("invoice.pdf");
};
const convertToWords = (num) => {
  if (num === 0) return "Zero";

  const belowTen = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
  const belowTwenty = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const belowHundred = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const aboveHundred = ["", "Thousand", "Million"];

  const words = [];

  const helper = (n) => {
      if (n < 10) return belowTen[n];
      if (n < 20) return belowTwenty[n - 10];
      if (n < 100) return belowHundred[Math.floor(n / 10)] + (n % 10 ? " " + belowTen[n % 10] : "");
      if (n < 1000) return belowTen[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + helper(n % 100) : "");
  };

  let thousandCounter = 0;
  while (num > 0) {
      const chunk = num % 1000;
      if (chunk) {
          words.unshift(helper(chunk) + (aboveHundred[thousandCounter] ? " " + aboveHundred[thousandCounter] : ""));
      }
      num = Math.floor(num / 1000);
      thousandCounter++;
  }

  return words.join(" ").trim();
};

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
                <label></label>
                <input
                  type="text"
                  name="buyerName"
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
            <div className="form-one-section-right">
              <div className="div-flex-row">
                <div className="div-flex-row-col-1">
                  <label>Invoice No:</label>
                  <input
                    type="text"
                    name="invoiceNo"
                    className="input-box-border"
                    value={formData.invoiceNo}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="div-flex-row-col-2">
                  <label>Invoice Date:</label>
                  <input
                    type="date"
                    name="invoiceDate"
                    value={formData.invoiceDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Table Section */}
          <div className="table-section">
            <h3>Item Details</h3>
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>HSN/SAC</th>
                  <th>GST Rate</th>
                  <th>Quantity</th>
                  <th>Rate</th>
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
                        name="description"
                        value={row.description}
                        onChange={(e) => handleTableRowChange(index, e)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="hsn"
                        value={row.hsn}
                        onChange={(e) => handleTableRowChange(index, e)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="gstRate"
                        value={row.gstRate}
                        onChange={(e) => handleTableRowChange(index, e)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="quantity"
                        value={row.quantity}
                        onChange={(e) => handleTableRowChange(index, e)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="rate"
                        value={row.rate}
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
                      <button type="button" onClick={() => removeTableRow(index)}>Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button type="button" onClick={addTableRow}>Add Row</button>
          </div>
          {/* Rest of the Form */}
          <div>
            <label>CGST:</label>
            <input
              type="number"
              name="cgst"
              value={totals.cgst}
              readOnly
            />
          </div>
          <div>
            <label>SGST:</label>
            <input
              type="number"
              name="sgst"
              value={totals.sgst}
              readOnly
            />
          </div>
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
              value={totals.grandTotal}
              readOnly
            />
          </div>
          <div className="div-flex-row">
            <div className="div-flex-row-col-1">
              <input
                type="text"
                name="lorryNo"
                placeholder="Lorry No / Vehicle No:"
                value={formData.lorryNo}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <button type="button" onClick={handleDownload}>
            Print
          </button>
        </div>
      </form>
    </div>
  );
};

export default InvoiceBillPc;
