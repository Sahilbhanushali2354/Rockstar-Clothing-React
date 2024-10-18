import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";

const Profile = () => {
  const navigate = useNavigate();

  // Retrieve user data from localStorage
  const [user] = useState(() => {
    const storedUser = localStorage.getItem("auth");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const initials = user ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase() : "";

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };

  // const handleLogout = () => {
  //   setLoader(true);
  //   signOut(auth)
  //     .then(() => {
  //       localStorage.clear();
  //       navigate("/auth/login");
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //       setLoader(false);
  //     });
  // };

  useEffect(() => {
    if (!user) {
      navigate("/auth/login"); // Redirect to login if no user data is found
    }
  }, [user, navigate]);

  return (
    <Spin className="bg-gradient-to-b from-gray-800 to-gray-900 text-white p-5 min-h-screen flex flex-col items-center justify-center">
      <main className="flex-grow flex items-center justify-center">
        <div className="bg-gray-700 rounded-lg w-full max-w-md p-8 mx-auto shadow-lg transform transition-all hover:scale-105">
          <div className="bg-gradient-to-r from-blue-400 to-teal-400 rounded-full w-32 h-32 flex items-center justify-center text-6xl mx-auto mb-6 text-white shadow-md">
            {initials}
          </div>
          <h2 className="text-4xl font-extrabold text-center mb-2">{user ? `${user.firstName} ${user.lastName}` : "User"}</h2>
          <p className="text-gray-300 text-center mb-4">{user ? user.email : "Email not found"}</p>
          <div className="flex flex-col space-y-4 mt-6">
            <button
              onClick={handleEditProfile}
              className="bg-green-500 hover:bg-green-600 transition duration-300 py-3 rounded-lg w-full text-lg font-semibold shadow-lg"
            >
              Edit Profile
            </button>
            {/* <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 transition duration-300 py-3 rounded-lg w-full text-lg font-semibold shadow-lg"
            >
              Logout
            </button> */}
          </div>
        </div>
      </main>
    </Spin>
  );
};

export default Profile;
