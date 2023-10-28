import React from "react";
import Index from "../views/dashboard/index";
// user
import UserDepartment from "../views/dashboard/user/user-add-department";
import UserDesignation from "../views/dashboard/user/user-add-designation";
import UserAdd from "../views/dashboard/user/user-add-user";

//client
import ClientSector from "../views/dashboard/client/client-add-sector";
import ClientAdd from "../views/dashboard/client/client-add-client";
//Oem
import OemProduct from "../views/dashboard/oem/oem-add-product";
import OemAdd from "../views/dashboard/oem/oem-add-oem";
import AddOrder from "../views/dashboard/oem/oem-add-order";

// map
import Google from "../views/dashboard/maps/google";
import Timeline from "../views/dashboard/special-pages/timeline";
import Calender from "../views/dashboard/special-pages/calender";

//admin
import Admin from "../views/dashboard/admin/admin";
import AdminProfile from "../views/dashboard/admin/admin-profile";
import Default from "../layouts/dashboard/default";
import { AuthorizeUser } from "../context/AuthContext";

export const DefaultRouter = [
  {
    path: "/",
    element: <Default />,
    children: [
      {
        path: "dashboard",
        element: (
          <AuthorizeUser>
            <Index />
          </AuthorizeUser>
        ),
      },
      {
        path: "dashboard/special-pages/calender",
        element: (
          <AuthorizeUser>
            <Calender />
          </AuthorizeUser>
        ),
      },
      {
        path: "dashboard/special-pages/timeline",
        element: (
          <AuthorizeUser>
            <Timeline />
          </AuthorizeUser>
        ),
      },
      //user
      {
        path: "dashboard/user/user-add-department",
        element: (
          <AuthorizeUser>
            <UserDepartment />
          </AuthorizeUser>
        ),
      },
      {
        path: "dashboard/user/user-add-designation",
        element: (
          <AuthorizeUser>
            <UserDesignation />
          </AuthorizeUser>
        ),
      },

      {
        path: "dashboard/user/user-add-user",
        element: (
          <AuthorizeUser>
            <UserAdd />
          </AuthorizeUser>
        ),
      },
      //client
      {
        path: "dashboard/client/client-add-sector",
        element: (
          <AuthorizeUser>
            <ClientSector />
          </AuthorizeUser>
        ),
      },
      {
        path: "dashboard/client/client-add-client",
        element: (
          <AuthorizeUser>
            <ClientAdd />
          </AuthorizeUser>
        ),
      },
      //Oem
      {
        path: "dashboard/oem/oem-add-oem",
        element: (
          <AuthorizeUser>
            <OemAdd />
          </AuthorizeUser>
        ),
      },
      {
        path: "dashboard/oem/oem-add-product",
        element: (
          <AuthorizeUser>
            <OemProduct />
          </AuthorizeUser>
        ),
      },
      {
        path: "dashboard/oem/oem-add-order",
        element: (
          <AuthorizeUser>
            <AddOrder />
          </AuthorizeUser>
        ),
      },
      {
        path: "dashboard/admin/admin",
        element: (
          <AuthorizeUser>
            <Admin />
          </AuthorizeUser>
        ),
      },
      {
        path: "dashboard/admin/adminprofile",
        element: (
          <AuthorizeUser>
            <AdminProfile />
          </AuthorizeUser>
        ),
      },
      // Map
      {
        path: "dashboard/map/google",
        element: (
          <AuthorizeUser>
            <Google />
          </AuthorizeUser>
        ),
      },
    ],
  },
];
