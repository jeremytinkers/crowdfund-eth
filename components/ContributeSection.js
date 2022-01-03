import { useState } from "react";
import { Form, Input, Button , Message } from "semantic-ui-react";
import Campaign from "../ethereum/build/Campaign.json";
import web3 from "../ethereum/web3";
import { Router } from "../routes";

export default function ContributeSection(props) {
  const [amt, setAmt] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    console.log("amt" + amt);
    setAmt(e.target.value);
  }

  async function submitContribution() {
    //submit the amt entered

    setLoading(true);

    const accounts = await web3.eth.getAccounts();
    const campaignInstance = await new web3.eth.Contract(
      JSON.parse(Campaign.interface),
      props.address
    );

    try {
      await campaignInstance.methods
        .contribute()
        .send({ from: accounts[0], value: amt });
      // Router.replacePath(`campaigns/`)
    } catch (error) {
      console.log(error.message);
      setErrorMsg(error.message);
    }

    setLoading(false);
  }

  return (
    <Form error={!!errorMsg}>
      <Form.Field>
        <label>Enter Contribution</label>
        <Input
          label="wei"
          labelPosition="right"
          type="number"
          onChange={handleChange}
        />
      </Form.Field>
      <Message error header="Ayyo!" content={errorMsg} />
      <Button loading={loading} primary onClick={submitContribution}>
        Contribute
      </Button>
    </Form>
  );
}
