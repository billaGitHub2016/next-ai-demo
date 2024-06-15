"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from 'react-toastify';

import DashboardItem from "../../data/header.json";

import menuImg from "../../public/images/menu-img/menu-img-2.png";
import { useAppContext } from "@/context/Context";
import { removeUserCache } from '../../utils/auth'

const Nav = () => {
  const pathname = usePathname();
  const { showItem, setShowItem, user, setUser } = useAppContext();
  const router = useRouter();

  const isActive = (href) => pathname.startsWith(href);

  const onSignout = async () => {
    try {
      const res = await fetch('/apis/signout', {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => res.json())
      
      if (res.code === '0') {
        toast.success(res.message);
        router.push('/authPage')
        setUser(null)
        removeUserCache()
      }

    } catch(err) {
      toast.error('登出失败');
    }
  }

  return (
    <>
      <ul className="mainmenu">
        {/* <li>
          <Link href="/dashboard">Welcome</Link>
        </li> */}
        {/* <li className="with-megamenu has-menu-child-item position-relative">
          <a
            href="#"
            onClick={() => setShowItem(!showItem)}
            className={`${!showItem ? "open" : ""}`}
          >
            Dashboard
          </a>
          <div
            className={`rainbow-megamenu right-align with-mega-item-2 ${
              showItem ? "" : "d-block"
            }`}
          >
            <div className="wrapper p-0">
              <div className="row row--0">
                <div className="col-lg-6 single-mega-item">
                  <h3 className="rbt-short-title">DASHBOARD PAGES</h3>
                  <ul className="mega-menu-item">
                    {DashboardItem &&
                      DashboardItem.navDashboardItem.map((data, index) => (
                        <li key={index}>
                          <Link
                            href={data.link}
                            className={isActive(data.link) ? "active" : ""}
                          >
                            {data.text}
                          </Link>
                        </li>
                      ))}
                  </ul>
                </div>
                <div className="col-lg-6 single-mega-item">
                  <div className="header-menu-img">
                    <Image src={menuImg} alt="Menu Split Image" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </li> */}
        {/* <li>
          <Link href="/pricing">Pricing</Link>
        </li> */}
        <li>
        { 
          user ? (<a href="#" onClick={onSignout}>
              <i className="feather-log-out"></i>
              <span>登出</span>
            </a>) : (<Link href="/authPage">
              <i className="feather-log-out"></i>
              <span>登入</span>
            </Link>)
        }
        </li>
      </ul>
    </>
  );
};

export default Nav;
