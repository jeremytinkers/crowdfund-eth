import web3 from "./web3";
import FactoryCampaign from "./build/FactoryCampaign.json";

const fcInstance = new web3.eth.Contract(
  JSON.parse(FactoryCampaign.interface),
  "0x05c24960e01C2ed52A5897C464b4dC22357c393a"
);

export default fcInstance;