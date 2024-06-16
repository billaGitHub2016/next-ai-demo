"use client";

import React, { useEffect, useState } from "react";
import sal from "sal.js";
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import Items from "../Dashboard/items";
import Link from "next/link";

const Modal = (props) => {
  const [selectedValues, setSelectedValues] = useState([]);

  const { register: topicRegister, handleSubmit: topicHandleSubmit, formState: { errors }, reset: resetTopicForm } = useForm({
    defaultValues: {
      topic: '',
    },
    mode: 'onBlur'
  });
  const onToppicSubmit = async (data) => { 
    console.log('onToppicSubmit data = ', data)
    const res = await fetch('/apis/topic', {
      method: "POST",
      body: JSON.stringify({ topic: { title: data.topic } }),
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    }).then(res => res.json()).catch(err => {
      return {
        message: err.message,
      }
    })
    if (res.code === '0') {
      props.onTopicSubmit({ topic: res.data.topic })
      toast.success(res.message)
      resetTopicForm()
      const btn = document.querySelector('[data-bs-dismiss="modal"]')
      if (btn) {
        btn.click()
      }
    } else {
      toast.error(res.message)
    }
  };

  const handleChange = (event) => {
    const selectedOptions = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    setSelectedValues(selectedOptions);
  };

  useEffect(() => {
    sal();
  }, []);

  return (
    <>
      {/* ==== New Chat Section Modal ==== */}
      <div
        id="newchatModal"
        className="modal rbt-modal-box copy-modal fade"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content wrapper top-flashlight light-xl">
            <div
              className="section-title text-center mb--30 sal-animate"
              data-sal="slide-up"
              data-sal-duration="400"
              data-sal-delay="150"
            >
              <h3 className="title mb--0 w-600">添加新的话题</h3>
            </div>
            <div className="genarator-section">
              {/* <ul className="genarator-card-group">
                <Items />
              </ul> */}
              <form onSubmit={topicHandleSubmit(onToppicSubmit)}>
                  <div className='input-section mail-section'>
                      <input
                          style={{ height: '60px'}}
                          name='topic'
                          {...topicRegister('topic', {
                            required: {
                              value: true,
                              message: '请填主题'
                            },
                          })}
                          type='text'
                          placeholder='请填写主题，按回车提交'
                      />
                      {errors.topic && <p style={{ textAlign: 'left', color: 'red', marginTop: '10px' }}>{errors.topic.message}</p>}
                  </div>
              </form>
            </div>
            <button className="close-button" data-bs-dismiss="modal">
              <i className="feather-x"></i>
            </button>
          </div>
        </div>
      </div>

      {/* ==== Like Section Modal ==== */}
      <div
        id="likeModal"
        className="modal rbt-modal-box like-modal fade"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content wrapper top-flashlight leftside light-xl">
            <h5 className="title">Provide additional feedback</h5>
            <div className="chat-form">
              <div className="border-gradient text-form">
                <textarea rows="6" placeholder="Send a message..."></textarea>
              </div>
            </div>
            <div className="bottom-btn mt--20">
              <Link className="btn-default btn-small round" href="#">
                Send Feedback
              </Link>
            </div>
            <button className="close-button" data-bs-dismiss="modal">
              <i className="feather-x"></i>
            </button>
          </div>
        </div>
      </div>

      {/* ==== DisLike Section Modal ==== */}
      <div
        id="dislikeModal"
        className="modal rbt-modal-box dislike-modal fade"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content wrapper top-flashlight leftside light-xl">
            <h5 className="title">Why do you like this response?</h5>
            <select
              className="form-select"
              multiple
              aria-label="multiple select example"
              value={selectedValues}
              onChange={handleChange}
            >
              <option value="1">Irrelevant</option>
              <option value="2">Offensive</option>
              <option value="3">Not Correct</option>
            </select>
            <div className="chat-form">
              <h6 className="title">Provide your feedback</h6>
              <div className="border-gradient text-form">
                <textarea rows="6" placeholder="Send a message..."></textarea>
              </div>
            </div>
            <div className="bottom-btn mt--20">
              <Link className="btn-default btn-small round" href="#">
                Send Feedback
              </Link>
            </div>
            <button className="close-button" data-bs-dismiss="modal">
              <i className="feather-x"></i>
            </button>
          </div>
        </div>
      </div>

      {/* ==== Share Section Modal ==== */}
      <div
        id="shareModal"
        className="modal rbt-modal-box share-modal fade"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content wrapper modal-small top-flashlight leftside light-xl">
            <h5 className="title">Share</h5>
            <ul className="social-icon social-default transparent-with-border mb--20">
              <li
                data-sal="slide-up"
                data-sal-duration="400"
                data-sal-delay="200"
              >
                <Link href="https://www.facebook.com/">
                  <i className="feather-facebook"></i>
                </Link>
              </li>
              <li
                data-sal="slide-up"
                data-sal-duration="400"
                data-sal-delay="300"
              >
                <Link href="https://www.twitter.com">
                  <i className="feather-twitter"></i>
                </Link>
              </li>
              <li
                data-sal="slide-up"
                data-sal-duration="400"
                data-sal-delay="400"
              >
                <Link href="https://www.instagram.com/">
                  <i className="feather-instagram"></i>
                </Link>
              </li>
              <li
                data-sal="slide-up"
                data-sal-duration="400"
                data-sal-delay="500"
              >
                <Link href="https://www.linkdin.com/">
                  <i className="feather-linkedin"></i>
                </Link>
              </li>
            </ul>
            <div className="chat-form">
              <div className="border-gradient text-form d-flex align-items-center">
                <input
                  type="text"
                  className="copy-link-input"
                  defaultValue="https://www.youtube.com/"
                  readOnly
                />
                <button className="btn-default bg-solid-primary" type="submit">
                  Copy
                </button>
              </div>
            </div>
            <button className="close-button" data-bs-dismiss="modal">
              <i className="feather-x"></i>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
