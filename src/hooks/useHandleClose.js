import { useNavigate } from 'react-router-dom';

export const useHandleClose = () => {
  const navigate = useNavigate()

  const handleClose = () => {
    navigate(-1)
  }

  return handleClose;
}