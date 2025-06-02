import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { toast } from "react-toastify";

export default function PrivateRoute({children}){
    const {auth} = useAuth();
    if(!auth.token){
        // Not logged In redirect to login
        return <Navigate to="/login" replace/>;
    }
    if(auth.role == 'user'){
        toast.error('Access Denied');
        return <Navigate to="/careers" replace/>;
    }

    // Logged In show the page
    return children
}