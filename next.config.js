const debug = process.env.NODE_ENV !== "production";
module.exports = {
  images: {
    unoptimized: true,
  },
  assetPrefix: !debug ? "https://mrkpatchaa.com/" : "",
};
