import fetch from "node-fetch";
import { api, secret, token } from "../config/twitter";

import { chunkArray } from "../utils/array_utils";

class TwitterClient {
  constructor(api, secret, token) {
    this.api = api;
    this.secret = secret;
    this.token = token;
  }

  apiUrl(endpoint, options) {
    let optStr = "";
    let firstOptionParsed = false;

    for (const [key, value] of Object.entries(options)) {
      if (!firstOptionParsed) firstOptionParsed = true;
      optStr += `${!firstOptionParsed ? "?" : "&"}${key}=${value}`;
    }

    return `https://api.twitter.com/1.1/${endpoint}${options}`;
  }

  baseFetch = (apiUrl, customHeaders = {}, body) => {
    const headers = {
      ...defaultHeaders,
      ...customHeaders,
    };

    return fetch(url, headers, body);
  };

  getFollowerIds = async (userId) => {
    // const callsLimit = 15;

    // TODO: limited to first 3,000. Implement paging.
    let options = {
      user_id: userId,
      stringify_ids: true,
      count: 3000,
    };

    try {
      const response = await this.baseFetch(
        this.apiUrl("followers/ids.json", options)
      );
      const json = await response.json();
      return json.ids;
    } catch (error) {
      console.error(error);
    }
  };

  getFollowersProfileData = async () => {
    const follwerIds = await this.getFollowerIds(userId);
    const userIds = chunkArray(followerIds, 100);

    userIds.map((ids) => {
      let options = {
        user_id: userIds.join(","),
      };

      try {
        const response = await this.baseFetch(
          this.apiUrl("users/lookup.json", options)
        );
        const json = await response.json();
        return json.ids;
      } catch (error) {
        console.error(error);
      }
    });
  };
}
