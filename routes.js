const routes = require('next-routes')

routes()
.add("/campaigns/createCampaign", "/campaigns/campaignDetails")
.add("/campaigns/:campaignAddress", "/campaigns/campaignDetails");

module.exports = routes();  