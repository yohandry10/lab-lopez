"use client"

export default function WhatsAppFloat() {
  const handleWhatsAppClick = () => {
    const message = "Hola, me gustaría obtener más información sobre sus servicios."
    const whatsappUrl = `https://wa.me/51900649599?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div 
      className="fixed bottom-6 right-6 z-50 cursor-pointer"
      onClick={handleWhatsAppClick}
    >
      <img 
        src="/wss.png" 
        alt="WhatsApp" 
        className="w-20 h-20 hover:scale-110 transition-transform duration-200"
      />
    </div>
  )
} 