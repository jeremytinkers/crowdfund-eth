import { Card, Grid, Button, Message } from "semantic-ui-react";
import Link from "next/link";
import Campaign from "../../ethereum/build/Campaign.json";
import React from "react";
import web3 from "../../ethereum/web3";
import Layout from "../../components/Layout";
import ContributeSection from "../../components/contributeSection";
import Router from "next/router";

let curCampaignAddress;

class campaignDetails extends React.Component {
  state = {
    errorMessage: "",
    loading: false,
  };
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
  //handles submission of users votes
  submitVote = async (idx, vote) => {
    console.log("submitvote!");
    console.log(curCampaignAddress);

    this.setState({ loading: true });

    try {
      await this.props.campaignInstance.methods
        .voteRequest(idx, vote)
        .send({ from: this.props.accounts[0] });
      Router.pushRoute("/");
    } catch (error) {
      console.log(error.message);
      this.setState({ errorMessage: error.message });
    }
    this.setState({ loading: false });
  };

  //transfer funds from campaign's wallet to Vendor
  completeRequest = async (idx) => {
    console.log("completRequest");

    this.setState({ loading: true });
    try {
      await this.props.campaignInstance.methods
        .completeRequest(idx)
        .send({ from: this.props.accounts[0] });
      Router.pushRoute("/");
    } catch (error) {
      console.log(error.message);
      this.setState({ errorMessage: error.message });
    }
    this.setState({ loading: false });
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
                  <Button positive onClick={() => this.submitVote(index, true)}>
                    Vote Yes
                  </Button>
                  <Button
                    negative
                    onClick={() => this.submitVote(index, false)}
                  >
                    Vote No
                  </Button>
                </p>
                {}
                {this.props.curManagerAddress == this.props.accounts[0] ? (
                  <Button secondary onClick={() => this.completeRequest(index)}>
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
        <h1>List of Spend Requests:-</h1>

        <Grid>
          <Grid.Column width={6}>
            {this.renderRequests()}
            {this.state.loading ? (
              <div>
                <br />
                <Message
                  header="Loading..."
                  content={
                    "Do hold on! You should be able to see your transaction get processed on Metamask as well."
                  }
                />
              </div>
            ) : (
              <div>
                <br />
                {!!this.state.errorMessage ? (
                  <Message
                    error
                    header="Oops!"
                    content={this.state.errorMessage}
                  />
                ) : (
                  <></>
                )}
              </div>
            )}

            <br />
          </Grid.Column>
          <Grid.Column width={5}>
            {this.props.curManagerAddress == this.props.accounts[0] ? (
              <Link
                as={`/requests/createRequest/${curCampaignAddress}`}
                href={{
                  pathname: `/requests/createRequest/`,
                  query: { curCampaignAddress },
                }}
              >
                <a>
                  <Button secondary>Create a request</Button>
                </a>
              </Link>
            ) : (
              <></>
            )}
          </Grid.Column>
        </Grid>
      </Layout>
    );
  }
}

export default campaignDetails;
