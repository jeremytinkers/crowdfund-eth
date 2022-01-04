const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const compiledFactory = require("./build/FactoryCampaign.json");
const metamaskMnemonic = require("./config");

const provider = new HDWalletProvider(
  metamaskMnemonic,
  "https://rinkeby.infura.io/v3/2791c633103f4d4e96dc95527e21303a"
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Attempting to deploy from account", accounts[0]);

  try {
    const result = await new web3.eth.Contract(
      JSON.parse(compiledFactory.interface)
    )
      .deploy({ data: compiledFactory.bytecode })
      .send({ gas: "10000000", from: accounts[0] });
    console.log("Contract deployed to", result.options.address);
  } catch (error) {
    console.log(error.message);
  }

  provider.engine.stop();
};

deploy();
