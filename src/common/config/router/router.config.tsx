import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../../../layout/MainLayout";
import Dashboard from "../../../pages/Dashboard";
import Cart from "../../../pages/Car";
import Profile from "../../../pages/ProfileDashboard";
import Category from "../../../pages/category";
import AdminLayout from "../../../layout/AdminLayout";
import AdminDashboard from "../../../pages/AdminDashboard";
import AuthLayout from "../../../layout/AuthLayout";
import Login from "../../../pages/Login";
import Signup from "../../../pages/signup";
import ProfileLayout from "../../../layout/ProfileLayout";
import AddProduct from "../../../admin/pages/AddProduct";
import ProductList from "../../../admin/pages/ProductList";

export const Router = createBrowserRouter([
    {
        element: <MainLayout />,
        children: [
            {
                path: '/',
                element: <Dashboard />
            },
            {
                path: '/cart',
                element: <Cart />
            },

            {
                path: '/category/:id',
                element: <Category />
            },

        ]
    },
    {
        element: <AuthLayout />,
        children: [
            {
                path: '/auth/login',
                element: <Login />
            },
            {
                path: '/auth/signup',
                element: <Signup />
            }
        ]
    },
    {
        element: <AdminLayout />,
        children: [
            {
                path: '/admin',
                element: <AdminDashboard />
            },
            {
                path: '/admin/addproduct',
                element: <AddProduct />
            },
            {
                path: '/admin/category/:id',
                element: <ProductList />
            }
        ]
    }, {
        element: <ProfileLayout />,
        children: [
            {
                path: '/profile',
                element: <Profile />
            }
        ]
    }
])