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

class Signin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      wrongInfo: false,
      verifying: false,
      confirmSuccess: { status: "none" },
      passcode: "",
      resent: { status: "none" },
    };
  }

  static async getInitialProps(ctx) {
    initialize(ctx);

    return {};
  }

  resetPassword() {
    this.setState({ wrongInfo: false });

    if (this.state.sentPass === true) {
      return this.setState({ sentPass: true });
    }

    axios
      .post(`${API}/api/requestpassreset/`, { email: this.state.email })
      .then((response) => {
        console.log(response.data.msg);
        // console.log('status', this.state.confirmSuccess, response.data);
        this.setState({ sentPass: true });
      })
      .catch((error) => {});
  }

  resendVerify() {
    this.setState({ notVerified: false });

    axios
      .post(`${API}/api/resend`, { email: this.state.email })
      .then((response) => {
        console.log("status", this.state.confirmSuccess, response.data);
        this.setState({ resent: true });
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

  handleSubmit(e) {
    this.setState({ wrongInfo: false, notVerified: false });

    e.preventDefault();

    axios
      .post(`${API}/api/signin`, {
        email: this.state.email,
        password: this.state.password,
      })
      .then((response) => {
        if (response.data.status === false) {
          return this.setState({ wrongInfo: true });
        }

        if (response.data.status === "unverified") {
          this.setState({ notVerified: true });
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
        {this.state.verifying === false ? (
          <Grid.Column style={{ maxWidth: 450 }}>
            {this.state.wrongInfo === true && (
              <Message error header="Wrong Email/Password">
                The email/password you provided was invalid. Did you forget your
                password?{" "}
                <a
                  style={{ cursor: "pointer" }}
                  onClick={this.resetPassword.bind(this)}
                >
                  Click here to reset it.
                </a>
              </Message>
            )}
            {this.state.sentPass === true && (
              <Message success header="Password Reset Sent">
                Please check your email for the link to reset your password.
              </Message>
            )}
            {this.state.notVerified === true && (
              <Message error header="Email Verification Required">
                It looks like you need to verify your email address. If you need
                to send another verification link,{" "}
                <a
                  style={{ cursor: "pointer" }}
                  onClick={this.resendVerify.bind(this)}
                >
                  click here.
                </a>
              </Message>
            )}
            {this.state.resent === true && (
              <Message success header="Verification Email Sent">
                Please check your email for the verification link to complete
                registration.
              </Message>
            )}
            <Form size="large" onSubmit={this.handleSubmit.bind(this)}>
              <Segment>
                <Header as="h1" textAlign="center">
                  <Icon name="cube" />
                  Login
                </Header>
                <br />
                <Form.Input
                  fluid
                  icon="at"
                  iconPosition="left"
                  type="email"
                  placeholder="EMAIL"
                  value={this.state.email}
                  onChange={(e) => this.setState({ email: e.target.value })}
                />
                <Form.Input
                  fluid
                  icon="lock"
                  placeholder="PASSWORD"
                  iconPosition="left"
                  type="password"
                  value={this.state.password}
                  onChange={(e) => this.setState({ password: e.target.value })}
                />
                <br />
                <Button color="green" fluid size="large">
                  Login
                </Button>
              </Segment>
            </Form>
            <Message>
              Don't have an account?{" "}
              <Link prefetch href="signup">
                <a>Register here.</a>
              </Link>
            </Message>
          </Grid.Column>
        ) : (
          <Grid.Column style={{ maxWidth: 450 }}>
            <Segment style={{ maxWidth: 450 }}>
              <Header textAlign="center" as="h2" icon>
                <Icon name="mail" />
                Email Confirmation Required
                <Header.Subheader>
                  A 4-digit passcode was sent to your email when you registered.
                  Please enter it below to complete registration.
                </Header.Subheader>
              </Header>
              <p style={{ color: "red" }}>
                If you do not see the email, please check your Spam folder.
              </p>
              <Form
                success={this.state.confirmSuccess.status === "success"}
                error={this.state.confirmSuccess.status === "fail"}
                onSubmit={this.handleVerify.bind(this)}
              >
                <Form.Field>
                  <input
                    className="input"
                    type="text"
                    required="required"
                    value={this.state.passcode}
                    onChange={(e) =>
                      this.setState({ passcode: e.target.value })
                    }
                  />
                </Form.Field>

                <Message
                  success
                  header="Verification Complete!"
                  content="Your account has been approved and you are free to login to the site."
                />
                <Message
                  error
                  header="An error occurred."
                  content={this.state.confirmSuccess.msg}
                />
              </Form>
              <p>
                If your passcode has expired,{" "}
                <a
                  style={{ cursor: "pointer" }}
                  onClick={this.resendVerify.bind(this)}
                >
                  {" "}
                  click here to send a new one.
                </a>
              </p>
              {this.state.resent.status === "confirm" && (
                <Message
                  success
                  header="Verification email sent!"
                  content="Please check your email for your new passcode."
                />
              )}
            </Segment>
          </Grid.Column>
        )}
      </Grid>
    );
  }
}

export default connect((state) => state, actions)(Signin);
