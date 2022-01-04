import React, { Component } from "react";
import { Form, Button, Input, Message } from "semantic-ui-react";
import Layout from "../../components/Layout";
import web3 from "../../ethereum/web3";
import { Router } from "../../routes";
import Campaign from "../../ethereum/build/Campaign.json";

let curCampaignAddress;

class RequestCreate extends Component {
  static async getInitialProps(props) {
    curCampaignAddress = props.query.curCampaignAddress;
    return {};
  }

  state = {
    descp: "",
    expenditure: 0,
    vendorAddress: "",
    errorMessage: "",
    loading: false,
  };

  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({ loading: true, errorMessage: "" });

    try {
      const accounts = await web3.eth.getAccounts();

      // console.log("Cur address:" + curCampaignAddress);
      const campaignInstance = await new web3.eth.Contract(
        JSON.parse(Campaign.interface),
        curCampaignAddress
      );

      await campaignInstance.methods
        .createRequest(
          this.state.descp,
          this.state.expenditure,
          this.state.vendorAddress
        )
        .send({ from: accounts[0] });

      Router.pushRoute("/");
      //   Router.pushRoute(`/requests/requestDetails/${curCampaignInstance}`);
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading: false });
  };

  render() {
    return (
      <Layout>
        <h3>Create A Request</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Enter Description</label>
            <Input
              value={this.state.descp}
              onChange={(event) => this.setState({ descp: event.target.value })}
            />
          </Form.Field>
          <Form.Field>
            <label>Enter Expenditure</label>
            <Input
              value={this.state.expenditure}
              onChange={(event) =>
                this.setState({ expenditure: event.target.value })
              }
            />
          </Form.Field>
          <Form.Field>
            <label>Enter Vendor Address</label>
            <Input
              value={this.state.vendorAddress}
              onChange={(event) =>
                this.setState({ vendorAddress: event.target.value })
              }
            />
          </Form.Field>
          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button loading={this.state.loading} primary>
            Create Request!
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default RequestCreate;
