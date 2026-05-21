'use client';

export default function WhatsAppWidget() {
  return (
    <a
      href="https://wa.me/923001234567?text=Hello%20LocalCart%20Support%20Team"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 w-14 h-14 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 z-40 hover:scale-110"
      title="Chat with us on WhatsApp"
    >
      <svg className="w-8 h-8" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Outer bubble */}
        <path
          d="M20 2C10.059 2 2 10.059 2 20c0 3.294.904 6.384 2.479 9.027L2 38l9.139-2.395A17.93 17.93 0 0020 38c9.941 0 18-8.059 18-18S29.941 2 20 2z"
          fill="white"
        />
        {/* Phone handset */}
        <path
          d="M27.9 24.4c-.36-.18-2.12-1.05-2.45-1.17-.32-.12-.56-.18-.79.18-.24.36-.92 1.17-1.12 1.4-.2.24-.41.27-.77.09-.36-.18-1.53-.56-2.91-1.79-1.08-.96-1.8-2.14-2.01-2.5-.21-.36-.02-.56.16-.74.16-.16.36-.42.54-.63.18-.2.24-.36.36-.6.12-.24.06-.45-.03-.63-.09-.18-.79-1.9-1.08-2.6-.28-.68-.57-.59-.79-.6-.2-.01-.45-.01-.69-.01-.24 0-.62.09-.95.45-.32.36-1.22 1.19-1.22 2.91s1.25 3.37 1.43 3.61c.18.24 2.46 3.76 5.96 5.27.83.36 1.48.57 1.99.73.84.26 1.6.22 2.2.13.67-.1 2.07-.85 2.36-1.66.29-.82.29-1.52.2-1.66-.09-.15-.32-.24-.68-.42z"
          fill="#25D366"
        />
      </svg>
    </a>
  );
}
