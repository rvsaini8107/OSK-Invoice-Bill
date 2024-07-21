import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import maakarni from "./../assets/makarni.png"

const InvoiceBillPc = () => {
  const [isInState, setIsInState] = useState(true);
  const [formData, setFormData] = useState({
    plotNumber: "PLOT NO 2,3,36 and 37",
    location: "MOINABAD MANDAL 500075,Hyderabad,Telangana",
    gstin: "36AAHFO0962G1Z9",
    invoiceNo: "",
    invoiceDate: new Date().toISOString().split("T")[0], // Set to today's date
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

  const handleDownload = () => {
    if (formData.buyerName === "") {return}
    
    const doc = new jsPDF();

    // Add header

    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(
      "OM SHREE KARNI MARBLES & GRANITES",
      105,
      17,
      null,
      null,
      "center"
    );
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(
      "DIAMOND COLONY, HIMAYATHNAGAR VILLAGE AND GRAM PM MOINABAD MANDAL",
      105,
      25,
      null,
      null,
      "center"
    );
    doc.text("State: 36-Telangana", 105, 30, null, null, "center");
    doc.text("Phone no. : 6302608064", 105, 35, null, null, "center");
    doc.text("Email : oskgranite008@gmail.com", 105, 40, null, null, "center");
    doc.text(`GSTIN: ${formData.gstin}`, 105, 45, null, null, "center");

    // Add Buyer Information
    doc.setFontSize(14);
    doc.text("Tax Invoice", 10, 60);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Bill To: ${formData.buyerName}`, 10, 70);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Address: ${formData.buyerAddress}`, 10, 80);
    doc.setFontSize(12);
    doc.text(`Invoice No: ${formData.invoiceNo}`, 195, 67, null, null, "right");
    doc.text(`Dated: ${formData.invoiceDate}`, 195, 75, null, null, "right");

    // Add Item Details using autoTable plugin
    const tableData = tableRows.map((row, index) => [
      index + 1,
      row.item,
      row.hsn,
      row.rate,
      row.quantity,
      row.amount,
      `${row.gstRate}%`,
    ]);

    doc.autoTable({
      startY: 110,
      head: [["#", "ITEM", "HSN/SAC", "Price/Unit", "QTY", "AMOUNT", "GST"]],
      body: tableData,
      theme: "striped",
    });

    // // Add Totals and Taxes

    const yPosition = doc.autoTable.previous.finalY;
    // Add invoice details
    doc.text(`Total Amount: ${totals.totalAmount}`, 11, yPosition + 20);
    if (isInState) {
      doc.text(`CGST: ${totals.cgst}`, 11, yPosition + 30);
      doc.text(`SGST: ${totals.sgst}`, 11, yPosition + 40);
    } else {
      doc.text(`IGST: ${totals.igst}`, 11, yPosition + 30);
    }
    doc.text(
      `Grand Total: ${totals.grandTotal.toFixed(2)}`,
      11,
      yPosition + 50
    );

    // Additional sections for Invoice Amount in Words and Terms
    doc.setFontSize(11);
    doc.text(
      "Invoice Amount in Words: " +
        convertToWords(totals.grandTotal.toFixed(0)),
      10,
      yPosition + 60
    );
    doc.text("Terms and Conditions", 10, yPosition + 70);
    doc.text("Thanks for doing business with us!", 10, yPosition + 80);

    // Save PDF
    doc.save("invoice.pdf");
  };
  const convertToWords = (num) => {
    if (num === 0) return "Zero";

    const belowTen = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
    ];
    const belowTwenty = [
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const belowHundred = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];
    const aboveHundred = ["", "Thousand", "Million"];

    const words = [];

    const helper = (n) => {
      if (n < 10) return belowTen[n];
      if (n < 20) return belowTwenty[n - 10];
      if (n < 100)
        return (
          belowHundred[Math.floor(n / 10)] +
          (n % 10 ? " " + belowTen[n % 10] : "")
        );
      if (n < 1000)
        return (
          belowTen[Math.floor(n / 100)] +
          " Hundred" +
          (n % 100 ? " " + helper(n % 100) : "")
        );
    };

    let thousandCounter = 0;
    while (num > 0) {
      const chunk = num % 1000;
      if (chunk) {
        words.unshift(
          helper(chunk) +
            (aboveHundred[thousandCounter]
              ? " " + aboveHundred[thousandCounter]
              : "")
        );
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
            <div class="form-one-section-center">
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
            <button type="button" className="printbtn" onClick={handleDownload}>
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
