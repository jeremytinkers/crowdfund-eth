import web3 from "./web3";
import FactoryCampaign from "./build/FactoryCampaign.json";

const fcInstance = new web3.eth.Contract(
  JSON.parse(FactoryCampaign.interface),
  "0xA5e238D47883Dc9d3346b05BFf08879bAb57aEe2"
);

export default fcInstance;