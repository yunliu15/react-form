import {useRef, useState, useEffect} from 'react';
import useAuth from '../hooks/useAuth';
import axios from '../api/axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const LOGIN_URL = '/login';

const Login = () => {
    const userRef = useRef();
    const errRef = useRef();
    const [errMsg, setErrMsg] = useState('');
    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const {setAuth, persist, setPersist} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    useEffect(() => {
        userRef.current.focus();
    }, [])

    const handleUserChange = (e) => {
        setUser(e.target.value);
        setErrMsg('');
    }
    const handlePwdChange = (e) => {
        setPwd(e.target.value);
        setErrMsg('');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const respons = await axios.post(LOGIN_URL, JSON.stringify({user, pwd}), {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            console.log(JSON.stringify(respons?.data))
            const accessToken = respons?.data?.accessToken;
            const roles = respons?.data?.roles;
            setAuth({user, pwd, roles, accessToken});
            setUser('');
            setPwd('');
            navigate(from, {replace: true});
        } catch(err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password')
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    }

    const togglePersist = () => {
        setPersist(prev => !prev);
    }

    useEffect(() => {
        localStorage.setItem('persist', persist)
    }, [persist])

    return (
        <section>
            <p
                ref={errRef}
                className={errMsg? "errmsg" : "offscreen"}
                aria-live="assertive"
            >
                {errMsg}
            </p>
            <h1>Sign In</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor='username'>Username:</label>
                <input 
                    type="text"
                    id="username"
                    ref={userRef}
                    autoComplete="off"
                    onChange={handleUserChange}
                    value={user}
                    required
                />
                <label htmlFor='password'>Password:</label>
                <input 
                    type="password"
                    id="password"
                    onChange={handlePwdChange}
                    value={pwd}
                    required
                />
                <button>Sign In</button>

                <div className="persistCheck">
                    <input
                        type="checkbox"
                        id="persist"
                        onChange={togglePersist}
                        checked={persist}
                    />
                    <label htmlFor="persist">Trust This Device</label>
                </div>
            </form>
            <p>
                Need an Account?<br />
                <span className="line">
                    {/*put router link here*/}
                    <a href="/register">Sign Up</a>
                </span>
            </p>
        </section>
    );
}
 
export default Login;