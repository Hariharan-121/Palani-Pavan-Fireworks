const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

exports.generateInvoice = (order) => {
  const doc = new PDFDocument();

  const invoicePath = path.join(
    __dirname,
    `../invoices/invoice_${order._id}.pdf`
  );

  doc.pipe(fs.createWriteStream(invoicePath));

  doc.fontSize(20).text('Smart Cracker Shop - Invoice', { align: 'center' });
  doc.moveDown();

  doc.fontSize(12).text(`Order ID: ${order._id}`);
  doc.text(`Customer: ${order.user.name}`);
  doc.text(`Email: ${order.user.email}`);
  doc.text(`Date: ${new Date().toLocaleDateString()}`);
  doc.moveDown();

  doc.text('Products:', { underline: true });

  order.items.forEach(item => {
    doc.text(`${item.name} x ${item.quantity} = ₹${item.price}`);
  });

  doc.moveDown();
  doc.fontSize(14).text(`Total Amount: ₹${order.totalPrice}`);

  doc.end();

  return invoicePath;
};
