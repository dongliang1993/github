/**
 * 设置缓存仓库信息的模块
 */

import LRU from 'lru-cache'

const interval = 1000 * 60 * 60;
/**
 * 缓存对象
 * @type {LRUCache}
 */
const cache = new LRU({
  maxAge: interval
});

/**
 * 缓存一个仓库
 * @param repo 仓库
 */
export function set(repo) {
  const full_name = repo.full_name;
  cache.set(full_name, repo)
}

/**
 * 从缓存中得到repo
 * @param full_name 全名：/facebook/react
 */
export function get(full_name) {
  return cache.get(full_name)
}

/**
 * 缓存所有仓库
 * @param repos 仓库集合
 */
export function setArray(repos) {
  repos.forEach(repo => set(repo))
}
