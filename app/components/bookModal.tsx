"use client";

// ---- Placeholders: swap these once real details are ready ----
const DEFAULT_OWNER_NAME = "Mistu Ghosh";
const DEFAULT_OWNER_PHOTO = "/owner-placeholder.jpg";
const DEFAULT_PHONE_NUMBER = "+918240488414";
// -----------------------------------------------------------

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  ownerName?: string;
  ownerPhoto?: string;
  phoneNumber?: string;
}

export default function BookingModal({
  isOpen,
  onClose,
  ownerName = DEFAULT_OWNER_NAME,
  ownerPhoto = DEFAULT_OWNER_PHOTO,
  phoneNumber = DEFAULT_PHONE_NUMBER,
}: BookingModalProps) {
  if (!isOpen) return null;

  // wa.me requires digits only, no "+", spaces, or leading zero
  const whatsappNumber = phoneNumber.replace(/[^0-9]/g, "");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-6"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-[#1a0005] border border-[#C9A96E]/40 rounded-2xl p-8 max-w-sm w-full text-center shadow-[0_0_40px_rgba(201,169,110,0.15)]"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#f5e9dd]/50 hover:text-[#C9A96E] transition-colors text-lg"
          aria-label="Close"
        >
          ×
        </button>

        <div className="mx-auto mb-5 w-24 h-24 rounded-full overflow-hidden border-2 border-[#C9A96E]">
          <img
            src={ownerPhoto}
            alt={ownerName}
            className="w-full h-full object-cover"
          />
        </div>

        <p
          className="text-[#f5e9dd] text-lg mb-1"
          style={{ fontFamily: "Cinzel, serif" }}
        >
          {ownerName}
        </p>
        <p className="text-[#C9A96E]/70 text-xs uppercase tracking-widest mb-6">
          Call to Book Your Appointment
        </p>

        <p
          className="text-2xl text-[#C9A96E] tracking-wider mb-6"
          style={{ fontFamily: "Cinzel, serif" }}
        >
          {phoneNumber}
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={`tel:${phoneNumber}`}
            className="flex-1 border border-[#C9A96E] text-[#C9A96E] px-6 py-3 text-xs uppercase tracking-widest hover:bg-[#C9A96E] hover:text-[#1a0005] transition-colors duration-300"
          >
            Call Now
          </a>
          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-[#25D366]/10 border border-[#25D366]/60 text-[#25D366] px-6 py-3 text-xs uppercase tracking-widest hover:bg-[#25D366] hover:text-[#1a0005] transition-colors duration-300"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
