"use client";

import { useCallback, useState, useRef, useEffect } from "react";
import { toast } from 'react-toastify';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import ReactLoading from "react-loading";
import Context from "@/context/Context";
import HeaderDashboard from "@/components/Header/HeaderDashboard";
import PopupMobileMenu from "@/components/Header/PopupMobileMenu";
import RightpanelDashboard from "@/components/Common/RightpanelDashboard";
import LeftpanelDashboard from "@/components/Common/LeftpanelDashboard";
import Modal from "@/components/Common/Modal";
import TextGenerator from "@/components/TextGenerator/TextGenerator";
import StaticbarDashboard from "@/components/Common/StaticbarDashboard";
import { getUserCache } from '../../utils/auth'
import { fetchData } from '../../utils/http'

const TextGeneratorPage = () => {
  const newChatsRef = useRef([]);
  const [newChats, setNewchats] = useState([]);
  const [currentTopic, setCurrentTopic] = useState(null)
  const user = getUserCache()
  const messageFormRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [logLoading, setLogLoading] = useState(false)
  const historyTopicRef = useRef(null)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const html = document.getElementsByTagName('html')[0]
    if (html) {
      html.scrollIntoView({block: 'end', behavior:"smooth"})
    }
  }, [newChats])

  useEffect(() => {
    window.dispatchNewsDetailEvent = dispatchNewsDetailEvent
  
    fetchData('/apis/signin', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-store',
    }, router, toast, `${pathname}?${searchParams}`).catch(() => {})

    return () => {
      window.dispatchNewsDetailEvent = null
    }
  }, [])

  // 开始一个对话
  const onStartChat = (params) => {
    const newChat = {
      id: params.id,
      // author: "/images/team/team-01.jpg",
      author: user?.avatar ? user.avatar : "/images/avatar.jpg",
      title: "问",
      desc: params.topic,
      orignalQuestion: params.orignalQuestion,
      status: 'start',
      content: [
        {
          "img": "/images/icons/loader-one.gif",
          "text": "资料采集分析…",
          // "aiImg": "/images/team/avater.png",
          "aiImg": "/images/ai-avater.png",
          "title": "答",
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
      match.content[0].desc = convertNewsLinkToQuestion(match)
      setNewchats([...newChatsRef.current])
    }
  }

  const onTopicSubmit = (params) => {
    setNewchats([])
    newChatsRef.current = []
    setCurrentTopic(params.topic)
    historyTopicRef.current?.getHistoryTopics()
  }

  const onRegenerate = (log) => {
    messageFormRef.current?.messageForm.current?.regenerateMessage(log.desc, log.orignalQuestion)
  }

  const getHistoryTopicLogs = async (id) => {
    if (logLoading) {
      return
    }
    setLogLoading(true);
    setCurrentTopic({ id });
    const searchParams = {
        pageNo: 1,
        pageSize: 100,
        topicId: id
    };
    const urlParams = new URLSearchParams(searchParams).toString();
    const res = await fetchData(`/apis/topicLog${urlParams ? '?' + urlParams : ''}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-store',
    }, router, toast)
        .catch(err => {
            return {
                message: err.message,
            };
        })
        .finally(() => {
            setLogLoading(false);
        });
    if (res.code === '0') {
      if (res.data.list.length === 0) {
        toast('当前会话没有纪录'); 
      }
      const chats = convertTipicLogToChats(res.data.list, user)
      chats.forEach(c => {
        c.content[0].desc = convertNewsLinkToQuestion(c)
      })
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
            <RightpanelDashboard ref={historyTopicRef} onTopicClick={onTopicClick} topic={currentTopic} topicLogLoading={logLoading}/>
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
      author: user?.avatar ? user.avatar : "/images/avatar.jpg",
      title: "问",
      desc: log.question,
      orignalQuestion: log.orignalQuestion,
      status: 'finish',
      content: [
        {
          "img": "",
          "text": "",
          // "aiImg": "/images/team/avater.png",
          "aiImg": "/images/ai-avater.png",
          "title": "答",
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
    /**例子
     * <li>
        <p><strong>菲律宾与日本加强防务合作：</strong>菲律宾众议院议长费迪南德·马丁·罗穆亚尔德斯（Ferdinand Martin Romualdez）和日本议长福士郎·野中（Fukushiro Nukaga）承诺扩大和加强双边关系以及与美国的三边关系。</p>
        <p>来源: <a href="https://www.msn.com/en-ph/news/other/ph-japan-speakers-to-boost-defense-ties-expand-trilateral-ties-with-us/ar-BB1oqcub">MSN</a></p>
      </li>
     */
    const parser = new DOMParser();
    // 解析HTML字符串
    const doc = parser.parseFromString(content, 'text/html');
    const h4Tag = doc.querySelector('h4');
    let newsTitle = ''
    debugger
    if (h4Tag) {
      newsTitle = h4Tag.textContent // 优先取答案返回的标题
    }
    // 通过查询选择器获取解析后的DOM元素
    const liTags = doc.querySelectorAll('li');
    if (liTags && liTags.length > 0) {
      liTags.forEach(li => {
        const pTags = li.querySelectorAll('p');
        if (pTags && pTags.length > 0) {
          if (!newsTitle) {
            // 没有标题，则取下面的问题
            if (chat.orignalQuestion) {
              newsTitle = chat.orignalQuestion
            } else {
              const strongTag = pTags[0].querySelector('strong');
              if (strongTag) {
                newsTitle = strongTag.textContent;
              }
            }
          }
          let matchPtag = Array.from(pTags).find(p => p.innerHTML.includes('(<a href='))
          if (!matchPtag) {
            matchPtag = Array.from(pTags).find(p => p.textContent.includes('来源:'))
          }
          if (matchPtag) {
            const aTag = matchPtag.querySelector('a');
            if (aTag) {
              const channel = aTag.textContent;
              const newQuestion = `${channel}对${newsTitle}具体报道是什么`
              const pTag = `<span onClick="dispatchNewsDetailEvent('${newQuestion}', '${chat.orignalQuestion}')" class="news-detail-link">${channel}</span>`
              matchPtag.innerHTML = matchPtag.innerHTML.replace(aTag.outerHTML, pTag);
            }
          }
        }
      })
      content = doc.body.innerHTML;
    }
  }
  
  return content
}

function dispatchNewsDetailEvent(question, orignalQuestion, e) {
  const event = new CustomEvent('newsDetailEvent', {
    detail: {
      question,
      orignalQuestion
    },
    bubbles: false, // 事件是否可以冒泡
    cancelable: true // 事件是否可以取消
  });
  // 触发自定义事件
  document.dispatchEvent(event);
}

export default TextGeneratorPage;
