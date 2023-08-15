/**
 * @type {import('next-sitemap').IConfig}
 * @see https://github.com/iamvishnusankar/next-sitemap#readme
 */
module.exports = {
  siteUrl: global.process.env.DEPLOYMENT_PORT
    ? `https://${global.process.env.DEPLOYMENT_HOST}:${global.process.env.DEPLOYMENT_PORT}`
    : `https://${global.process.env.DEPLOYMENT_HOST}`,
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }],
  },
};
