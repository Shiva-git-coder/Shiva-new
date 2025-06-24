import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import AuthService from './AuthService';
import Loader from '../ReusableComponent/Loader';

const ProtectedRoute = ({ allowedRoles }) => {
    const [details, setDetails] = useState({});
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const fetchUser = async () => {
        const user = await AuthService.getCurrentUSer();
        setDetails(user);
        setLoading(false);
    };
    useEffect(() => { fetchUser() }, [location]);
    if (loading) {
        return <div style={{display:"flex",justifyContent:"center"}}><Loader /></div>;
    }
    const hasPermission = details?.roles?.some(role => allowedRoles.includes(role));
    return hasPermission ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
};
export default ProtectedRoute;