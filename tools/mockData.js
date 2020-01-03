const categories = require("./Data/Categories");
const giftCards = require("./Data/GiftCardMockData");
const commentsReviews = require("./Data/CommentsReviews");
const brands = require("./Data/BrandsData");
const users = require("./Data/UserData");
const userGifts = require("./Data/UserGifts");

const user_gifts = userGifts;
const comments_reviews = commentsReviews;

// Using CommonJS style export so we can consume via Node (without using Babel-node)
module.exports = {
  giftCards,
  users,
  user_gifts,
  categories,
  comments_reviews,
  brands
};
