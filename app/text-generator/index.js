"use client";

import Context from "@/context/Context";
import HeaderDashboard from "@/components/Header/HeaderDashboard";
import PopupMobileMenu from "@/components/Header/PopupMobileMenu";
import RightpanelDashboard from "@/components/Common/RightpanelDashboard";
import LeftpanelDashboard from "@/components/Common/LeftpanelDashboard";
import Modal from "@/components/Common/Modal";
import TextGenerator from "@/components/TextGenerator/TextGenerator";
import StaticbarDashboard from "@/components/Common/StaticbarDashboard";
import { useCallback, useState, useRef, useEffect } from "react";
import { toast } from 'react-toastify';
import ReactLoading from "react-loading";
import { getUserCache } from '../../utils/auth'

const TextGeneratorPage = () => {
  const newChatsRef = useRef([]);
  const [newChats, setNewchats] = useState([]);
  const [currentTopic, setCurrentTopic] = useState(null)
  const user = getUserCache()
  const messageFormRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const historyTopicRef = useRef(null)

  useEffect(() => {
    const html = document.getElementsByTagName('html')[0]
    if (html) {
      html.scrollIntoView({block: 'end', behavior:"smooth"})
    }
  }, [newChats])

  useEffect(() => {
    window.dispatchNewsDetailEvent = dispatchNewsDetailEvent
    return () => {
      window.dispatchNewsDetailEvent = null
    }
  }, [])

  // 开始一个对话
  const onStartChat = (params) => {
    const newChat = {
      id: params.id,
      // author: "/images/team/team-01.jpg",
      author: user ? user.avatar : "/images/team/team-01.jpg",
      title: "You",
      desc: params.topic,
      status: 'start',
      content: [
        {
          "img": "/images/icons/loader-one.gif",
          "text": "Generating answers for you…",
          // "aiImg": "/images/team/avater.png",
          "aiImg": "/images/ai-avater.png",
          "title": "ChatenAI",
          "badge": "Bot",
          "desc": ''
        }
      ]
    }
    const updateChats = [...newChatsRef.current, newChat]
    setNewchats(updateChats);
    newChatsRef.current = updateChats
  }

  // 接收对话回复消息
  const onResponse = (params) => {
    const match = newChatsRef.current.find(item => item.id === params.id)
    if (match) {
      match.status = 'typing'
      match.content[0].desc += params.text
      match.content[0].lastDesc = params.text.length > 0 ? match.content[0].desc.slice(0, -(params.text.length)) : match.content[0].lastDesc
      match.content[0].typingText = params.text
      setNewchats([...newChatsRef.current])
    }
  }

  // 结束对话
  const onFinishChat = (params) => {
    const match = newChatsRef.current.find(item => item.id === params.id)
    if (match) {
      // setTimeout(() => {
      //   match.status = 'finish'
      //   match.content[0].img = ''
      //   match.content[0].text = ''
      //   setNewchats([...newChatsRef.current])
      // }, 2000) // 延时一下再改变状态，优化打字输出效果
      match.status = 'finish'
      match.content[0].img = ''
      match.content[0].text = ''
      debugger
      match.content[0].desc = convertNewsLinkToQuestion(match)
      setNewchats([...newChatsRef.current])
    }
  }

  const onTopicSubmit = (params) => {
    setNewchats([])
    setCurrentTopic(params.topic)
    historyTopicRef.current?.getHistoryTopics()
  }

  const onRegenerate = (log) => {
    messageFormRef.current?.messageForm.current?.regenerateMessage(log.desc)
  }

  const getHistoryTopicLogs = async (id) => {
    setLoading(true);
    setCurrentTopic({ id });
    const searchParams = {
        pageNo: 1,
        pageSize: 100,
        topicId: id
    };
    const urlParams = new URLSearchParams(searchParams).toString();
    const res = await fetch(`/apis/topicLog${urlParams ? '?' + urlParams : ''}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-store',
    })
        .then(res => res.json())
        .catch(err => {
            return {
                message: err.message,
            };
        })
        .finally(() => {
            setLoading(false);
        });
    if (res.code === '0') {
      if (res.data.list.length === 0) {
        toast('当前会话没有纪录'); 
      }
      const chats = convertTipicLogToChats(res.data.list, user)
      setNewchats(chats);
      newChatsRef.current = chats
    } else {
      toast.error(res.message);
    }
};
  
  const onTopicClick = (id) => {
    getHistoryTopicLogs(id)
  }

  return (
    <>
      <main className="page-wrapper rbt-dashboard-page">
        <Context>
          <div className="rbt-panel-wrapper">
            <HeaderDashboard display="" />
            <PopupMobileMenu />
            <LeftpanelDashboard />
            <RightpanelDashboard ref={historyTopicRef} onTopicClick={onTopicClick} topic={currentTopic}/>
            <Modal onTopicSubmit={onTopicSubmit}/>

            <div className="rbt-main-content">
              <div className="rbt-daynamic-page-content">
                <div className="rbt-dashboard-content">
                  <div className="content-page">
                    <TextGenerator chats={newChats} onRegenerate={onRegenerate}/>
                  </div>
                  <StaticbarDashboard onStartChat={ onStartChat } onResponse={onResponse} onFinishChat={onFinishChat} topic={currentTopic}  ref={messageFormRef}/>
                </div>
              </div>
            </div>
          </div>
        </Context>
      </main>
    </>
  );
};

function convertTipicLogToChats(logs, user) {
  return logs.map(log => {
    const newChat = {
      id: log.id,
      author: user ? user.avatar : "/images/team/team-01.jpg",
      title: "You",
      desc: log.question,
      status: 'finish',
      content: [
        {
          "img": "",
          "text": "",
          // "aiImg": "/images/team/avater.png",
          "aiImg": "/images/ai-avater.png",
          "title": "ChatenAI",
          "badge": "Bot",
          "desc": log.answer
        }
      ]
    }
    return newChat
  })
}

function convertNewsLinkToQuestion(chat) {
  let content = chat.content[0].desc
  if (content) {
    const regex = /<p>来源: <a[^>]*>(.*?)<\/a><\/p>/g; // 匹配新闻链接， 例子：<a href="https://www.bloomberg.com/news/articles/2024-06-17/us-suspends-mexico-avocado-shipments-due-to-inspector-incident">Bloomberg</a>
    const matches = content.matchAll(regex);

    for (const match of matches) {
      // let aTag = match[0]
      const channel = match[1]
      const newQuestion = `{${channel}}对{${chat.desc}}具体报道是什么`
      // aTag = aTag.replace(/href="\S+"/, `href="javascript:void(0)" onClick="dispatchNewsDetailEvent('${newQuestion}')" class="news-detail-link"`);
      const pTag = `<p>来源: <span onClick="dispatchNewsDetailEvent('${newQuestion}')" class="news-detail-link">${channel}</span></p>`
      content = content.replace(match[0], pTag);
    }
  }
  return content
}

function dispatchNewsDetailEvent(question, e) {
  debugger
  const event = new CustomEvent('newsDetailEvent', {
    detail: {
      question,
    },
    bubbles: false, // 事件是否可以冒泡
    cancelable: true // 事件是否可以取消
  });
  // 触发自定义事件
  document.dispatchEvent(event);
}

export default TextGeneratorPage;
