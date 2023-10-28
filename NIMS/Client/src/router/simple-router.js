import React from "react";

// auth

import SignIn from "../views/dashboard/auth/sign-in";
import SignUp from "../views/dashboard/auth/sign-up";
import Recoverpw from "../views/dashboard/auth/recoverpw";
// errors

export const SimpleRouter = [
  {
    path: "auth/sign-in",
    element: <SignIn />,
  },
  {
    path: "auth/sign-up",
    element: <SignUp />,
  },
  {
    path: "auth/recoverpw",
    element: <Recoverpw />,
  },
];
