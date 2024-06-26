'use client';

import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import ReactLoading from 'react-loading';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
// import RightPanelData from '../../data/dashboard.json';
import SingleRightPanel from './Props/SingleRightPanel';
import { useAppContext } from '@/context/Context';
import { fetchData } from '../../utils/http'

const RightpanelDashboard = forwardRef((props, ref) => {
    const { shouldCollapseRightbar, user } = useAppContext();
    const [sectionStates, setSectionStates] = useState({
        previous: true,
        yesterday: true,
        older: true,
    });
    const [historyTopics, setHistoryTopics] = useState([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const pathname = usePathname()
    const searchParams = useSearchParams()

    useImperativeHandle(ref, () => ({
        getHistoryTopics
    }));

    const toggleSection = section => {
        setSectionStates(prevState => ({
            ...prevState,
            [section]: !prevState[section],
        }));
    };

    const getHistoryTopics = async () => {
        if (!user) {
            return
        }
        setLoading(true);
        const search = {
            pageNo: 1,
            pageSize: 5,
        };
        const urlParams = new URLSearchParams(search).toString();
        const res = await fetchData(`/apis/topic${urlParams ? '?' + urlParams : ''}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        }, router, toast, `${pathname}?${searchParams}`)
            .catch(err => {
                return {
                    message: err.message,
                };
            })
            .finally(() => {
                setLoading(false);
            });
        if (res.code === '0') {
            const topicList = res.data.list;
            topicList.push({
                id: null,
                title: '其他'
            })
            setHistoryTopics(topicList);
        }
    };

    const onDeleteTopic =  (id) => {
        deleteTopic(id);
    }

    const deleteTopic = async (id) => {
        await fetchData(`/apis/topic?id=${id}`, {
            method: "DELETE",
            headers: {
              'Content-Type': 'application/json',
            },
            cache: 'no-store'
          }, router, toast, `${pathname}?${searchParams}`).then((res) => {
            if (res.code === '1') {
            } else {
                toast.success('会话删除成功')
                getHistoryTopics();
            }
          }).catch(err => {
            
          })
    }

    useEffect(() => {
        getHistoryTopics();
    }, [user]);

    return (
        <>
            <div
                className={`rbt-right-side-panel popup-dashboardright-section ${
                    shouldCollapseRightbar ? 'collapsed' : ''
                }`}
            >
                <div className='right-side-top'>
                    <a
                        className='btn-default bg-solid-primary'
                        data-bs-toggle='modal'
                        data-bs-target='#newchatModal'
                    >
                        <span className='icon'>
                            <i className='feather-plus-circle'></i>
                        </span>
                        <span>新会话</span>
                    </a>
                </div>
                <div className='right-side-bottom'>
                    {/* <div className='small-search search-section mb--20'>
                        <input type='search' placeholder='Search Here...' />
                        <i className='feather-search'></i>
                    </div> */}

                    <div className='chat-history-section'>
                        <h6 className='title'>
                            历史会话{' '}
                            {loading && (
                                <ReactLoading
                                    style={{ height: '20px', width: '20px', marginRight: '10px' }}
                                    type='spin'
                                    color='#fff'
                                />
                            )}
                        </h6>
                        <ul className='chat-history-list'>
                            {historyTopics &&
                                historyTopics.map(data => (
                                    <SingleRightPanel
                                        topicLogLoading={props.topicLogLoading}
                                        topic={props.topic}
                                        onTopicClick={props.onTopicClick}
                                        onDeleteTopic={onDeleteTopic}
                                        {...data}
                                        key={data.id}
                                        RightPanelData={data}
                                        data-id={data.id}
                                    />
                                ))}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
});

export default RightpanelDashboard;
