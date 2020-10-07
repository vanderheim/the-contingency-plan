import React from "react";
import { connect } from "react-redux";
import actions from "../redux/actions";
import initialize from "../utils/initialize";
import Link from "next/link";
import { API } from "../config";
import axios from "axios";
import Layout from "../components/Layout";
import {
  Accordion,
  Table,
  Divider,
  Button,
  List,
  Card,
  Menu,
  Image,
  Label,
  Container,
  Segment,
  Form,
  Input,
  Icon,
  Header,
  Message,
  Grid,
  Rail,
} from "semantic-ui-react";

class Verify extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      verifying: false,
      confirmSuccess: { status: "none" },
      passcode: "",
      resent: { status: "none" },
    };
  }

  static async getInitialProps(ctx) {
    initialize(ctx);

    let confirmedStatus = { status: "fail", msg: "" };
    console.log(ctx.query.token);

    let res = await axios.get(`${API}/api/confirmation/` + ctx.query.token);
    // console.log(res.data.characters);
    let resData = await res.data;

    confirmedStatus = resData;

    return { confirmedStatus };
  }

  resendVerify() {
    axios
      .post(`${API}/api/resend`, { email: this.state.email })
      .then((response) => {
        console.log("status", this.state.confirmSuccess, response.data);
        this.setState({ resent: response.data });
      })
      .catch((error) => {});
  }

  handleVerify() {
    axios
      .post(`${API}/api/confirmation`, { token: this.state.passcode })
      .then((response) => {
        if (response.data.status !== "success") {
          console.log("status", this.state.confirmSuccess, response.data);
          this.setState({ confirmSuccess: response.data });
        } else {
          this.props.authenticate(
            { email: this.state.email, password: this.state.password },
            "signin"
          );
        }
      })
      .catch((error) => {});
  }

  render() {
    return (
      <Grid
        textAlign="center"
        style={{ height: "100%" }}
        verticalAlign="middle"
      >
        {this.props.confirmedStatus.status === "fail" ? (
          <Grid.Column style={{ maxWidth: 450 }}>
            <Segment style={{ maxWidth: 450 }}>
              <Header textAlign="center" as="h2" icon>
                <Icon color="red" name="x" />
                Something went wrong.
                <Header.Subheader>
                  {this.state.confirmStatus.msg}
                </Header.Subheader>
              </Header>
            </Segment>
            <Message>
              Need another verification link? <a>Click here.</a>
            </Message>
          </Grid.Column>
        ) : (
          <Grid.Column style={{ maxWidth: 450 }}>
            <Segment style={{ maxWidth: 450 }}>
              <Header textAlign="center" as="h2" icon>
                <Icon color="green" name="checkmark" />
                Registration complete!
                <Header.Subheader>
                  Thanks for verifying your email!{" "}
                  <Link prefetch href="/signin">
                    <a>Click here to login.</a>
                  </Link>
                </Header.Subheader>
              </Header>
            </Segment>
          </Grid.Column>
        )}
      </Grid>
    );
  }
}

export default connect((state) => state, actions)(Verify);
