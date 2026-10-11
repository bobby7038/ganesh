/**
 * WhatsApp Helper Utility for Mobile and Desktop
 * Handles phone number normalization, mobile deep-linking, and WhatsApp Web fallback.
 */

export function formatWhatsAppPhone(phone) {
  if (!phone) return '';
  let digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    digits = `91${digits}`;
  } else if (digits.length === 11 && digits.startsWith('0')) {
    digits = `91${digits.slice(1)}`;
  }
  return digits;
}

export function isMobileDevice() {
  if (typeof navigator === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(navigator.userAgent);
}

export function openWhatsApp({ phone = '', text = '', fallbackWebShare = true }) {
  const digits = formatWhatsAppPhone(phone);
  const encoded = encodeURIComponent(text);
  const isMobile = isMobileDevice();

  if (isMobile) {
    // Check if Web Share API can be used when phone number is absent
    if (!digits && fallbackWebShare && typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: 'Chanda Receipt',
        text: text
      }).catch(() => {
        // Fallback to wa.me if share dismissed
        window.location.href = `https://wa.me/?text=${encoded}`;
      });
      return;
    }

    // Direct deep-link to WhatsApp app on mobile (works with WhatsApp and WhatsApp Business)
    const mobileSchemeUrl = digits 
      ? `whatsapp://send?phone=${digits}&text=${encoded}` 
      : `whatsapp://send?text=${encoded}`;
      
    const waMeUrl = digits 
      ? `https://wa.me/${digits}?text=${encoded}` 
      : `https://wa.me/?text=${encoded}`;

    // Navigating current window directly prevents mobile popup blockers
    window.location.href = waMeUrl;
  } else {
    // Desktop: prefer Web WhatsApp or wa.me
    const desktopUrl = digits 
      ? `https://web.whatsapp.com/send?phone=${digits}&text=${encoded}` 
      : `https://web.whatsapp.com/send?text=${encoded}`;
    window.open(desktopUrl, '_blank', 'noopener,noreferrer');
  }
}
