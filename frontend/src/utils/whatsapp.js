export const getWhatsAppUrl = (items, total, address = "") => {
  const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "919876543210";
  let message = "Welcome to Sri Palani Pavan Fireworks ✨\n\n";
  message += "I'd like to place an order:\n\n";
  
  items.forEach((item, index) => {
    const name = item.product?.name || item.name || "Product";
    const qty = item.qty || item.quantity || 1;
    const price = item.product?.price || item.price || 0;
    message += `${index + 1}. *${name}* - Qty: ${qty} - ₹${price}\n`;
  });
  
  message += `\n*Total Amount: ₹${total}*\n`;
  
  if (address) {
    message += `\n*Delivery Address:*\n${address}\n`;
  }
  
  message += "\nPlease confirm my order. 🧨🎇";
  
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
};
