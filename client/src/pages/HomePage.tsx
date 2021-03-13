import React from "react";
import { Link } from "react-router-dom";

import { ErrorBoundary } from "../components";

import napkinsImg from "../assets/napkins.webp";
import toiletsImg from "../assets/toilets.webp";

import "./HomePage.css";

export const HomePage = () => {
  return (
    <ErrorBoundary>
      <nav className="home-page__navigation">
        <ul className="home-page__navigation-list">
          <li className="navigation__item">
            <Link to="/production/napkins">
              <img className="item__img" src={napkinsImg} alt="Салфетки" />
            </Link>
          </li>
          <li className="navigation__item">
            <Link to="/production/toilets">
              <img
                className="item__img"
                src={toiletsImg}
                alt="Туалетная бумага"
              />
            </Link>
          </li>
        </ul>
      </nav>
    </ErrorBoundary>
  );
};
