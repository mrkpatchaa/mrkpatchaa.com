const debug = process.env.NODE_ENV !== "production";
module.exports = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  assetPrefix: !debug ? "https://mrkpatchaa.com/" : "",
};
