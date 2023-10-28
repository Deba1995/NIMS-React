import React, { useEffect, Fragment } from "react";
import { Button } from "react-bootstrap";

import { Link } from "react-router-dom";

//img
import topImage from "../assets/images/dashboard/top-image.jpg";
import github from "../assets/images/brands/23.png";

//prism
import "../../node_modules/prismjs/prism";
import "../../node_modules/prismjs/themes/prism-okaidia.css";

// SliderTab
import SliderTab from "../plugins/slider-tabs";

// Import selectors & action from setting store
import * as SettingSelector from "../store/setting/selectors";

// Redux Selector / Action
import { useSelector } from "react-redux";

const Index = () => {
  const appName = useSelector(SettingSelector.app_name);

  useEffect(() => {
    return () => {
      setTimeout(() => {
        Array.from(
          document.querySelectorAll('[data-toggle="slider-tab"]'),
          (elem) => {
            return new SliderTab(elem);
          }
        );
      }, 100);
    };
  });

  return (
    <Fragment>
      <span className="uisheet screen-darken"></span>
      <div
        className="header"
        style={{
          background: `url(${topImage})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          height: "100vh",
          position: "relative",
        }}
      >
        <div className="main-img">
          <div className="container">
            <svg
              width="150"
              viewBox="0 0 55 55"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="-0.423828"
                y="34.5762"
                width="50"
                height="7.14286"
                rx="3.57143"
                transform="rotate(-45 -0.423828 34.5762)"
                fill="white"
              />
              <rect
                x="14.7295"
                y="49.7266"
                width="50"
                height="7.14286"
                rx="3.57143"
                transform="rotate(-45 14.7295 49.7266)"
                fill="white"
              />
              <rect
                x="19.7432"
                y="29.4902"
                width="28.5714"
                height="7.14286"
                rx="3.57143"
                transform="rotate(45 19.7432 29.4902)"
                fill="white"
              />
              <rect
                x="19.7783"
                y="-0.779297"
                width="50"
                height="7.14286"
                rx="3.57143"
                transform="rotate(45 19.7783 -0.779297)"
                fill="white"
              />
            </svg>
            <h1 className="my-4">
              <span data-setting="app_name">{appName}</span>- Design System
            </h1>
            <h4 className="text-white mb-5">
              <b>Simplify.</b> <b>Streamline.</b> <b>Succeed.</b>
            </h4>
            <div className="d-flex justify-content-center align-items-center">
              <div>
                <Link className="btn btn-light bg-white d-flex" to="/dashboard">
                  <svg
                    width="22"
                    height="22"
                    className="me-1"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    ></path>
                  </svg>
                  Dashboard
                </Link>
              </div>
              <div className="ms-3">
                <Button
                  bsPrefix=" btn btn-light bg-white d-flex"
                  target="_blank"
                  href="https://github.com/Deba1995/NIMS-React"
                >
                  <img src={github} width="24px" height="24px" alt="github" />
                  <span className="text-danger mx-2 fw-bold">STAR US</span>
                  <span>ON GITHUB</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Index;
