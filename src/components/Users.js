import { useState,useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";

const Users = () => {
    const [users, setUsers] = useState();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(()=>{
        let isMounted = true;
        const controller = new AbortController();
        const getUsers = async () => {
            try {
                const response = await axiosPrivate.get('/users', {
                    signal: controller.signal
                })
                isMounted && setUsers(response.data);
            } catch(err) {
                console.error('users', err);
                if (err.response?.status === 403) {// got canceled error every time the component mounts, this is from the restrict developer mode. added the condition to avoid reditrection by canceled error
                    navigate('/login', {state: {from: location}, replace: true});
                }
                
            }
        }
        getUsers();

        return () => {
            isMounted = false;
            controller.abort();
        }
        
    }, [])
    return ( 
        <article>
            <h2>Users List</h2>
            {users?.length
                ? (
                    <ul>
                        {users.map((user, i)=> <li key={i}>{user?.username}</li>)}
                    </ul>
                ) : <p>No users to display</p>
            }
        </article>
     );
}
 
export default Users;