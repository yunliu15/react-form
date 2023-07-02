import {useState, useEffect} from 'react';
import useAuth from '../hooks/useAuth';
import useRefreshToken from '../hooks/useRefreshToken';
import { Outlet } from 'react-router-dom';

const PersistLogin = () => {
    const [isLoading, setIsLodaing] = useState(true);
    const refresh = useRefreshToken();
    const {auth, persist} = useAuth();

    useEffect(() => {
        let isMounted = true;
        const verifyRefreshToken = async () => {
            try {
                await refresh();
            } catch(err) {
                console.error(err)
            } finally {
                isMounted && setIsLodaing(false)
            }
        }
        !auth?.accessToken && persist? verifyRefreshToken() : setIsLodaing(false)

        return () => isMounted = false;
    }, []);

    return ( 
        <>
        {
            !persist?
                <Outlet />
            : isLoading
                ? <p>Loading...</p>
                : <Outlet />
        }
        </>
     );
}
 
export default PersistLogin;