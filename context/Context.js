import React, { createContext, useContext, useState, useEffect } from "react";
import { setUserCache, getUserCache, removeUserCache } from '../utils/auth'

export const CreateContext = createContext();

export const useAppContext = () => useContext(CreateContext);

const Context = ({ children }) => {
  const [mobile, setMobile] = useState(true);
  const [rightBar, setRightBar] = useState(true);
  const [toggleTop, setToggle] = useState(true);
  const [toggleAuth, setToggleAuth] = useState(true);
  const [showItem, setShowItem] = useState(true);
  const [activeMobileMenu, setActiveMobileMenu] = useState(true);
  const [user, setUser] = useState(getUserCache());

  const checkScreenSize = () => {
    if (window.innerWidth < 1200) {
      setMobile(false);
      setRightBar(false);
    } else {
      setMobile(true);
      setRightBar(true);
    }
  };

  // 拉取用户数据
  const fetchUer = async () => {
    try {
      const res = await fetch('/apis/signin', {
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      }).then(res => res.json())
      if (res.code === '0') {
        setUser(res.data.user)
        setUserCache(res.data.user)
      } else {
        setUser(null)
        removeUserCache()
      }
    } catch (error) {
      setUser(null)
      removeUserCache()
    }
  }

  useEffect(() => {
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    fetchUer();

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  const shouldCollapseLeftbar = !mobile;
  const shouldCollapseRightbar = !rightBar;

  return (
    <CreateContext.Provider
      value={{
        mobile,
        setMobile,
        showItem,
        setShowItem,
        activeMobileMenu,
        setActiveMobileMenu,
        toggleTop,
        setToggle,
        toggleAuth,
        setToggleAuth,
        rightBar,
        setRightBar,
        shouldCollapseLeftbar,
        shouldCollapseRightbar,
        user,
        setUser,
      }}
    >
      {children}
    </CreateContext.Provider>
  );
};

export default Context;
