import React from "react";

export default function FloatingWhatsApp() {
  const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "919876543210";
  const message = "Welcome to Sri Palani Pavan Fireworks ✨\n\nI'm exploring your website and have a query. 🧨🎇";
  
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a 
      href={whatsappUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      className="floating-whatsapp"
      style={{
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        backgroundColor: '#25D366',
        color: 'white',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '2rem',
        boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
        zIndex: 1000,
        transition: 'transform 0.3s, background-color 0.3s',
        textDecoration: 'none'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'scale(1.1) rotate(10deg)';
        e.currentTarget.style.backgroundColor = '#128C7E';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
        e.currentTarget.style.backgroundColor = '#25D366';
      }}
      title="Chat with us on WhatsApp"
    >
      💬
    </a>
  );
}
