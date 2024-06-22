import React, { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppContext } from '@/context/Context';

import SmallNavItem from "../../data/header.json";

const SmallNav = () => {
  const router = useRouter();
  const { user } = useAppContext();
  const [isClient, setIsClient] = useState(false)
 
  useEffect(() => {
    setIsClient(true)
  }, [])

  const isActive = (href) => router.pathname === href;
  return (
    <>
      <nav className="mainmenu-nav">
        {/* <ul className="dashboard-mainmenu rbt-default-sidebar-list">
          <li>
            <Link href="/dashboard">
              <i className="feather-monitor"></i>
              <span>Welcome</span>
            </Link>
          </li>
          <li>
            <Link href="/plans-billing">
              <i className="feather-briefcase"></i>
              <span>Manage Subsription</span>
            </Link>
          </li>
        </ul> */}
        {/* <div className="rbt-sm-separator"></div> */}
        { isClient && user && (<ul className="dashboard-mainmenu rbt-default-sidebar-list">
          {SmallNavItem &&
            SmallNavItem.smallNavItem.slice(0, 7).map((data, index) => (
              <li key={index}>
                <Link
                  // className={data.isDisable ? "disabled" : ""}

                  className={
                    isActive(data.link)
                      ? "active"
                      : "" || data.isDisable
                      ? "disabled"
                      : ""
                  }
                  href={data.link}
                >
                  <Image
                    src={data.img}
                    width={35}
                    height={35}
                    alt="AI Generator"
                  />
                  <span>{data.text}</span>
                  {data.badge !== "" ? (
                    <div className="rainbow-badge-card badge-sm ml--10">
                      {data.badge}
                    </div>
                  ) : (
                    ""
                  )}
                </Link>
              </li>
            ))}
        </ul>)
        }
        {/* <div className="rbt-sm-separator"></div> */}
        <div className="mainmenu-nav">
          <ul className="dashboard-mainmenu rbt-default-sidebar-list">
            {/* <li className="has-submenu">
              <a
                className="collapse-btn collapsed"
                data-bs-toggle="collapse"
                href="#collapseExampleMenu"
                role="button"
                aria-expanded="false"
                aria-controls="collapseExampleMenu"
              >
                <i className="feather-plus-circle"></i>
                <span>Setting</span>
              </a>
              <div className="collapse" id="collapseExampleMenu">
                <ul className="submenu rbt-default-sidebar-list">
                  {SmallNavItem &&
                    SmallNavItem.smallNavItem
                      .slice(7, 14)
                      .map((data, index) => (
                        <li key={index}>
                          <Link href={data.link}>
                            <i className={`feather-${data.icon}`}></i>
                            <span>{data.text}</span>
                          </Link>
                        </li>
                      ))}
                </ul>
              </div>
            </li> */}
            {/* <li>
              <a href="#">
                <i className="feather-award"></i>
                <span>Help & FAQ</span>
              </a>
            </li> */}
          </ul>

          {/* <div className="rbt-sm-separator"></div> */}
          {/* <ul className="dashboard-mainmenu rbt-default-sidebar-list">
            <li>
              <Link href="/release-notes">
                <i className="feather-bell"></i>
                <span>Release notes</span>
              </Link>
            </li>
            <li>
              <Link href="/terms-policy">
                <i className="feather-briefcase"></i>
                <span>Terms & Policy</span>
              </Link>
            </li>
          </ul> */}
        </div>
      </nav>
    </>
  );
};

export default SmallNav;
