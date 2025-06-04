import { useEffect } from 'react';
import { useHandleClose } from './useHandleClose';

const useCloseOnOutsideClick = () => {
  const handleClose = useHandleClose();
  
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (window.innerWidth > 450) {
        // const popupElement = document.querySelector(['.popup','.popup-post']);
        const popupElement = document.querySelector(['.popup']);
        if (popupElement && !popupElement.contains(event.target)) {
          handleClose();
        }
      }
    }

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return handleClose;
};

export default useCloseOnOutsideClick;