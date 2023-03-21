import fetchJsonp from "fetch-jsonp";
import { PARAMI_AIRDROP } from "../models/parami";
import { fetchWithCredentials, fetchWithSig } from "../utils/api.util";

const DEFAULT_TWEET = 'Become a mining node by leveraging your social influence to earn revenue. #GPTMiner';

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

export const generateTweetContent = async () => {
  try {
    const resp = await fetchWithCredentials(`${PARAMI_AIRDROP}/influencemining/api/tweets`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
    });
    if (!resp) {
      return DEFAULT_TWEET;
    }
    const tweet = await resp.json();
    return tweet.substring(1, tweet.length - 1);
  } catch (e) {
    return DEFAULT_TWEET;
  }
}