import jsPDF from "jspdf";
import convertToWords from "./convertToWords.js"
const handleDownload = (formData,tableRows,totals,isInState) => {
    console.log(formData,"formDataaaaa")
    // if (formData.buyerName === "") {return}
    
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
  export default handleDownload;