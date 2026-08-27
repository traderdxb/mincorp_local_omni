import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import About from "../pages/about/page";
import Services from "../pages/services/page";
import Sustainability from "../pages/sustainability/page";
import Commodities from "../pages/commodities/page";
import CommodityDetail from "../pages/commodities/detail/page";
import Contact from "../pages/contact/page";
import AdminLoginPage from "../pages/admin/login/page";
import AuthGuard from "../pages/admin/components/AuthGuard";
import AdminLayout from "../pages/admin/components/AdminLayout";
import AdminDashboard from "../pages/admin/dashboard/page";
import AdminCommodities from "../pages/admin/commodities/page";
import AdminLeads from "../pages/admin/leads/page";
import AdminMedia from "../pages/admin/media/page";
import AdminSiteContent from "../pages/admin/site-content/page";
import AdminSiteImages from "../pages/admin/site-images/page";
import AdminVcfContacts from "../pages/admin/vcf-contacts/page";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/commodities",
    element: <Commodities />,
  },
  {
    path: "/commodities/:slug",
    element: <CommodityDetail />,
  },
  {
    path: "/services",
    element: <Services />,
  },
  {
    path: "/sustainability",
    element: <Sustainability />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/admin/login",
    element: <AdminLoginPage />,
  },
  {
    path: "/admin",
    element: <AuthGuard />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            path: "dashboard",
            element: <AdminDashboard />,
          },
          {
            path: "commodities",
            element: <AdminCommodities />,
          },
          {
            path: "leads",
            element: <AdminLeads />,
          },
          {
            path: "vcf-contacts",
            element: <AdminVcfContacts />,
          },
          {
            path: "media",
            element: <AdminMedia />,
          },
          {
            path: "site-content",
            element: <AdminSiteContent />,
          },
          {
            path: "site-images",
            element: <AdminSiteImages />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;