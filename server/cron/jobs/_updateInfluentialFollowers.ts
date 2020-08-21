import users from "../../config/users";
import { sortArrayBy } from "../../utils/array_utils";
import InfluencerModel from "../../db/models/influencer";

export const updateInfluentialFollowers = () => {
  const TwitterClient = new TwitterClient();

  users.forEach(async ({ id }) => {
    console.log(`Updating influencers for user: ${id}`);

    const followers = await TwitterClient.getFollowersProfileData(id);

    const influencers = [];

    sortArrayBy(followers, [
      {
        prop: "verified",
        direction: 1,
      },
      {
        prop: "followers_count",
        direction: 1,
      },
    ])
      .slice(0, 20)
      .forEach(async ({ id, screen_name }) => {
        const influencer = {
          id,
          screen_name,
        };

        const tweets = await TwitterClient.getLatestTweets(id);

        influencer["rt_avg"] =
          tweets.reduce((total, tweet) => total + tweet.retweet_count, 0) /
          tweets.length;

        influencer["fav_avg"] =
          tweets.reduce((total, tweet) => total + tweet.favorite_count, 0) /
          tweets.length;
      });
  });
};
