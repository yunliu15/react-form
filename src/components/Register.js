import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from '../api/axios';

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = '/register';

const Register = () => {
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState({
        value: '',
        validName: false,
        userFocus: false
    });

    const [pwd, setPwd] = useState({
        value: '',
        validPwd: false,
        pwdFocus: false
    });

    const [matchPwd, setMatchPwd] = useState({
        value: '',
        validMatch: false,
        matchFocus: false
    });

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    const handleUserChange = (e) => {
        setUser({
            ...user,
            value: e.target.value,
            validName: USER_REGEX.test(e.target.value)
        })
        setErrMsg('');
    }
    
    const handlePwdChange = (e) => {
        let newPwd = e.target.value;
        setPwd({...pwd, value: newPwd, validPwd: PWD_REGEX.test(newPwd)})
        setMatchPwd({...matchPwd, validMatch: newPwd === matchPwd});
        setErrMsg('');
    }

    const handleConfirmPwdChange = (e) => {
        let newPwd = e.target.value;
        setMatchPwd({...matchPwd, value: newPwd, validMatch: pwd.value === newPwd})
        setErrMsg('');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        // if button enabled with JS hack
        const v1 = USER_REGEX.test(user.value);
        const v2 = PWD_REGEX.test(pwd.value);
        if (!v1 || !v2) {
            setErrMsg("Invalid Entry");
            return;
        }
        try {
            const response = await axios.post(REGISTER_URL,
                JSON.stringify({ user:user.value, pwd:pwd.value }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
        
            setSuccess(true);
            //clear state and controlled inputs
            //need value attrib on inputs for this
            setUser({value: '',validName: false,userFocus: false});
            setPwd({value: '',validPwd: false,pwdFocus: false});
            setMatchPwd({value: '',validMatch: false,matchFocus: false});
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 409) {
                setErrMsg('Username Taken');
            } else {
                setErrMsg('Registration Failed')
            }
            errRef.current.focus();
        }
    }

    return (
        <>
            {success ? (
                <section>
                    <h1>Success!</h1>
                    <p>
                        <a href="/login">Sign In</a>
                    </p>
                </section>
            ) : (
                <section>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h1>Register</h1>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="username">
                            Username:
                            <FontAwesomeIcon icon={faCheck} className={user.validName ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={user.validName || !user.value ? "hide" : "invalid"} />
                        </label>
                        <input
                            type="text"
                            id="username"
                            ref={userRef}
                            autoComplete="off"
                            onChange={handleUserChange}
                            value={user.value}
                            required
                            aria-invalid={user.validName ? "false" : "true"}
                            aria-describedby="uidnote"
                            onFocus={() => setUser({...user, userFocus:true})}
                            onBlur={() => setUser({...user, userFocus:false})}
                        />
                        <p id="uidnote" className={user.userFocus && user.value && !user.validName ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            4 to 24 characters.<br />
                            Must begin with a letter.<br />
                            Letters, numbers, underscores, hyphens allowed.
                        </p>


                        <label htmlFor="password">
                            Password:
                            <FontAwesomeIcon icon={faCheck} className={pwd.validPwd ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={pwd.validPwd || !pwd.value ? "hide" : "invalid"} />
                        </label>
                        <input
                            type="password"
                            id="password"
                            onChange={handlePwdChange}
                            value={pwd.value}
                            required
                            aria-invalid={pwd.validPwd ? "false" : "true"}
                            aria-describedby="pwdnote"
                            onFocus={() => setPwd({...pwd, pwdFocus: true})}
                            onBlur={() => setPwd({...pwd, pwdFocus: false})}
                        />
                        <p id="pwdnote" className={pwd.pwdFocus && !pwd.validPwd ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            8 to 24 characters.<br />
                            Must include uppercase and lowercase letters, a number and a special character.<br />
                            Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                        </p>


                        <label htmlFor="confirm_pwd">
                            Confirm Password:
                            <FontAwesomeIcon icon={faCheck} className={matchPwd.validMatch && matchPwd.value ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={matchPwd.validMatch || !matchPwd.value ? "hide" : "invalid"} />
                        </label>
                        <input
                            type="password"
                            id="confirm_pwd"
                            onChange={handleConfirmPwdChange}
                            value={matchPwd.value}
                            required
                            aria-invalid={matchPwd.validMatch ? "false" : "true"}
                            aria-describedby="confirmnote"
                            onFocus={() => setMatchPwd({...matchPwd, matchFocus:true})}
                            onBlur={() => setMatchPwd({...matchPwd, matchFocus:false})}
                        />
                        <p id="confirmnote" className={matchPwd.matchFocus && !matchPwd.validMatch ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Must match the first password input field.
                        </p>

                        <button disabled={!user.validName || !pwd.validPwd || !matchPwd.validMatch ? true : false}>Sign Up</button>
                    </form>
                    <p>
                        Already registered?<br />
                        <span className="line">
                            {/*put router link here*/}
                            <a href="/login">Sign In</a>
                        </span>
                    </p>
                </section>
            )}
        </>
    )
}

export default Register
