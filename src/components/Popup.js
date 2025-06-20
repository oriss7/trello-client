import { useEffect, useRef } from 'react';

export default function Popup({ children, handleClose, className = '', disablePopupEffect = false }) {
  const popupRef = useRef();

  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (window.innerWidth < 525) return;
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        handleClose();
        if (!disablePopupEffect) {
          window.history.back()
          if (!isMobile) {
            window.history.back()
          }
        }
      }
    };

    const handleBackButton = (e) => {
      e.preventDefault();
      handleClose();
      if (!isMobile) {
        window.history.back()
      }
    };
    
    if (!disablePopupEffect) {
      window.history.pushState({ popup: true }, '');
      window.addEventListener('popstate', handleBackButton);
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (!disablePopupEffect) {
        window.removeEventListener('popstate', handleBackButton);
      }
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="popup-overlay">
      <div className={`popup ${className}`} ref={popupRef}>
        <button className="close-button pointer"
          onClick={() => { if (!disablePopupEffect) { window.history.back();
          if (!isMobile) window.history.back() } handleClose();}}>
          &times;</button>
        {children}
      </div>
    </div>
  );
}