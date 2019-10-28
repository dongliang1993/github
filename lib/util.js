export function debounce(fn, delay) {
  let timer = null, context = this;
  return function (...arg) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(context, arg)
    }, delay)
  }
}
