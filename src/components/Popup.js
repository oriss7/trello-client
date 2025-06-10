import { useEffect, useRef } from 'react';

export default function Popup({ children, handleClose, className = '' }) {
  const popupRef = useRef();

  // const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        handleClose();
        window.history.back()
        if (!isMobile) {
          window.history.back()
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

    window.history.pushState({ popup: true }, '');

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('popstate', handleBackButton);

    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('popstate', handleBackButton);
      document.body.style.overflow = '';
    };
  }, []);
  // }, [handleClose, isMobile]);

  return (
    <div className="popup-overlay">
      <div className={`popup ${className}`} ref={popupRef}>
        <button className="close-button pointer"
          onClick={() => { window.history.back();
          if (!isMobile) { window.history.back();}handleClose();}}>
          &times;</button>
        {children}
      </div>
    </div>
  );
}