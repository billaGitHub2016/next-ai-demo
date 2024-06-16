import React from 'react';

const SingleRightPanel = ({ title, isActive, id, ...props}) => {
    return (
        <>
            <li className={`history-box ${props.topic?.id === id ? 'active' : ''}`} onClick={props.onTopicClick.bind(null, id)}>
                {title}
                <div className='dropdown history-box-dropdown'>
                    <button
                        type='button'
                        className='more-info-icon dropdown-toggle'
                        data-bs-toggle='dropdown'
                        aria-expanded='false'
                    >
                        <i className='feather-more-horizontal'></i>
                    </button>
                    {/* <ul className='dropdown-menu'>
                        {item.list.map((innerItem, innerIndex) => (
                            <li key={innerIndex}>
                                <a className='dropdown-item' href='#'>
                                    <i className={`feather-${innerItem.icon}`}></i> {innerItem.text}
                                </a>
                            </li>
                        ))}
                    </ul> */}
                </div>
            </li>
        </>
    );
};

export default SingleRightPanel;
