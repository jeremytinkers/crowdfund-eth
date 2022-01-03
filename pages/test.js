import fcInstance from "../ethereum/factoryCampaign";
import web3 from "../ethereum/web3";
import React from "react";

class Test extends React.Component {
  static async getInitialProps() {
    //runs on the server side, so worst case scenrio JS does not run on user's computer
    //or is too slow or metamask isnt available, the user can view props passed to component from this fn.
    let campaignList = await fcInstance.methods
      .getAllDeployedCampaigns()
      .call();
    console.log(campaignList);
    return { campaignList };
  }

  render() {
    return (
      <div>
        Campaigns:-
        {this.props.campaignList.map((curCampaign) => {
          return <div>Address: {curCampaign}</div>;
        })}
      </div>
    );
  }
}

export default Test;
