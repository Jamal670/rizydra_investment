import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthTokenFromCookies, isTokenValid } from '../utils/cookieUtils';

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = () => {
            const token = getAuthTokenFromCookies();
            
            if (!token || !isTokenValid(token)) {
                alert('Your session has expired. Please login again');
                navigate('/login');
                return false;
            }
            
            setIsAuthenticated(true);
            setIsLoading(false);
            return true;
        };

        checkAuth();
    }, [navigate]);

    return { isAuthenticated, isLoading };
}; 