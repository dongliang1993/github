/**
 * koa-session关联redix的仓库
 */

function getRedisSessionId(sessionId) {
  return `ssid:${sessionId}`
}

module.exports = class RedisSessionStore {
  constructor(client) {
    this.client = client
  }

  // 根据sessionId获取redis中存储的session数据
  async get(sessionId) {
    const id = getRedisSessionId(sessionId);
    // 获取data，此时为序列化的字符串
    const data = await this.client.get(id);
    if (!data) {
      return null
    }
    try {
      // 将字符串转换成json对象
      return JSON.parse(data);
    } catch (e) {
      console.log(e)
    }
  }

  // 存储session数据到redis
  async set(sessionId, sessionValue, lifetime) {
    const id = getRedisSessionId(sessionId);
    if (typeof lifetime === "number") {
      // redis数据库的过期时间是以s为单位所以需要除以1000
      lifetime = Math.ceil(lifetime / 1000);
    }
    try {
      // 序列化对象为字符串进行存储
      const sessionStr = JSON.stringify(sessionValue);
      // 有过期时间，则设置过期时间
      if (lifetime) {
        await this.client.setex(id, lifetime, sessionStr)
      } else {
        await this.client.set(id, sessionStr)
      }
    } catch (e) {
      console.log(e)
    }
  }

  // 从redis中删除某个session
  async destroy(sessionId) {
    const id = getRedisSessionId(sessionId);
    await this.client.del(id)
  }
};
