import React, { Component } from "react";
import { Card, Button } from "semantic-ui-react";
import fcInstance from "../ethereum/factoryCampaign";
import Layout from "../components/Layout";
import { Link } from "../routes";

class CampaignIndex extends Component {
  static async getInitialProps() {
    //fn particular to next.js, runs on server side
    const campaignsList = await fcInstance.methods
      .getAllDeployedCampaigns()
      .call();
    return { campaignsList };
  }

  renderCampaigns() {
    //render all deployed campaigns as a Card Group
    const items = this.props.campaignsList.map((curCampaignAddress) => {
      return {
        header: curCampaignAddress,
        description: (
          <Link
            as={`/campaigns/${curCampaignAddress}`}
            href={{
              pathname: `/campaigns/campaignDetails/`,
              query: { curCampaignAddress },
            }}
          >
            <a>View campaign</a>
          </Link>
        ),
        fluid: true,
        style: { overflowWrap: "break-word" },
      };
    });
    return <Card.Group items={items} />;
  }
  render() {
    return (
      <Layout>
        <div>
          <h3>Active Campaigns</h3>
          <Link route="/campaigns/createCampaign">
            <a>
              <Button
                floated="right"
                content="Create Campaign"
                icon="add circle"
                primary
              />
            </a>
          </Link>

          {this.renderCampaigns()}
        </div>
      </Layout>
    );
  }
}

export default CampaignIndex;
