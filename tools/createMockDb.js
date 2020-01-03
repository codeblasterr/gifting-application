/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");
const mockData = require("./mockData");

const {
  entertainments,
  giftCards,
  users,
  user_gifts,
  comments_reviews,
  categories,
  brands
} = mockData;
const data = JSON.stringify({
  entertainments,
  gifts: giftCards,
  users,
  categories,
  "user-gifts": user_gifts,
  "comments-reviews": comments_reviews,
  brands
});
const filepath = path.join(__dirname, "db.json");

fs.writeFile(filepath, data, function(err) {
  err ? console.log(err) : console.log("Mock DB created.");
});
