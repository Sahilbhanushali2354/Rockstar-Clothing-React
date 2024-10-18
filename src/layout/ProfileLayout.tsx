import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { Outlet, useNavigate } from "react-router-dom";
import { auth } from "../common/config/firebase/firebase.config";

const ProfileLayout = () => {
    // const [loader, setLoader] = useState(false);
    const navigate = useNavigate();

    // Retrieve user data from localStorage
    const [user] = useState(() => {
        const storedUser = localStorage.getItem("auth");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const handleLogout = () => {
        // setLoader(true);
        signOut(auth)
            .then(() => {
                localStorage.clear();
                navigate("/auth/login");
            })
            .catch((error) => {
                console.error(error);
                // setLoader(false);
            });
    };

    useEffect(() => {
        if (!user) {
            navigate("/auth/login"); // Redirect to login if no user data is found
        }
    }, [user, navigate]);

    return (
        // <Spin spinning={loader} className="bg-gray-900 text-white min-h-screen flex flex-col">
        <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800">
            <div className="flex flex-col  bg-gray-900 items-center max-w-lg mx-auto p-6">
                <div className="w-full flex justify-between items-center mb-4">
                    <h1 className="text-2xl text-white font-bold">My Profile</h1>
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 hover:bg-red-700 transition duration-300 py-2 px-4 rounded-lg text-lg font-semibold"
                    >
                        Logout
                    </button>
                </div>
                {/* Content Area */}
                <Outlet />
            </div>
        </ div>
        // </Spin>
    );
};

export default ProfileLayout;
