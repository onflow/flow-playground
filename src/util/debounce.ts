export default function debounce(func: any, wait = 500) {
  let timeout: any;
  return function(...args: any) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}
