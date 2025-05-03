import { useState } from "react";
import { FaRegEye, FaRegEyeSlash, FaGoogle } from "react-icons/fa";
import { useAuth } from "./AuthProvider";
import axios from "axios";
import { Link } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isShowPassword, setIsShowPassword] = useState(false);
    const { login } = useAuth();

    const toggleShowPassword = () => {
        setIsShowPassword(!isShowPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsLoading(true);
        setError(null);

        if (!email.trim()) {
            setIsLoading(false);
            setError("Please enter your email address.");
            return;
        }

        if (!password.trim()) {
            setIsLoading(false);
            setError("Please enter the password.");
            return;
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/login`, { email, password });
            login(response.data);
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="auth-page">
            <div className="bg-darken-overlay"></div>
            <div className="auth-container">
                <h1 className="logo-header">Starward Notes</h1>
                <form className="auth-form login-form" onSubmit={handleSubmit}>
                    <div className="auth-form-header">
                        <h1>Welcome Back</h1>
                        <p>Login to access your notes</p>
                    </div>
                    <input
                        className="credentials-input"
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        placeholder="Email"
                        disabled={isLoading}
                    />
                    <div className="credentials-container">
                        <input
                            className="credentials-input"
                            type={isShowPassword ? "text" : "password"}
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            placeholder="Password"
                            disabled={isLoading}
                        />
                        {password.trim() &&
                            <div className="credentials-action" onClick={toggleShowPassword}>
                                {isShowPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                            </div>
                        }
                    </div>

                    {isLoading ?
                        <button className="auth-btn" disabled>
                            <span className="loader"></span>
                            <span className="auth-btn-on-loading">Logging in</span>
                        </button>
                        :
                        <button className="auth-btn">Log in</button>
                    }

                    {error && <div className="auth-error">{error}</div>}

                    {/* <div className="divider">OR</div>
                    <div className="google-auth"><FaGoogle />Google</div> */}
                    <div className="auth-hint">
                        <p>Don't have an account?</p>
                        <Link to={"/signup"}>Sign up</Link>
                    </div>
                </form>
            </div >
        </div>
    );
}

export default Login;