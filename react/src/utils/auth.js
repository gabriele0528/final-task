export const getTokenData = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(window.atob(base64));
    } catch (error) {
        return null;
    }
};

export function getAuthHeader() {
    const token = localStorage.getItem("token");
    if (!token) return {};
    return {
        Authorization: token
    };


}; 