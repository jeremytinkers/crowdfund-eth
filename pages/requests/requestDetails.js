import { Card, Grid, Button } from "semantic-ui-react";
import Link from "next/link";
import Campaign from "../../ethereum/build/Campaign.json";
import React from "react";
import web3 from "../../ethereum/web3";
import Layout from "../../components/Layout";
import ContributeSection from "../../components/contributeSection";

let curCampaignAddress;

class campaignDetails extends React.Component {
  static async getInitialProps(props) {
    let requestSet = [];
    curCampaignAddress = props.query.curCampaignAddress;

    const campaignInstance = await new web3.eth.Contract(
      JSON.parse(Campaign.interface),
      curCampaignAddress
    );

    const curManagerAddress = await campaignInstance.methods.manager().call();

    let accounts = await web3.eth.getAccounts();

    const requestsSize = await campaignInstance.methods
      .getRequestsLength()
      .call();

    for (let i = 0; i < requestsSize; i++) {
      let tempReq = await campaignInstance.methods.requests(i).call();
      requestSet.push(tempReq);
    }

    console.log(requestSet);
    return {
      requestSet,
      campaignInstance,
      accounts,
      curManagerAddress,
    };
  }

  submitVote = async (idx, vote) => {
    console.log("submitvote!");
    console.log(curCampaignAddress);

    try {
      await this.props.campaignInstance.methods
        .voteRequest(idx, vote)
        .send({ from: this.props.accounts[0] });
    } catch (error) {
      console.log(error.message);
    }
  };

  completeRequest = async (idx) => {
    console.log("completRequest");

    try {
      await this.props.campaignInstance.methods
        .completeRequest(idx)
        .send({ from: this.props.accounts[0] });
    } catch (error) {
      console.log(error.message);
    }
  };

  renderRequests() {
    //TODO? : ADD a fn in campaign.sol to tell us if a contributor has already voted for a particular request or no
    const items = this.props.requestSet.map((curRequest, index) => {
      return {
        header: curRequest.descp,
        meta: curRequest.vendorAddress,
        description: (
          <div>
            <p>Expenditure: {curRequest.expenditure}</p>
            {curRequest.complete ? (
              <div>
                <p>Request has been processed</p>
              </div>
            ) : (
              <div>
                <p>Yes : {curRequest.yes}</p>
                <p>No : {curRequest.no}</p>
                <p>
                  <Button onClick={() => this.submitVote(index, true)}>
                    Vote Yes
                  </Button>
                  <Button onClick={() => this.submitVote(index, false)}>
                    Vote No
                  </Button>
                </p>
                {this.props.curManagerAddress == this.props.accounts[0] ? (
                  <Button primary onClick={() => this.completeRequest(index)}>
                    Transfer Vendor Funds
                  </Button>
                ) : (
                  <></>
                )}
              </div>
            )}
          </div>
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
        </Grid>
      </Layout>
    );
  }
}

export default campaignDetails;
