import React from "react";
import { connect } from "react-redux";
import actions from "../redux/actions";
import initialize from "../utils/initialize";
import Link from "next/link";
import { API } from "../config";
import axios from "axios";
import Router from "next/router";
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

class ResetPass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      status: false,
    };
  }

  static async getInitialProps(ctx) {
    initialize(ctx);

    let recoveredInfo = {
      status: "fail",
      msg: "",
    };

    let res = await axios.get(`${API}/api/resetpass/` + ctx.query.token);
    let resData = await res.data;

    recoveredInfo = resData;

    return { recoveredInfo };
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

  resetPass(e) {
    e.preventDefault();

    axios({
      method: "POST",
      url: `${API}/api/resetpass`,
      data: {
        _id: this.props.recoveredInfo._id,
        newUpdated: {
          password: this.state.password,
        },
      },
    })
      .then((response) => {
        if (response.data.error !== null) {
          this.setState({ status: false });
        } else {
          Router.push({ pathname: "/signin" });
        }
      })
      .catch((err) => {
        console.log("err", err);
        throw new Error(err);
      });
  }

  render() {
    return (
      <Grid
        textAlign="center"
        style={{
          height: "100%",
        }}
        verticalAlign="middle"
      >
        {this.props.recoveredInfo.status === "fail" ? (
          <Grid.Column
            style={{
              maxWidth: 450,
            }}
          >
            <Segment
              style={{
                maxWidth: 450,
              }}
            >
              <Header textAlign="center" as="h2" icon="icon">
                <Icon color="red" name="x" />
                Something went wrong.
                <Header.Subheader>
                  {this.props.recoveredInfo.msg}
                </Header.Subheader>
              </Header>
            </Segment>
          </Grid.Column>
        ) : (
          <Grid.Column
            style={{
              maxWidth: 450,
            }}
          >
            <Segment
              style={{
                maxWidth: 450,
              }}
            >
              <Header textAlign="center" as="h2" icon="icon">
                <Icon color="green" name="checkmark" />
                Password reset confirmed.
                <Header.Subheader>
                  Enter your new password below.
                </Header.Subheader>
              </Header>
              <Form onSubmit={this.resetPass.bind(this)}>
                <Form.Field>
                  <Form.Input
                    fluid="fluid"
                    type="password"
                    value={this.state.password}
                    onChange={(e) =>
                      this.setState({ password: e.target.value })
                    }
                  />
                </Form.Field>
                <Button fluid="fluid" positive="positive" type="submit">
                  Save New Password & Login
                </Button>
              </Form>
            </Segment>
          </Grid.Column>
        )}
      </Grid>
    );
  }
}

export default connect((state) => state, actions)(ResetPass);
