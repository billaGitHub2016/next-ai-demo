"use client";

import React, { useEffect, useLayoutEffect } from "react";

import sal from "sal.js";
import Image from "next/image";

import TextGeneratorData from "../../data/dashboard.json";
import Reaction from "../Common/Reaction";
import './text-typing.css';

const TextGenerator = (props) => {
  const { chats } = props;

  useEffect(() => {
    sal();

    const cards = document.querySelectorAll(".bg-flashlight");

    cards.forEach((bgflashlight) => {
      bgflashlight.onmousemove = function (e) {
        let x = e.pageX - bgflashlight.offsetLeft;
        let y = e.pageY - bgflashlight.offsetTop;

        bgflashlight.style.setProperty("--x", x + "px");
        bgflashlight.style.setProperty("--y", y + "px");
      };
    });

    // const typingChat = chats.find(item => item.status === 'typing')
    // if (typingChat) {
    //   const typingText = document.querySelector(`#text-typing-${typingChat.id}`)
    //   printText(typingText, typingChat.content[0].typingText)
    // } else {
    //   setPrintTextEnd()
    // }

  }, [chats]);

  return (
    <>
      {/* {TextGeneratorData &&
        TextGeneratorData.textGenerator.map((data, index) => (<ChatBox data={data} key={index}/>))} */}
      {chats &&
        chats.map((data) => (<ChatBox data={data} key={data.id} onRegenerate={props.onRegenerate}/>))}
    </>
  );
};

const ChatBox = (props) => {
  const { data, onRegenerate } = props
  return (
    <div
      className="chat-box-list pt--30"
      id="chatContainer"
      data-sal="slide-up"
      data-sal-duration="700"
      data-sal-delay="100"
    >
      <div className="chat-box author-speech bg-flashlight">
        <div className="inner">
          <div className="chat-section">
            <div className="author">
              <Image
                className="w-100"
                width={40}
                height={40}
                src={data.author}
                alt="Author"
              />
            </div>
            <div className="chat-content">
              <h6 className="title">{data.title}</h6>
              <p>{data.desc}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="chat-box ai-speech bg-flashlight">
        {data.content.map((innerData, innerIndex) => (
          <div
            className="inner top-flashlight leftside light-xl"
            key={innerIndex}
          >
            <div className="chat-section generate-section">
              {
                innerData.img && <div className="author">
                  <Image
                    src={innerData.img}
                    width={40}
                    height={40}
                    alt="Loader Images"
                  />
                </div>
              }
              { 
                innerData.text && <div className="chat-content">
                  <h6 className="title color-text-off mb--0">
                    {innerData.text}
                  </h6>
                </div> 
              }
            </div>
            <div className="chat-section">
              <div className="author">
                {/* <Image
                  className="w-100"
                  src={innerData.aiImg}
                  width={40}
                  height={40}
                  alt="ChatenAI"
                /> */}
                 <span className="rainbow-badge-card">
                  H.S.
                </span>
              </div>
              <div className="chat-content">
                <h6 className="title">
                  {innerData.title}
                </h6>
                {innerData.desc2 ? (
                  <p className="">{innerData.desc2}</p>
                ) : (
                  ""
                )}
                {/* { data.status === 'finish' && <p className="mb--20">{innerData.desc}</p> } */}
                {/* { data.status === 'typing' && <p className="mb--20">
                    {innerData.lastDesc}
                    <span id={`text-typing-${data.id}`}></span>
                  </p> } */}
                  <div dangerouslySetInnerHTML={{ __html: innerData.desc }} />
                <Reaction onRegenerate={onRegenerate.bind(null, data)}/>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * @description:
 * @param {HTMLElement} dom - 打印内容的dom
 * @param {string} content - 打印文本内容
 * @param {number} speed - 打印速度
 * @return {void}
 */
let printtingTimer = null
function printText(dom, content, speed = 50) {
  if (printtingTimer) {
    clearInterval(printtingTimer)
  }
  dom.innerText = ''
  let index = 0
  setCursorStatus(dom, 'typing')
  printtingTimer = setInterval(() => {
    dom.innerText += content[index]
    index++
    if (index >= content.length) {
      clearInterval(printtingTimer)
    }
  }, speed)
}

function setPrintTextEnd() {
  const allTypingDom = document.querySelectorAll('.typing')
  allTypingDom.forEach(d => {
    setCursorStatus(d, 'end')
  })
}

/**
 * @description: 设置dom的光标状态
 * @param {HTMLElement} dom - 打印内容的dom
 * @param {"loading"|"typing"|"end"} status - 打印状态
 * @return {void}
 */
function setCursorStatus(dom, status) {
  const classList = {
    loading: 'typing blinker',
    typing: 'typing blinker',
    end: '',
  }
  if (dom) {
    dom.className = classList[status]
  }
}

export default TextGenerator;
