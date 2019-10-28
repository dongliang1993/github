import 'github-markdown-css'
import MarkDownIt from 'markdown-it'
import {memo, useMemo} from 'react'

const md = new MarkDownIt({
  // 将md转换成html
  html: true,
  // 将md中的链接转化成a标签
  linkify: true
});
const base64ToUTF8 = str => {
  return decodeURIComponent(escape(atob(str)))
};
export default memo(({content, isBase64}) => {
  const markdown = isBase64 ? base64ToUTF8(content) : content;
  // 只要markdown不发生改变，那么html就不发生改变，那么该组件就不会发生变化
  const html = useMemo(() => md.render(markdown), [markdown]);
  return (
      <div className={'markdown-body'}>
        <div dangerouslySetInnerHTML={{__html: html}}/>
      </div>
  )
})
