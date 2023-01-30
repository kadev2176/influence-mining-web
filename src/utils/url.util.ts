
import qs from 'qs';

export const parseUrlParams = () => {
  try {
    const url = new URL(window.location.href);
    return {
      ...qs.parse(url.search.substring(1))
    }
  } catch (e) {
    console.log('Parse url params error', e);
    return {}
  }
}