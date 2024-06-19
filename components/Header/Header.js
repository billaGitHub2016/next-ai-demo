"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { useAppContext } from "@/context/Context";

import logo from "../../public/images/logo/logo.png";
import ToolsData from "../../data/header.json";

import Nav from "./Nav";
import GridMenu from "./GridMenu";

const Header = ({ headerTransparent, headerSticky, btnClass }) => {
  const { activeMobileMenu, setActiveMobileMenu, user } = useAppContext();
  const [isSticky, setIsSticky] = useState(false);
  const [isClient, setIsClient] = useState(false)
 
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      if (scrolled > 200) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
      <header
        className={`rainbow-header header-default ${headerTransparent} ${headerSticky} ${
          isSticky ? "sticky" : ""
        }`}
      >
        <div className="container position-relative">
          <div className="row align-items-center row--0">
            <div className="col-lg-3 col-md-6 col-6">
              <div className="logo">
                <Link href="/">
                  <Image
                    className="logo-light"
                    src={logo}
                    width={201}
                    height={35}
                    alt="ChatBot Logo"
                  />
                </Link>
              </div>
            </div>
            <div className="col-lg-9 col-md-6 col-6 position-static">
              <div className="header-right">
                <nav className="mainmenu-nav d-none d-lg-block">
                  <Nav />
                </nav>

                {/* <div className="header-btn">
                  <Link
                    className={`btn-default ${btnClass}`}
                    href="/text-generator"
                  >
                    Get Started Free
                  </Link>
                </div> */}

                {/* <GridMenu ToolsData={ToolsData} /> */}
                
                <div className="mobile-menu-bar ml--5 d-lg-none" style={{ display: 'flex', alignItems: 'center'}}>
                  { 
                      isClient && user ? (<a href="#" onClick={onSignout} style={{
                        fontSize: '16px',
                        fontWeight: 500,
                        color: 'var(--color-heading)',
                        marginRight: '15px'
                      }}>
                          <i className="feather-log-out"></i>
                          <span>登出</span>
                        </a>) : (<Link href="/authPage" style={{
                          fontSize: '16px',
                          fontWeight: 500,
                          color: 'var(--color-heading)',
                          marginRight: '15px'
                        }}>
                          <i className="feather-log-out"></i>
                          <span>登入</span>
                        </Link>)
                  }
                  <div className="hamberger">
                    <button
                      className="hamberger-button"
                      onClick={() => setActiveMobileMenu(!activeMobileMenu)}
                    >
                      <i className="feather-menu"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
