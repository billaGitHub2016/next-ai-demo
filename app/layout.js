"use client";

import React, { useEffect } from "react";
import { ToastContainer } from 'react-toastify';
import { ConfirmProvider } from "material-ui-confirm";
import 'react-toastify/dist/ReactToastify.css';

import "bootstrap/scss/bootstrap.scss";

// ========= Plugins CSS START =========
import "../public/css/plugins/feature.css";
import "../public/css/plugins/animation.css";
import "../node_modules/sal.js/dist/sal.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-tooltip/dist/react-tooltip.css";
// ========= Plugins CSS END =========

import "../public/scss/style.scss";

export default function RootLayout({ children }) {
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
    console.log('version = 1.0.1')
  }, []);
  return (
    <html lang="en">
      <body className="" suppressHydrationWarning={true}>
        <ConfirmProvider>
          {children}
        </ConfirmProvider>
        {<ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable={false}
          pauseOnHover
          theme="dark"
        />}
      </body>
    </html>
  );
}
