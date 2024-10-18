import { useState } from "react";
import { CiShoppingCart } from "react-icons/ci";
import { BsChevronCompactUp } from "react-icons/bs";
import { BiSearch } from "react-icons/bi";
import { Avatar, Dropdown, Menu, message, Spin, Switch } from "antd";
import SearchBar from "./SearchBar";
import { Link, useNavigate } from "react-router-dom";
import { SettingOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { signOut } from "firebase/auth";
import { auth } from "../common/config/firebase/firebase.config";

const Navbar = () => {
    const [loader, setLoader] = useState<boolean>(false)
    const [showNav, setShowNav] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false); // Track Admin/User mode
    const [userData] = useState(() => {
        const storedUser = localStorage.getItem("auth");
        return storedUser ? JSON.parse(storedUser) : null;
    });
    // console.log('-------userData navbar', userData.role)
    const navigate = useNavigate();

    const profileMenu = (
        <Menu>
            <Menu.Item key="1" icon={<SettingOutlined />} onClick={() => navigate("/profile")}>
                Profile Settings
            </Menu.Item>
            <Menu.Item key="2" icon={<LogoutOutlined />} onClick={() => handleLogout()}>
                Logout
            </Menu.Item>
        </Menu>
    );

    // Handle switch between Admin/User dashboard
    const handleToggleMode = (checked: boolean) => {
        setLoader(true)
        setIsAdmin(checked);
        navigate(checked ? "/admin" : "/");
    };

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                localStorage.clear();
                navigate("/auth/login");
                message.success("Logout Successful");
            })
            .catch((err) => {
                message.error(err.message);
            });
    };

    return (
        <Spin spinning={loader} className="w-full h-[100vh]">
            <div className="relative z-50 bg-gradient-to-r from-gray-800 to-slate-800">
                <div className="flex items-center justify-between py-4">
                    <div className="flex items-center md:space-x-10 lg:space-x-20">
                        <div className="font-semibold text-2xl text-white">
                            <Link to="/">Rockstar</Link>
                        </div>
                        <nav className="max-md:hidden">
                            <ul className="flex items-center lg:space-x-10 space-x-7 opacity-70 text-[15px] text-gray-400">
                                <li>
                                    <Link to="/" className="py-3 inline-block w-full">
                                        Shop
                                    </Link>
                                </li>
                                <li className="relative">
                                    <div
                                        onClick={() => setShowDropdown(!showDropdown)}
                                        className="cursor-pointer py-3 inline-block w-full hover:text-white"
                                    >
                                        Our Products
                                    </div>
                                    {showDropdown && (
                                        <div
                                            className="absolute top-full mt-2 bg-gray-800 text-white rounded-lg shadow-lg py-2 w-48 z-50 border border-gray-700"
                                            onMouseLeave={() => setShowDropdown(false)}
                                        >
                                            <ul className="flex flex-col">
                                                <li className="hover:bg-gray-700 p-2">
                                                    <Link to="/category/jeans">Jeans</Link>
                                                </li>
                                                <li className="hover:bg-gray-700 p-2">
                                                    <Link to="/category/shirts">Shirts</Link>
                                                </li>
                                                <li className="hover:bg-gray-700 p-2">
                                                    <Link to="/category/t-shirts">T-Shirts</Link>
                                                </li>
                                                <li className="hover:bg-gray-700 p-2">
                                                    <Link to="/category/track-pants">Track Pants</Link>
                                                </li>
                                                <li className="hover:bg-gray-700 p-2">
                                                    <Link to="/category/shorts">Shorts</Link>
                                                </li>
                                                <li className="hover:bg-gray-700 p-2">
                                                    <Link to="/category/socks">Socks</Link>
                                                </li>
                                                <li className="hover:bg-gray-700 p-2">
                                                    <Link to="/category/undergarments">Undergarments</Link>
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </li>
                            </ul>
                        </nav>
                    </div>
                    <div className="flex items-center space-x-4">
                        <SearchBar />
                        <Dropdown overlay={profileMenu} trigger={["click"]}>
                            <Avatar size="large" icon={<UserOutlined />} className="cursor-pointer" />
                        </Dropdown>
                        <Link to="/cart">
                            <div className="p-2 bg-gray-100 rounded-full">
                                <CiShoppingCart color="black" size={20} />
                            </div>
                        </Link>
                        {/* Toggle Admin/User Mode - Shown only if user is admin */}
                        {userData?.role && userData.role === "admin" && (
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-white">{isAdmin ? "Admin" : "User"}</span>
                                <Switch
                                    checked={isAdmin}
                                    onChange={handleToggleMode}
                                    checkedChildren="Admin"
                                    unCheckedChildren="User"
                                />
                            </div>
                        )}
                        <span
                            onClick={() => setShowNav(!showNav)}
                            className="p-[9px] bg-gray-100 rounded-full md:hidden"
                        >
                            <BsChevronCompactUp
                                color="black"
                                className={`transition ease-in duration-150 ${showNav ? "rotate-180" : "0"
                                    }`}
                            />
                        </span>
                    </div>
                </div>
                <div
                    className={`md:hidden ${showNav ? "pb-4 px-5" : "h-0 invisible opacity-0"
                        }`}
                >
                    <ul className="flex flex-col text-[15px] opacity-75 px-2 text-gray-400">
                        <li>
                            <Link to="/shop" className="py-3 inline-block w-full">
                                Shop
                            </Link>
                        </li>
                        <li>
                            <Link to="/filters" className="py-3 inline-block w-full">
                                Filters
                            </Link>
                        </li>
                        <li>
                            <Link to="/myproducts" className="py-3 inline-block w-full">
                                My Product
                            </Link>
                        </li>
                    </ul>
                    <div className="flex items-center bg-gray-100 p-2 rounded-lg my-4 py-3">
                        <input
                            type="text"
                            className="outline-none w-full bg-transparent ml-2 caret-blue-500 placeholder:font-light placeholder:text-gray-600 text-[15px]"
                            placeholder="Search"
                            autoComplete="off"
                        />
                        <button>
                            <BiSearch size={20} className="opacity-50" />
                        </button>
                    </div>
                </div>
            </div>
        </Spin>
    );
};

export default Navbar;
