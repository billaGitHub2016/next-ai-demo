
const WHITE_LIST = ['/signin']

/**
 * 封装 fetch 请求
 * @param {string} url 请求的 URL
 * @param {Object} options fetch 请求的配置项
 * @returns {Promise} 返回解析后的数据或错误信息
 */
export const fetchData = async (url, options = {}, router, toast, to) => {
    try {
      // 发起 fetch 请求
      const response = await fetch(url, options);
      // 解析 JSON 数据
      const data = await response.json();
        debugger
      // 检查 HTTP 状态码
      if (!response.ok) {
        if (toast) {
            // console.log(data)
            toast.error(data.message)
        }
        // 如果状态码不是 2xx，抛出错误
        const error = new Error(`HTTP error! status: ${response.status}`);
        // 可以添加额外的错误处理逻辑，例如根据状态码抛出不同的错误
        if (response.status === 401) {
        //   error.message = 'Unauthorized: Please login again.';
            if (!WHITE_LIST.some(item => url.includes(item))) {
                if (to) {
                    router.replace(`/authPage?to=${encodeURI(to)}`)
                } else {
                    router.replace('/autoPage')
                }
            }
        } else if (response.status === 404) {
          
        }
        throw error;
      }
  
      // 返回解析后的数据
      return data;
    } catch (error) {
      // 处理网络错误或解析错误
      console.error('Fetch error:', error.message);
      throw error;
    }
  };