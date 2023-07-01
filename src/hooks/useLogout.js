import useAuth from "./useAuth";
import axios from "../api/axios";

const useLogout = () => {
    const {setAuth} = useAuth();

    const logout = async () => {
        setAuth({});
        try {
            await axios.get('/logout', {withCredentials: true});
        } catch(err) {
            console.error(err)
        }
    }

    return logout;
}
 
export default useLogout;