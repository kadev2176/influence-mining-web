import fetchJsonp from "fetch-jsonp";

export interface OembedTweet {
  tweetId: string;
  authorName: string;
  authorUrl: string;
  html: string;
  tweetUrl: string;
  tweetContent: string;
}

export const fetchOembedTweet = async (tweetId: string) => {
  const resp = await fetchJsonp(`https://publish.twitter.com/oembed?url=https://twitter.com/twitter/status/${tweetId}&hide_media=true&hide_thread=true&omit_script=true`).catch((error) => {
    console.log('fetch tweet error', error);
    return null;
  });
  if (!resp) {
    return null;
  }
  const tweetJson = await resp.json();
  
  const parser = new DOMParser();
  const doc = parser.parseFromString(tweetJson.html, 'text/html');
  const tweetContent = doc.querySelector('blockquote p')?.textContent;
  return {
    authorName: tweetJson.author_name,
    authorUrl: tweetJson.author_url,
    html: tweetJson.html,
    tweetUrl: tweetJson.url,
    tweetContent,
    tweetId
  } as OembedTweet;
}