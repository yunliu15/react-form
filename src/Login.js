import {useRef, useState, useEffect, useContext} from 'react';
import AuthContext from './context/AuthProvider';
import axios from './api/axios';

const LOGIN_URL = '/login';

const Login = () => {
    const userRef = useRef();
    const errRef = useRef();
    const [errMsg, setErrMsg] = useState('');
    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [success, setSuccess] = useState(false);
    const {setAuth} = useContext(AuthContext);

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
                headers: {'Content-Type':'application/json', withCredentials: true}
            });
            console.log(JSON.stringify(respons?.data))
            const accessToken = respons?.data?.accessToken;
            const roles = respons?.data?.roles;
            setAuth({user, pwd, roles, accessToken});
            setUser('');
            setPwd('');
            setSuccess(true)
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

    return (
        <>
        {
            success? (
                <section>
                    <h1>You are logged in!</h1>
                    <br />
                    <p>
                        <a href="#">Go to Home</a>
                    </p>
                </section>
            ) : (

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
                </form>
                <p>
                    Need an Account?<br />
                    <span className="line">
                        {/*put router link here*/}
                        <a href="#">Sign Up</a>
                    </span>
                </p>
            </section>
        )
        }
        </>
    );
}
 
export default Login;