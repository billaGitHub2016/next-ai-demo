import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
// import CircularProgress from '@mui/material/CircularProgress';
import LoadingPage from '../app/loading'
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
  const [isUserLoading, setIsUserLoading] = useState(false);

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
    setIsUserLoading(true)
    try {
      debugger
      const res = await fetch('/apis/signin', {
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      }).then(res => res.json())
      debugger
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
    } finally {
      setIsUserLoading(false)
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
      { isUserLoading && (<div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}>
        <LoadingPage/>
      </div>) }
      {children}
    </CreateContext.Provider>
  );
};

export default Context;
