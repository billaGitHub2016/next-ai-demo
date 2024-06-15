
export function setUserCache(user) {
  // 将用户信息存储到本地缓存中
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user));
  }
}

export function getUserCache() {
  // 从本地缓存中获取用户信息
  if (typeof window !== 'undefined') {
    const cache = localStorage.getItem('user')
    if (cache) {
      try {
        return JSON.parse(cache);
      } catch (error) {
        return null
      }
    }
  }
  return null
}

export function removeUserCache() {
  // 清除本地缓存中的用户信息
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user');
  }
}