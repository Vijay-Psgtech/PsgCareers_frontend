import { createContext,useContext,useState } from "react";
const AuthContext = createContext();
export const AuthProvider = ({children})=>{
    const [auth,setAuth] = useState({
        token:localStorage.getItem('token'),
        role:localStorage.getItem('role'),
        name:localStorage.getItem('name'),
        userId:localStorage.getItem('userId'),
    });

    const login = (token,role,name,userId) =>{
        localStorage.setItem('token',token);
        localStorage.setItem('role',role);
        localStorage.setItem('name',name);
        localStorage.setItem('userId',userId);
        setAuth({token,role,name,userId});
    };

    const logout = (token,role,name,userId) =>{
        localStorage.clear();
        setAuth({token:null,role:null,name:null,userId:null});
    };

    return(
        <AuthContext.Provider value={{auth,login,logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);