"use client";

import { auth, FStore } from "../common/config/firebase/firebase.config";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";

type OutletContextType = { setLoader: (state: boolean) => void };


const LoginPage: React.FC = () => {
    // const [loader, setLoader] = useState<boolean>(false);
    const { setLoader } = useOutletContext<OutletContextType>();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setLoader(false)
                navigate("/");
            }
        });
        return unsubscribe;
    }, [navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoader(true);

        const newErrors: { email?: string; password?: string } = {};

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "Please enter a valid email address.";
        }
        if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters long.";
        }

        if (Object.keys(newErrors).length > 0) {
            setLoader(false);
            return setErrors(newErrors);
        }

        try {
            setLoader(true)
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Retrieve the user's data from Firestore
            const userDoc = await getDoc(doc(FStore, "users", user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                console.log('--------userData', userData);
                localStorage.setItem("auth", JSON.stringify(userData));
                setLoader(false)
                navigate(userData.role === "admin" ? "/admin" : "/");
            } else {
                setLoader(false)
                setErrors({ email: "User not found in database." });
            }
        } catch (error: any) {
            setLoader(false)
            setErrors({ email: error.message });
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg">
                <div className="mb-8">
                    <label className="block text-sm text-gray-400 mb-2">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg border-2 ${errors.email ? "border-red-500" : "border-gray-700"
                            } bg-gray-900 text-white`}
                        placeholder="Enter your email"
                    />
                    {errors.email && <p className="text-red-500 mt-2">{errors.email}</p>}
                </div>

                <div className="mb-8">
                    <label className="block text-sm text-gray-400 mb-2">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg border-2 ${errors.password ? "border-red-500" : "border-gray-700"
                            } bg-gray-900 text-white`}
                        placeholder="Enter your password"
                    />
                    {errors.password && <p className="text-red-500 mt-2">{errors.password}</p>}
                </div>

                <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:scale-110 transition-all"
                >
                    Login
                </button>
            </form>

            <p className="text-center text-gray-400 mt-6">
                Don't have an account?{" "}
                <Link to="/auth/signup" className="text-blue-500 hover:underline">
                    Sign Up
                </Link>
            </p>
        </div>
    );
};

export default LoginPage;
