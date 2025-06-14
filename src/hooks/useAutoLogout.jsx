import { useEffect } from "react";
import { useAuth } from "../Context/AuthContext";

const useAutoLogout = (timeout = 15 * 60 * 1000) => {
    const { logout } = useAuth();

    useEffect(()=>{
        let timer;
        const resetTimer = () => {
            clearTimeout(timer);
            timer=setTimeout(()=>{
                alert('Session Expired, Please Login again');
                logout();
            },timeout);
        };
        const events = ['click', 'mousemove', 'keydown'];
        events.forEach((event)=> window.addEventListener(event, resetTimer));
        resetTimer();
        return () => {
            events.forEach((event)=> window.removeEventListener(event, resetTimer));
            clearTimeout(timer);
        }
    },[logout, timeout]);
}

export default useAutoLogout