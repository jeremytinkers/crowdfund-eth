# crowdfund-eth
A **Next.js, crowdfunding** app built over the **Ethereum** blockchain to **safely collect funds** for campaigns and **prevent fraudulent Vendor spends**. 

## Getting started:-

The following app has been built to test and thus is currently tied to the **Rinkeby** Testnet using an **Infura** node. ( The node link has been provided and made public. You don't necessarily have to set up a new one )

### Basic & Mandatory setup:-
1. You would need nodejs and Metamask to proceed with the app
2. Run `npm i`

### If you seek to run it as it is (with the current instance of FactoryCampaign) :-<br />
1. Run `npm run dev` from the root directory (A public metamask test account mnemonic has been used for your conveneience. View key in config.js)


### If you want to tweak the contract or redeploy from scratch:-
1. Swap the metamask mnemonic in config.js with your personal mnemonic. 
2. cd ethereum/
3. Run `node compile.js` 
4. Run `node deploy.js`
5. Use the address logged in the console from the above step and replace the address assigned in factoryCampaign.js
6. cd to root directory
7. Run `npm run dev`

