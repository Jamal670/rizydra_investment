// Utility function to get authentication token from cookies
export const getAuthTokenFromCookies = () => {
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => 
        cookie.trim().startsWith('authToken=')
    );
    
    if (tokenCookie) {
        return tokenCookie.split('=')[1];
    }
    
    return null;
};

// Utility function to check if token is valid (basic validation)
export const isTokenValid = (token) => {
    if (!token) return false;
    
    try {
        // Basic JWT token validation (check if it's not expired)
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        
        return payload.exp > currentTime;
    } catch (error) {
        return false;
    }
}; 