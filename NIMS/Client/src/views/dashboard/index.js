import React, { useEffect, useState, memo, Fragment } from "react";
import { Row, Col } from "react-bootstrap";
import Card from "../../components/Card";
import { API_BASE_URL } from "../../config/serverApiConfig";

//Count-up
import CountUp from "react-countup";
// img

// AOS
import AOS from "aos";
import "../../../node_modules/aos/dist/aos";
import "../../../node_modules/aos/dist/aos.css";

// Import Swiper styles
import "swiper/swiper-bundle.min.css";

// Redux Selector / Action
import { useSelector } from "react-redux";

// Import selectors & action from setting store
import * as SettingSelector from "../../store/setting/selectors";

const Index = memo((props) => {
  useSelector(SettingSelector.theme_color);
  const getVariableColor = () => {
    let prefix =
      getComputedStyle(document.body).getPropertyValue("--prefix") || "bs-";
    if (prefix) {
      prefix = prefix.trim();
    }
    const color1 = getComputedStyle(document.body).getPropertyValue(
      `--${prefix}primary`
    );
    const color2 = getComputedStyle(document.body).getPropertyValue(
      `--${prefix}info`
    );
    const color3 = getComputedStyle(document.body).getPropertyValue(
      `--${prefix}primary-tint-20`
    );
    const color4 = getComputedStyle(document.body).getPropertyValue(
      `--${prefix}warning`
    );
    return {
      primary: color1.trim(),
      info: color2.trim(),
      warning: color4.trim(),
      primary_light: color3.trim(),
    };
  };
  const variableColors = getVariableColor();

  const colors = [variableColors.primary, variableColors.info];
  useEffect(() => {
    return () => colors;
  });

  useEffect(() => {
    AOS.init({
      startEvent: "DOMContentLoaded",
      disable: function () {
        var maxWidth = 996;
        return window.innerWidth < maxWidth;
      },
      throttleDelay: 10,
      once: true,
      duration: 700,
      offset: 10,
    });
  });

  /*--------------------------------------------------------------------------------
--------------------------------Start Fetch dashbord Data--------------------------------
----------------------------------------------------------------------------------*/
  const [oemCount, setOemCount] = useState([]);
  const [oemProductCount, setOemProductCount] = useState([]);
  const [oemOrderCount, setOemOrderCount] = useState([]);
  const [clientCount, setClientCount] = useState([]);
  const [userCount, setUserCount] = useState([]);
  const [adminCount, setAdminCount] = useState([]);

  useEffect(() => {
    const fetchIndex = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}index`, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        if (data.success) {
          setAdminCount(data.totalAdminCount);
          setOemCount(data.totalOemCount);
          setOemProductCount(data.totalProductCount);
          setOemOrderCount(data.totalOrderCount);
          setClientCount(data.totalClientCount);
          setUserCount(data.totalUsersCount);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchIndex();
  }, []);

  return (
    <Fragment>
      <Row>
        <Col lg="3" md="6">
          <Card></Card>
        </Col>
        <Col lg="3" md="6">
          <Card></Card>
        </Col>
        <Col lg="3" md="6">
          <Card></Card>
        </Col>
        <Col lg="3" md="6">
          <Card></Card>
        </Col>
        <Col
          lg="3"
          md="6"
          className="col-lg-3 col-md-6"
          style={{ marginTop: "10px" }}
        >
          <Card className="bg-soft-info">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div className="bg-soft-info rounded p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20px"
                    height="20px"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="text-end">
                  <h2 className="counter">
                    <CountUp start={0} end={clientCount} duration={3} />
                  </h2>
                  Clients
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col
          lg="3"
          md="6"
          className="col-lg-3 col-md-6"
          style={{ marginTop: "10px" }}
        >
          <Card className="bg-soft-warning">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div className="bg-soft-warning rounded p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20px"
                    height="20px"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="text-end">
                  <h2 className="counter">
                    <CountUp start={0} end={userCount} duration={3} />
                  </h2>
                  Users
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col
          lg="3"
          md="6"
          className="col-lg-3 col-md-6"
          style={{ marginTop: "10px" }}
        >
          <Card className="bg-soft-danger">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div className="bg-soft-danger rounded p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20px"
                    height="20px"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                </div>
                <div className="text-end">
                  <h2 className="counter">
                    <CountUp start={0} end={adminCount} duration={3} />
                  </h2>
                  Admins
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col
          lg="3"
          md="6"
          className="col-lg-3 col-md-6"
          style={{ marginTop: "10px" }}
        >
          <Card className="bg-soft-primary">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div className="bg-soft-primary rounded p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20px"
                    height="20px"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="text-end">
                  <h2 className="counter">
                    <CountUp start={0} end={oemCount} duration={3} />
                  </h2>
                  Oem
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg="3" md="6">
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div className="bg-info text-white rounded p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20px"
                    height="20px"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div className="text-end">
                  Oem Product
                  <h2 className="counter">
                    <CountUp start={0} end={oemProductCount} duration={3} />
                  </h2>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg="3" md="6">
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div className="bg-warning text-white rounded p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20px"
                    height="20px"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="text-end">
                  Oem Order
                  <h2 className="counter">
                    <CountUp start={0} end={oemOrderCount} duration={3} />
                  </h2>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg="3" md="6">
          <Card className="border-bottom border-4 border-0 border-primary">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span>Worked Today</span>
                </div>
                <div>
                  <span>08:00 Hr</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg="3" md="6">
          <Card className="border-bottom border-4 border-0 border-info">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span>Worked Week</span>
                </div>
                <div>
                  <span>40:00 Hr</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg="3" md="6">
          <Card className="border-bottom border-4 border-0 border-danger">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span>Worked Issue</span>
                </div>
                <div>
                  <span className="counter">
                    <CountUp start={275} end={1200} duration={3} />
                  </span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg="3" md="6">
          <Card className="border-bottom border-4 border-0 border-warning">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span>Worked Income</span>
                </div>
                <div>
                  <span className="counter">
                    $<CountUp start={10000} end={54000} duration={3} />
                  </span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
});

export default Index;
