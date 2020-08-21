"use strict";
import { Model } from "sequelize";

const InfluencerModel = (sequelize, DataTypes) => {
  class Influencer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Influencer.init(
    {
      userid: DataTypes.STRING,
      type: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Influencer",
    }
  );

  return Influencer;
};

export default InfluencerModel;
