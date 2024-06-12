"use client";

import Context from "@/context/Context";
import HeaderDashboard from "@/components/Header/HeaderDashboard";
import PopupMobileMenu from "@/components/Header/PopupMobileMenu";
import RightpanelDashboard from "@/components/Common/RightpanelDashboard";
import LeftpanelDashboard from "@/components/Common/LeftpanelDashboard";
import Modal from "@/components/Common/Modal";
import TextGenerator from "@/components/TextGenerator/TextGenerator";
import StaticbarDashboard from "@/components/Common/StaticbarDashboard";
import { useCallback, useState, useRef } from "react";

const TextGeneratorPage = () => {
  const newChatsRef = useRef([]);
  const [newChats, setNewchats] = useState([]);

  // 开始一个对话
  const onStartChat = (params) => {
    const newChat = {
      id: params.id,
      author: "/images/team/team-01.jpg",
      title: "You",
      desc: params.topic,
      content: [
        {
          "img": "/images/icons/loader-one.gif",
          "text": "Generating answers for you…",
          "aiImg": "/images/team/avater.png",
          "title": "ChatenAI",
          "badge": "Bot",
          "desc": ''
        }
      ]
    }
    const updateChats = [...newChats, newChat]
    setNewchats(updateChats);
    newChatsRef.current = updateChats
  }

  // 接收对话回复消息
  const onResponse = (params) => {
    const match = newChatsRef.current.find(item => item.id === params.id)
    if (match) {
      match.content[0].desc += params.text
      setNewchats([...newChatsRef.current])
    }
  }

  // 结束对话
  const onFinishChat = (params) => {
    const match = newChatsRef.current.find(item => item.id === params.id)
    if (match) {
      match.content[0].img = ''
      match.content[0].text = ''
      setNewchats([...newChatsRef.current])
    }
  }

  return (
    <>
      <main className="page-wrapper rbt-dashboard-page">
        <Context>
          <div className="rbt-panel-wrapper">
            <HeaderDashboard display="" />
            <PopupMobileMenu />
            <LeftpanelDashboard />
            <RightpanelDashboard />
            <Modal />

            <div className="rbt-main-content">
              <div className="rbt-daynamic-page-content">
                <div className="rbt-dashboard-content">
                  <div className="content-page">
                    <TextGenerator chats={newChats}/>
                  </div>
                  <StaticbarDashboard onStartChat={ onStartChat } onResponse={onResponse} onFinishChat={onFinishChat}/>
                </div>
              </div>
            </div>
          </div>
        </Context>
      </main>
    </>
  );
};

export default TextGeneratorPage;
