import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import CustomerOrdering from "./pages/CustomerOrdering";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import OrderTracking from "./pages/OrderTracking";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import Chatbot from "./pages/Chatbot";
import RestaurantDashboard from "./pages/RestaurantDashboard";
import RestaurantFeedback from "./pages/RestaurantFeedback";
import RestaurantMenu from "./pages/RestaurantMenu";
import RestaurantOrders from "./pages/RestaurantOrders";
import DriverDashboard from "./pages/DriverDashboard";
import DriverHistory from "./pages/DriverHistory";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRestaurants from "./pages/AdminRestaurants";
import AdminRestaurantEdit from "./pages/AdminRestaurantEdit";
import AdminUsers from "./pages/AdminUsers";
import AdminUserEdit from "./pages/AdminUserEdit";
import AdminOrders from "./pages/AdminOrders";
import AdminDrivers from "./pages/AdminDrivers";
import AdminCoupons from "./pages/AdminCoupons";
import AdminSupport from "./pages/AdminSupport";
import AdminReports from "./pages/AdminReports";
import AdminSettings from "./pages/AdminSettings";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/signin",
    Component: SignIn,
  },
  {
    path: "/signup",
    Component: SignUp,
  },
  {
    path: "/forgot-password",
    Component: ForgotPassword,
  },
  {
    path: "/login",
    Component: SignIn,
  },
  {
    path: "/order",
    Component: CustomerOrdering,
  },
  {
    path: "/checkout",
    Component: Checkout,
  },
  {
    path: "/order-confirmation",
    Component: OrderConfirmation,
  },
  {
    path: "/order-tracking",
    Component: OrderTracking,
  },
  {
    path: "/orders",
    Component: Orders,
  },
  {
    path: "/chatbot",
    Component: Chatbot,
  },
  {
    path: "/profile",
    Component: Profile,
  },
  {
    path: "/restaurant/dashboard",
    Component: RestaurantDashboard,
  },
  {
    path: "/restaurant/menu",
    Component: RestaurantMenu,
  },
  {
    path: "/restaurant/feedback",
    Component: RestaurantFeedback,
  },
  {
    path: "/restaurant/orders",
    Component: RestaurantOrders,
  },
  {
    path: "/driver/dashboard",
    Component: DriverDashboard,
  },
  {
    path: "/driver/history",
    Component: DriverHistory,
  },
  {
    path: "/admin/dashboard",
    Component: AdminDashboard,
  },
  {
    path: "/admin/restaurants",
    Component: AdminRestaurants,
  },
  {
    path: "/admin/restaurants/:id/edit",
    Component: AdminRestaurantEdit,
  },
  {
    path: "/admin/users",
    Component: AdminUsers,
  },
  {
    path: "/admin/users/:id/edit",
    Component: AdminUserEdit,
  },
  {
    path: "/admin/orders",
    Component: AdminOrders,
  },
  {
    path: "/admin/drivers",
    Component: AdminDrivers,
  },
  {
    path: "/admin/coupons",
    Component: AdminCoupons,
  },
  {
    path: "/admin/support",
    Component: AdminSupport,
  },
  {
    path: "/admin/reports",
    Component: AdminReports,
  },
  {
    path: "/admin/settings",
    Component: AdminSettings,
  },
]);
