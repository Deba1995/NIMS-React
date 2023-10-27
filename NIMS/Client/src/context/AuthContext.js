import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import React from "react";
export const AuthorizeUser = ({ children }) => {
  const token = Cookies.get("jwt");
  let username = null;
  let role = null;
  if (token) {
    const tokenData = token.split(".")[1];
    const decodedToken = JSON.parse(atob(tokenData));
    username = decodedToken.name; // Replace 'username' with the actual key in the token
    role = decodedToken.role;
  }
  if (!token) {
    return <Navigate to={"/auth/sign-in"}></Navigate>;
  }
  return React.Children.map(children, (child) => {
    return React.cloneElement(child, { username, role });
  });
};
