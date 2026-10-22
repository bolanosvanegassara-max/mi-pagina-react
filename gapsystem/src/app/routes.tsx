import { createBrowserRouter } from "react-router";

import { Home } from "./pages/Home";
import { ProductListing } from "./pages/ProductListing";
import { ProductDetail } from "./pages/ProductDetail";
import { Cart } from "./pages/Cart";
import { Login } from "./pages/Login";
import { UserDashboard } from "./pages/UserDashboard";
import { AdminDashboard } from "./pages/AdminDashboard";
import { Checkout } from "./pages/Checkout";
import HelpDesk from "./pages/HelpDesk";
import { EquipmentControl } from "./pages/EquipmentControl";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },

  {
    path: "/products",
    Component: ProductListing,
  },

  {
    path: "/product/:id",
    Component: ProductDetail,
  },

  {
    path: "/cart",
    Component: Cart,
  },

  {
    path: "/checkout",
    Component: Checkout,
  },

  {
    path: "/login",
    Component: Login,
  },

  {
    path: "/dashboard",
    Component: UserDashboard,
  },

  {
    path: "/admin",
    Component: AdminDashboard,
  },

  {
    path: "/helpdesk",
    Component: HelpDesk,
  },

  {
    path: "/equipment-control",
    Component: EquipmentControl,
  },
]);