import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { jwtDecode } from 'jwt-decode';

const RequireAuth = ({ allowedRoles }) => {
    const { auth } = useAuth();
    const location = useLocation();

    const token = auth?.accessToken;

    let roles = [];
    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            roles = decodedToken?.roles || []; // Get roles from decoded token
        } catch (error) {
            console.error("Failed to decode token", error);
        }
    }

    return (
        roles.find(role => allowedRoles?.includes(role)) 
            ? <Outlet />
            : auth?.user
                ? <Navigate to="/unauthorized" state={{ from: location }} replace />
                : <Navigate to="/login" state={{ from: location }} replace />
    );
}

export default RequireAuth;