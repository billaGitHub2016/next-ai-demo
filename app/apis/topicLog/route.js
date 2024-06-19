import { cookies } from 'next/headers';
import { getUserByJwt } from '../../../services/user';
import { saveTopicLog, getTopicLogByPage } from '../../../services/topicLog';

export async function POST(request) {
    try {
        const jwt = cookies().get('jwt')?.value;
        const user = await getUserByJwt(jwt);
        const body = await request.json();
        const newTopicLog = await saveTopicLog(user, body.topic, body.topicLog);

        if (newTopicLog) {
            return new Response(
                JSON.stringify({
                    code: '0',
                    data: {
                        topicLog: newTopicLog,
                    },
                    message: '添加记录成功',
                }),
                {
                    headers: {
                        'Content-type': 'application/json',
                    },
                }
            );
        }
    } catch (error) {
        console.error('添加记录失败', error);
        return new Response(
            JSON.stringify({
                code: '1',
                message: '添加记录失败',
            }),
            {
                headers: {
                    'Content-type': 'application/json',
                },
            }
        );
    }
}

export async function GET(request) {
    try {
        const jwt = cookies().get('jwt')?.value;
        const user = await getUserByJwt(jwt);
        const url = new URL(request.url);
        const pageNo1 = url.searchParams.get('pageNo')
        const pageSize1 = url.searchParams.get('pageSize')
        const topicId = url.searchParams.get('topicId')
        const { topics, total, pageNo, pageSize } = await getTopicLogByPage({
            userId: user.id,
            pageSize: parseInt(pageSize1),
            pageNo: parseInt(pageNo1),
            topicId: topicId === 'null' ? null : topicId
        });

        return new Response(
            JSON.stringify({
                code: '0',
                data: {
                    list: topics,
                    pageNo,
                    pageSize,
                    total
                },
                message: '查询历史会话记录成功',
            }),
            {
                headers: {
                    'Content-type': 'application/json',
                },
            }
        );
    } catch (error) {
        console.error('查询历史会话记录失败', error);
        return new Response(
            JSON.stringify({
                code: '1',
                message: '查询历史会话记录失败',
            }),
            {
                headers: {
                    'Content-type': 'application/json',
                },
            }
        );
    }
}


