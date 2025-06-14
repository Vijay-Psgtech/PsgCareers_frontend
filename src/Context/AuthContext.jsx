import { createContext,useContext,useState } from "react";
const AuthContext = createContext();
export const AuthProvider = ({children})=>{
    const [auth,setAuth] = useState({
        token:localStorage.getItem('token'),
        role:localStorage.getItem('role'),
        name:localStorage.getItem('name'),
        userId:localStorage.getItem('userId'),
        jobCategory:localStorage.getItem('jobCategory'),
    });

    const login = (token,role,name,userId,jobCategory) =>{
        localStorage.setItem('token',token);
        localStorage.setItem('role',role);
        localStorage.setItem('name',name);
        localStorage.setItem('userId',userId);
        localStorage.setItem('jobCategory',jobCategory);
        setAuth({token,role,name,userId,jobCategory});
    };

    const logout = (token,role,name,userId,jobCategory) =>{
        localStorage.clear();
        setAuth({token:null,role:null,name:null,userId:null,jobCategory:null});
    };

    return(
        <AuthContext.Provider value={{auth,login,logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);