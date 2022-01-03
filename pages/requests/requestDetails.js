import { Card, Grid, Button } from "semantic-ui-react";
import Link from "next/link";
import Campaign from "../../ethereum/build/Campaign.json";
import React from "react";
import web3 from "../../ethereum/web3";
import Layout from "../../components/Layout";
import ContributeSection from "../../components/contributeSection";

let curCampaignAddress;
let requestSet = [];

class campaignDetails extends React.Component {
  static async getInitialProps(props) {
    curCampaignAddress = props.query.curCampaignAddress;

    const campaignInstance = await new web3.eth.Contract(
      JSON.parse(Campaign.interface),
      curCampaignAddress
    );

    const firstR= await campaignInstance.methods.requests(0).call();
    requestSet.push(firstR);

    const secR= await campaignInstance.methods.requests(1).call();
    requestSet.push(secR);
    
    console.log(requestSet);
    return {
      requestSet,
    };
  }

    renderRequests() {
      //render all deployed campaigns as a Card Group
      const items = this.props.requestSet.map((curRequest) => {
        return {
          header: curRequest.descp,
          meta : curRequest.vendorAddress,
          description: curRequest.expenditure,
          fluid: true,
          style: {overflowWrap: "break-word"}
        };
      });
      return <Card.Group items={items} />;
    }

  render() {
    return (
      <Layout>
        <h1>This is request Details</h1>

        <Grid>
          <Grid.Column width={10}>
            {this.renderRequests()}

            <Link
              as={`/requests/createRequest/${curCampaignAddress}`}
              href={{
                pathname: `/requests/createRequest/`,
                query: { curCampaignAddress },
              }}
            >
              <a>
                <Button>Create a request</Button>
              </a>
            </Link>
          </Grid.Column>
          <Grid.Column width={5}>
            <ContributeSection address={curCampaignAddress} />
          </Grid.Column>
        </Grid>
      </Layout>
    );
  }
}

export default campaignDetails;
