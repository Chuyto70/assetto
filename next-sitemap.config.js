/**
 * @type {import('next-sitemap').IConfig}
 * @see https://github.com/iamvishnusankar/next-sitemap#readme
 */
module.exports = {
  siteUrl: process.env.DEPLOYMENT_PORT
    ? `https://${process.env.DEPLOYMENT_HOST}:${process.env.DEPLOYMENT_PORT}`
    : `https://${process.env.DEPLOYMENT_HOST}`,
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }],
  },
};
