"use client";

import { useEffect, useState } from "react";
import { Layout, Menu, Dropdown, Avatar, Switch, message, Button, Drawer } from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
    UserOutlined,
    LogoutOutlined,
    DashboardOutlined,
    SettingOutlined,
    MenuFoldOutlined,
} from "@ant-design/icons";
import { signOut } from "firebase/auth";
import { auth } from "../common/config/firebase/firebase.config";

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [isAdmin, setIsAdmin] = useState(true);
    const [isDrawerVisible, setDrawerVisible] = useState(false); // Mobile menu state
    const [screenWidth, setScreenWidth] = useState(window.innerWidth); // Track screen width

    const [userData] = useState(() => {
        const storedUser = localStorage.getItem("auth");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const navigate = useNavigate();

    // Monitor screen width changes
    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (userData?.role === "user") {
            navigate("/");
        }
    }, [navigate, userData]);

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                localStorage.clear();
                navigate("/auth/login");
                message.success("Logout Successful");
            })
            .catch((err) => message.error(err.message));
    };

    const profileMenu = (
        <Menu>
            <Menu.Item key="1" icon={<SettingOutlined />} onClick={() => navigate("/profile")}>
                Profile Settings
            </Menu.Item>
            <Menu.Item key="2" icon={<LogoutOutlined />} onClick={handleLogout}>
                Logout
            </Menu.Item>
        </Menu>
    );

    const SidebarContent = () => (
        <div className="h-full">
            <div className="h-16 text-white flex items-center justify-center text-2xl font-bold">
                {collapsed ? "AD" : "Admin"}
            </div>
            <Menu theme="dark" mode="inline">
                <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
                    <Link to="/admin">Dashboard</Link>
                </Menu.Item>
                <Menu.Item key="users" icon={<UserOutlined />}>
                    <Link to="/admin/users">Users</Link>
                </Menu.Item>
                <Menu.Item key="products" icon={<DashboardOutlined />}>
                    <Link to="/admin/products">Products</Link>
                </Menu.Item>
                <Menu.Item key="orders" icon={<DashboardOutlined />}>
                    <Link to="/admin/orders">Orders</Link>
                </Menu.Item>
            </Menu>
        </div>
    );


    return (
        <Layout className="min-h-screen">
            {/* Sidebar for Desktop */}
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={setCollapsed}
                breakpoint="lg"
                width={250}
                className="hidden lg:block"
                style={{ height: '100vh', position: 'fixed', left: 0, top: 0 }}
            >
                {SidebarContent()}
            </Sider>

            {/* Drawer for Mobile */}
            <Drawer
                title="Admin Menu"
                placement="left"
                onClose={() => setDrawerVisible(false)}
                open={isDrawerVisible}
                className="lg:hidden"
                style={{ padding: 0 }}
            >
                {SidebarContent()}
            </Drawer>

            {/* Main Layout */}
            <Layout
                style={{
                    marginLeft: screenWidth < 768 ? 0 : collapsed ? 80 : 250, // Adjust margin conditionally
                    transition: 'margin-left 0.3s ease',
                }}
            >
                <Header className="bg-[#001529] px-4 lg:px-6 flex justify-between items-center shadow-md sticky top-0 z-50">
                    <Button
                        type="text"
                        icon={<MenuFoldOutlined />}
                        className="lg:hidden text-white"
                        onClick={() => setDrawerVisible(true)}
                    />
                    <h1 className="text-lg lg:text-2xl font-bold text-white">
                        {isAdmin ? "Admin Dashboard" : "User Dashboard"}
                    </h1>
                    <div className="flex items-center gap-4">
                        <span className="text-sm lg:text-lg text-white">
                            {isAdmin ? "Admin" : "User"}
                        </span>
                        <Switch
                            checked={isAdmin}
                            onChange={(checked) => {
                                setIsAdmin(checked);
                                navigate(checked ? "/admin" : "/");
                            }}
                        />
                        <Dropdown overlay={profileMenu} trigger={["click"]}>
                            <Avatar
                                size="large"
                                icon={<UserOutlined />}
                                className="cursor-pointer"
                            />
                        </Dropdown>
                    </div>
                </Header>

                <Content className="p-4 lg:p-8 bg-gray-100" style={{ overflowY: "auto" }}>
                    <div className="max-w-7xl mx-auto">
                        {/* Scrollable Table Container */}
                        <div className="overflow-x-auto">
                            <Outlet />
                        </div>
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;
