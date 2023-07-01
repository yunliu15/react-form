import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
    const { setAuth } = useAuth();
    const refresh = async () => {
        const response = await axios.get('/refresh', {
            withCredentials: true
        });
        const newToken = await response.data.accessToken;
        setAuth(prev => {
            console.log(JSON.stringify(prev));
            console.log(newToken);
            return {...prev, accessToken: newToken};
        });
        return newToken;

    }
    return refresh;
}
 
export default useRefreshToken;