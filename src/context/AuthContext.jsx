import {createContext,useState ,useEffect} from "react";
import { refreshToken } from "../services/authService";
import { setToken ,clearToken } from "../utils/tokenManager";
import { registerLogout } from "../utils/authManager";
import { getProfile } from "../services/userService";


export const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
    const [user,setUser] = useState(()=>{
        const storedUser = localStorage.getItem("user");
       
        return storedUser ? JSON.parse(storedUser) : null
    })
    const [isLoading,setIsLoading] = useState(true);
    const [accessToken,setAccessToken] = useState(null);
    const logoutDevice = () =>{
        setUser(null);
        clearToken();
        setAccessToken(null);
    }
    useEffect(()=>{
        registerLogout(logoutDevice);
    },[])
    
    useEffect(()=>{
        if(user){
            localStorage.setItem("user",JSON.stringify(user));
        }else{
            localStorage.removeItem("user");
        }
        
    },[user])

   const restoreSession = async () => {
  try {
    const response = await refreshToken();
    setAccessToken(response.accessToken);
    setToken(response.accessToken);

    try {
      const freshUser = await getProfile();
      setUser(freshUser);
    } catch (profileError) {
      console.error("Failed to fetch fresh profile:", profileError);
     
    }

  } catch (error) {
    console.error(error);
    setAccessToken(null);
    setUser(null);
    clearToken();
  } finally {
    setIsLoading(false);
  }
};

    useEffect(()=>{
        restoreSession();
    },[])

    const value = {
        user,
        setUser,
        accessToken,
        setAccessToken,
        isLoading,
        logoutDevice
        
    }
    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )

   
    
}