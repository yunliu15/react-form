import {createContext, useState} from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const AuthContext = createContext({});

export const AuthProvider = ({children}) => {
    const [auth, setAuth] = useState({});
    const [persist, setPersist] = useLocalStorage('persist', false)
    return (
        <AuthContext.Provider value={{auth,setAuth, persist, setPersist}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;