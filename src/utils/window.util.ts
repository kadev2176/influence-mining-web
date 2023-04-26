
import qs from 'qs';

export const parseUrlParams = () => {
  try {
    const url = new URL(window.location.href);
    return {
      ...qs.parse(url.search.substring(1)),
      ...qs.parse(url.hash.substring(1))
    }
  } catch (e) {
    console.log('Parse url params error', e);
    return {}
  }
}

export const openPopup = (url: string) => {
  window.open(url, 'Parami', 'popup,width=400,height=600');
}

export const subscribePostMessage = (cb: (msg: string) => void, condition: (event: MessageEvent<any>) => boolean) => {
  const handler = (event: MessageEvent) => {
    if (condition(event)) {
      cb(event.data);
      window.removeEventListener('message', handler);
    }
  }

  window.addEventListener('message', handler)
}
