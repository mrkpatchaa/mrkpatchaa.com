const debug = process.env.NODE_ENV !== "production";
module.exports = {
  images: {
    loader: "custom",
    path: "https://mrkpatchaa.com/",
  },
  assetPrefix: !debug ? "https://mrkpatchaa.com/" : "",
};
