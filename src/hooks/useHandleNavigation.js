import { useNavigate, useLocation } from 'react-router-dom';

export const useHandleNavigation = () => {
    const navigate = useNavigate();
    const location = useLocation()
    const basePath = location.pathname
    
    const handleNavigation = (path) => {
        if (path !== basePath) {
            navigate(path);
        }
    };
    return handleNavigation;
}