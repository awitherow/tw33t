import users from "../../config/users";
import { sortArrayBy } from "../../utils/array_utils";
import Sequelize from "sequelize";
import { Influencer } from "../../db/models";

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
      .forEach(async ({ id, screen_name, verified, followers_count }) => {
        const influencer = {
          id,
          screen_name,
          verified,
          followers_count,
        };

        const tweets = await TwitterClient.getLatestTweets(id);

        influencer["rt_avg"] =
          tweets.reduce((total, tweet) => total + tweet.retweet_count, 0) /
          tweets.length;

        influencer["fav_avg"] =
          tweets.reduce((total, tweet) => total + tweet.favorite_count, 0) /
          tweets.length;

        const existing = await Influencer.findOne({ where: { id } });

        if (existing) {
          existing.update({ ...influencer });
        } else {
          Influencer.create({ ...influencer });
        }
      });

    // CLEAN UP
    const saved = await Influencer.findAll({
      order: [
        ["followers_count", "DESC"],
        ["rt_avg", "DESC"],
        ["fav_avg", "DESC"],
      ],
    });

    const savedLength = saved.length;

    if (savedLength) {
      Influencer.destroy({
        truncate: true,
      });

      Influencer.bulkCreate(
        saved.slice(0, savedLength >= 30 ? 30 : savedLength)
      );
    }
  });
};
