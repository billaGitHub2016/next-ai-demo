import React from 'react';
import { useConfirm } from 'material-ui-confirm';

const SingleRightPanel = ({ title, isActive, id, ...props }) => {
    const confirm = useConfirm();
    const onDeleteClick = e => {
        e.stopPropagation();
        e.preventDefault();
        confirm({ title: '确认要删除会话吗?', description: '将删除该会话的所有消息', confirmationText: '删除', cancellationText: '取消'})
        .then(() => {
            props.onDeleteTopic(id);
        })
        .catch(() => {
        });
    };

    return (
        <>
            <li
                className={`history-box ${props.topic?.id === id ? 'active' : ''}`}
                onClick={props.onTopicClick.bind(null, id)}
            >
                <span>{title}</span>
                {title !== '其他' && (
                    <a
                        className='dropdown-item'
                        href=''
                        style={{ width: 'auto' }}
                    >
                        <i className={`feather-trash-2`} onClick={onDeleteClick}></i>
                    </a>
                )}
                {/* <div className='dropdown history-box-dropdown'>
                    <button
                        type='button'
                        className='more-info-icon dropdown-toggle'
                        data-bs-toggle='dropdown'
                        aria-expanded='false'
                        onClick={onMoreBtnClick}
                    >
                        <i className='feather-more-horizontal'></i>
                    </button>
                    <ul className='dropdown-menu'>
                        <li>
                            <a className='dropdown-item' href='javascript:void();'>
                                <i className={`feather-trash-2`} onClick={onDeleteClick}></i> 删除
                            </a>
                        </li>
                    </ul>
                </div> */}
            </li>
        </>
    );
};

export default SingleRightPanel;
