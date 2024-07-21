import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

import convertToWords from './convertToWords.js';


const handleDownload = (formData, tableRows, totals, isInState) => {
  const documentDefinition = {
    content: [
      {
        text: 'OM SHREE KARNI MARBLES & GRANITES',
        style: 'header',
        alignment: 'center'
      },
      {
        text: 'DIAMOND COLONY, HIMAYATHNAGAR VILLAGE AND GRAM PM MOINABAD MANDAL',
        style: 'subheader',
        alignment: 'center'
      },
      {
        text: 'State: 36-Telangana',
        style: 'subheader',
        alignment: 'center'
      },
      {
        text: 'Phone no. : 6302608064',
        style: 'subheader',
        alignment: 'center'
      },
      {
        text: 'Email : oskgranite008@gmail.com',
        style: 'subheader',
        alignment: 'center'
      },
      {
        text: `GSTIN: ${formData.gstin}`,
        style: 'subheader',
        alignment: 'center'
      },
      { text: '', margin: [0, 20] }, // Spacer
      {
        text: 'Tax Invoice',
        style: 'title'
      },
      {
        text: `Bill To: ${formData.buyerName}`,
        style: 'bold'
      },
      {
        text: `Address: ${formData.buyerAddress}`,
        style: 'normal'
      },
      {
        columns: [
          { text: `Invoice No: ${formData.invoiceNo}`, alignment: 'right' },
          { text: `Dated: ${formData.invoiceDate}`, alignment: 'right' }
        ],
        margin: [0, 10]
      },
      {
        table: {
          widths: ['auto', '*', '*', '*', '*', '*', '*'],
          body: [
            ['#', 'ITEM', 'HSN/SAC', 'Price/Unit', 'QTY', 'AMOUNT', 'GST'],
            ...tableRows.map((row, index) => [
              index + 1,
              row.item,
              row.hsn,
              row.rate,
              row.quantity,
              row.amount,
              `${row.gstRate}%`
            ])
          ]
        },
        layout: 'striped'
      },
      {
        text: `Total Amount: ${totals.totalAmount}`,
        margin: [0, 20]
      },
      ...(isInState
        ? [
            { text: `CGST: ${totals.cgst}` },
            { text: `SGST: ${totals.sgst}` }
          ]
        : [{ text: `IGST: ${totals.igst}` }]),
      {
        text: `Grand Total: ${totals.grandTotal.toFixed(2)}`
      },
      {
        text: `Invoice Amount in Words: ${convertToWords(totals.grandTotal.toFixed(0))}`,
        margin: [0, 20]
      },
      {
        text: 'Terms and Conditions',
        margin: [0, 10]
      },
      {
        text: 'Thanks for doing business with us!',
        margin: [0, 10]
      }
    ],
    styles: {
      header: {
        fontSize: 20,
        bold: true
      },
      subheader: {
        fontSize: 12
      },
      title: {
        fontSize: 14,
        bold: true
      },
      bold: {
        bold: true
      },
      normal: {
        fontSize: 10
      }
    }
  };

  pdfMake.createPdf(documentDefinition).download('invoice.pdf');
};

export default handleDownload;