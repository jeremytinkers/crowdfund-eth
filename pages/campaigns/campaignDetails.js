import { Card } from "semantic-ui-react";
import Campaign from "../../ethereum/build/Campaign.json";
import React from "react";
import web3 from "../../ethereum/web3";
import Layout from "../../components/Layout";

let curCampaignAddress;

class campaignDetails extends React.Component {
  static async getInitialProps(props) {
    curCampaignAddress = props.query.curCampaignAddress;
    console.log(props.query.curCampaignAddress);
    //fn particular to next.js, runs on server side

    const campaignInstance = await new web3.eth.Contract(
      JSON.parse(Campaign.interface),
      curCampaignAddress
    );

    const campaignDetails = await campaignInstance.methods
      .getAllDetails()
      .call();
    console.log(campaignDetails);

    return {
      manager: campaignDetails[0],
      minContribution: campaignDetails[1],
      noContributors: campaignDetails[2],
      noRequests: campaignDetails[3],
    };
  }

  renderDetails() {
    //render all details as a Card Group
    const { manager, minContribution, noContributors, noRequests } = this.props;
    const items = [
      {
        header: manager,
        description: "Address of Manager (Creator of Campaign)",
        style: {overflowWrap: "break-word"}
      },
      {
        header: minContribution,
        description: "The Minimum Contribution one has to make to enter campaign",
        style: {overflowWrap: "break-word"}
      },
      {
        header: noContributors,
        description: "Total Number of Contributors to the campaign",
        style: {overflowWrap: "break-word"}
      },
      {
        header: noRequests,
        description: "Total Number of Spend Requests so far",
        style: {overflowWrap: "break-word"}
      },
    ];

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        {this.renderDetails()}
      </Layout>
    );
  }
}

export default campaignDetails;
