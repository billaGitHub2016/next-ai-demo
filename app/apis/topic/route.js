import { cookies } from 'next/headers';
import { getUserByJwt, validateJwt } from '../../../services/user_lead';
import { saveTopic, getTopicByPage, deleteTopicById } from '../../../services/topic';

export async function POST(request) {
    const jwt = cookies().get('jwt')?.value;
    try {
        await validateJwt(jwt)
    } catch (err) {
        return new Response(
            JSON.stringify({
                code: '1',
                message: err.message,
            }),
            {
                status: 401,
                headers: {
                    'Content-type': 'application/json',
                },
            }
        );
    }
    try {
        const user = await getUserByJwt(jwt);
        const body = await request.json();
        const newTopic = await saveTopic(user, body.topic);

        if (newTopic) {
            return new Response(
                JSON.stringify({
                    code: '0',
                    data: {
                        topic: newTopic,
                    },
                    message: '添加话题成功',
                }),
                {
                    headers: {
                        'Content-type': 'application/json',
                    },
                }
            );
        }
    } catch (error) {
        console.error('添加话题失败', error);
        return new Response(
            JSON.stringify({
                code: '1',
                message: '添加话题失败',
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
    const jwt = cookies().get('jwt')?.value;
    try {
        await validateJwt(jwt)
    } catch (err) {
        console.error('get topic err= ', err)
        return new Response(
            JSON.stringify({
                code: '1',
                message: err.message,
            }),
            {
                status: 401,
                headers: {
                    'Content-type': 'application/json',
                },
            }
        );
    }

    try {
        const user = await getUserByJwt(jwt);
        const url = new URL(request.url);
        const pageNo1 = url.searchParams.get('pageNo')
        const pageSize1 = url.searchParams.get('pageSize')
        const { topics, total, pageNo, pageSize } = await getTopicByPage({
            userId: user.id,
            pageSize: parseInt(pageSize1),
            pageNo: parseInt(pageNo1)
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
                message: '查询历史会话成功',
            }),
            {
                headers: {
                    'Content-type': 'application/json',
                },
            }
        );
    } catch (error) {
        console.error('查询历史会话失败', error);
        return new Response(
            JSON.stringify({
                code: '1',
                message: '查询历史会话失败',
            }),
            {
                headers: {
                    'Content-type': 'application/json',
                },
            }
        );
    }
}

export async function DELETE(request) {
    try {
        const jwt = cookies().get('jwt')?.value;
        const user = await getUserByJwt(jwt);
        const url = new URL(request.url);
        const id = url.searchParams.get('id')
        await deleteTopicById({
            id,
            userId: user.id
        })
    } catch (error) {
        console.error('删除会话失败', error);
        return new Response(
            JSON.stringify({
                code: '1',
                message: '删除会话失败:' + error.message,
            }),
            {
                headers: {
                    'Content-type': 'application/json',
                },
            }
        );
    }

    return new Response(
        JSON.stringify({
            code: '0',
            message: '删除会话成功',
        }),
        {
            headers: {
                'Content-type': 'application/json',
            },
        }
    );
}