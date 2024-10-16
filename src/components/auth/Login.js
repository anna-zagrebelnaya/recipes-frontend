import React from 'react'
import { useRef, useState, useEffect, useContext } from 'react'
import AuthContext from "../../context/AuthProvider";
import useAuth from "../../hooks/useAuth";
import { Link, useNavigate, useLocation } from 'react-router-dom';

import axios from '../../api/axios';
const LOGIN_URL = '/api/auth/signin';

const Login = () => {
    const { setAuth } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.post(LOGIN_URL, 
                JSON.stringify({ "username": user, "password": pwd }),
                {
                    headers: { 'Content-Type': 'application/json'},
                    withCredentials: true
                }
            );
            const accessToken = response?.data?.accessToken;
            setAuth({ user, pwd, accessToken });
            setUser('');
            setPwd('');
            navigate(from, {replace: true});
        } catch(err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <section>
                    <p ref={errRef} className={errMsg ? "text-red-500 text-sm mb-4" : "sr-only"}
                    aria-live='assertive'>{errMsg}</p>
                    <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign In</h1>
                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="username" className="sr-only">Username:</label>
                                <input
                                    type="text"
                                    id="username"
                                    ref={userRef}
                                    autoComplete='off'
                                    onChange={(e) => setUser(e.target.value)}
                                    value={user}
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Username"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="sr-only">Password:</label>
                                <input
                                    type="password"
                                    id="password"
                                    onChange={(e) => setPwd(e.target.value)}
                                    value={pwd}
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Password"
                                />
                            </div>
                        </div>
                        <div>
                            <button className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                Sign In
                            </button>
                        </div>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Need an account?{' '}
                            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Sign Up
                            </a>
                        </p>
                    </form>
                </section>
            </div>
        </div>
    )
}

export default Login