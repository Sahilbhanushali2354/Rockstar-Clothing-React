import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { auth } from "../common/config/firebase/firebase.config";
import { Spin } from "antd";


const AuthLayout = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate()
    useEffect(() => {
        const x = onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate("/");
            }
        });

        return () => x();
    }, [navigate]);
    return (
        <Spin spinning={isLoading} style={{ marginTop: '60%' }}>
            <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800">
                <div className="w-full max-w-lg mx-auto bg-gray-800 p-10 rounded-3xl shadow-2xl transition-transform transform hover:scale-105 duration-500">
                    <h2 className="text-4xl font-extrabold text-center text-white mb-10 tracking-wide">
                        Welcome To Rockstar Men's Boutique </h2>
                    <Outlet context={{ setLoader: setIsLoading }} />
                </div>
            </div>
        </Spin>
    );
};

export default AuthLayout;
