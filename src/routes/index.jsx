import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

// USER PAGES
import HomePage from "../pages/HomePage";
import ProductsPage from "../pages/ProductsPage";
import ProductDetailPage from "../pages/ProductDetailPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import CartPage from "../pages/CartPage";
import CheckoutPage from "../pages/CheckoutPage";
import ProfilePage from "../pages/ProfilePage";
import AiImageSearchPage from "../pages/AiImageSearchPage";
// ADMIN
import AdminLayout from "../components/layout/AdminLayout";

import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminProductsPage from "../pages/admin/AdminProductsPage";
import AdminCreateProductPage from "../pages/admin/AdminCreateProductPage";
import AdminEditProductPage from "../pages/admin/AdminEditProductPage";
import AdminLoginPage from "../pages/admin/AdminLoginPage";
import AdminCustomersPage from "../pages/admin/AdminCustomersPage";
import AdminOrdersPage from "../pages/admin/AdminOrdersPage";
import AdminInventoryPage from "../pages/admin/AdminInventoryPage";

const router = createBrowserRouter([
  // USER
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },

      {
        path: "ai-image-search",
        element: <AiImageSearchPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "checkout",
        element: <CheckoutPage />,
      },
      {
        path: "orders",
        element: <AdminOrdersPage />,
      },
      {
        path: "products",
        element: <ProductsPage />,
      },

      {
        path: "product/:id",
        element: <ProductDetailPage />,
      },

      {
        path: "cart",
        element: <CartPage />,
      },

      {
        path: "login",
        element: <LoginPage />,
      },

      {
        path: "register",
        element: <RegisterPage />,
      },
    ],
  },

  // ADMIN
  {
    path: "/admin",
    element: <AdminLayout />,

    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: "/admin/login",
        element: <AdminLoginPage />,
      },
      {
        path: "customers",
        element: <AdminCustomersPage />,
      },

      {
        path: "products",
        element: <AdminProductsPage />,
      },

      {
        path: "products/create",
        element: <AdminCreateProductPage />,
      },

      {
        path: "products/edit/:id",
        element: <AdminEditProductPage />,
      },
      {
        path: "orders",
        element: <AdminOrdersPage />,
      },
      {
        path: "inventory",
        element: <AdminInventoryPage />,
      },
    ],
  },
]);

export default router;
