import React from "react";
import { connect } from "react-redux";
import actions from "../redux/actions";
import initialize from "../utils/initialize";
import Layout from "../components/Layout";
import axios from "axios";
import { API } from "../config";
import { charDatabase } from "../utils/charDatabase";
import "../css/index.scss";
import _ from "lodash";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import dynamic from "next/dynamic"; // (if using Next.js or use own dynamic loader)
const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);
import {
  // Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
} from "draft-js";

import {
  Table,
  Button,
  List,
  Card,
  Menu,
  Dropdown,
  Image,
  Container,
  Icon,
  Form,
  Input,
  Segment,
  Header,
  Message,
  Checkbox,
  Grid,
  Divider,
  Transition,
} from "semantic-ui-react";

const options = [
  {
    key: "US",
    text: "United States",
    value: "US",
  },
  {
    key: "CA",
    text: "Canada",
    value: "CA",
  },
  {
    key: "EU",
    text: "Europe",
    value: "EU",
  },
  {
    key: "JP",
    text: "Japan",
    value: "JP",
  },
  {
    key: "OTHER",
    text: "Other",
    value: "OTHER",
  },
];

class Signup extends React.Component {
  static async getInitialProps(ctx) {
    initialize(ctx);

    return {};
  }

  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      editor: false,
      email: "",
      password: "",
      username: "",
      region: "",
      loadingUsername: false,
      nopeDone: null,
      nope: false,
      spaces: false,
      checked: false,
      selectingCharacters: false,
      charDatabase: charDatabase,
      marioVisible: false,
      unregisteredChar: null,
      registeredChar: "unchosen",
      erroredSignup: null,
      loadSignUp: false,
      responseMsg: "",
      confirmSuccess: { status: "none" },
      passcode: "",
      confirmpassword: "",
      passwordStatus: true,
      confirmEmail: false,
      characters: {},
    };

    this.onEditorChange = this.onEditorChange.bind(this);
    //Event
    this.checkUsername = this.checkUsername.bind(this);
    this.callSearch = this.callSearch.bind(this);
  }

  onEditorChange = (editorState) => this.setState({ editorState });

  fileChanged = (event) => {
    this.setState({
      file: URL.createObjectURL(event.target.files[0]),
      selectedFile: event.target.files[0],
    });
  };

  fileChangedHandler = (event) => {
    this.setState({ loadingData: true });

    const formData = new FormData();

    formData.append("image", this.state.selectedFile);

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        authorization: this.props.token,
        "Access-Control-Allow-Origin": "*",
      },
    };

    axios
      .post(`${API}/api/profile/avatar`, formData, config)
      .then((response) => {
        this.setState({ loadingData: false, submittedNew: true });
        Router.push({
          pathname: "/user/settings",
        });
      })
      .catch((error) => {});
  };

  handleVerify() {
    axios
      .post(`${API}/api/confirmation`, { token: this.state.passcode })
      .then((response) => {
        console.log("status", this.state.confirmSuccess, response.data);
        this.setState({ confirmSuccess: response.data });
      })
      .catch((error) => {});
  }

  resendVerify() {
    axios
      .post(`${API}/api/resend`, { email: this.state.email })
      .then((response) => {
        console.log("status", this.state.confirmSuccess, response.data);
        this.setState({ confirmSuccess: response.data });
      })
      .catch((error) => {});
  }

  handleSubmit(e) {
    var finishedChars = {};

    this.setState({ loadSignUp: true, erroredSignup: null });

    e.preventDefault();
    axios
      .post(`${API}/api/sintest`, {
        email: this.state.email,
        password: this.state.password,
        username: this.state.username,
        region: this.state.region,
        characters: finishedChars,
      })
      .then((response) => {
        if (response.data.error !== null) {
          this.setState({
            loadSignUp: false,
            erroredSignup: response.data.error,
          });
        } else {
          axios
            .post(`${API}/api/signup`, {
              email: this.state.email,
              password: this.state.password,
              username: this.state.username,
              displayName: this.state.username,
              region: this.state.region,
              ip: this.props.thisIp,
              bio: JSON.stringify(
                convertToRaw(this.state.editorState.getCurrentContent())
              ),
              characters: finishedChars,
            })
            .then((response) => {
              if (response.data.status === "confirm") {
                this.setState({ confirmEmail: true });
              }
            })
            .catch((err) => {
              console.log("err!", err);
            });
        }
      })
      .catch((err) => {
        console.log("err!", err);
      });
  }

  toggleCheckBox() {
    this.setState({
      checked: !this.state.checked,
    });
  }

  registerChar(charid) {
    var objToSet = this.state.characters;

    if (objToSet[charid].active) {
      this.setState({
        unregisteredChar: _.find(this.state.charDatabase, ["id", charid]).name,
        registeredChar: null,
      });
      objToSet[charid].active = false;
    } else {
      this.setState({
        registeredChar: _.find(this.state.charDatabase, ["id", charid]).name,
        unregisteredChar: null,
      });
      objToSet[charid].active = true;
    }

    this.setState({ characters: objToSet });
  }

  checkUsername(e) {
    // Clears the previously set timer.
    clearTimeout(this.typingTimeout);

    // Reset the timer, to make the http call after 475MS (this.callSearch is a method which will call the search API. Don't forget to bind it in constructor.)
    this.typingTimeout = setTimeout(this.callSearch, 475);

    this.setState({ username: e.target.value, nopeDone: null, spaces: false });
  }

  checkPasswords(e) {
    this.setState({ confirmpassword: e.target.value });

    if (this.state.password !== e.target.value) {
      this.setState({ passwordStatus: false });
    } else {
      this.setState({ passwordStatus: true });
    }
  }

  callSearch(e) {
    if (this.state.username == "") {
      this.setState({
        loadingUsername: false,
        nope: true,
        nopeDone: true,
        spaces: true,
      });
    }

    if (this.state.username.indexOf(" ") >= 0) {
      this.setState({
        loadingUsername: false,
        nope: true,
        nopeDone: true,
        spaces: true,
      });
    }

    this.setState({ loadingUsername: true, nopeDone: null, spaces: false });

    axios({
      method: "POST",
      url: `${API}/api/checkusername`,
      data: {
        username: this.state.username,
      },
    }).then((response) => {
      console.log(response.data);
      if (response.data.result === false) {
        console.log("nope");
        this.setState({ loadingUsername: false, nope: true, nopeDone: true });
      } else {
        console.log("ok");
        this.setState({ loadingUsername: false, nope: false, nopeDone: true });
      }
    });
  }

  render() {
    console.log("thisip", this.props.thisIp);
    const { editorState, editor } = this.state;

    return (
      <Container>
        {this.state.confirmEmail === false ? (
          <Grid centered style={{ height: "100%" }} verticalAlign="middle">
            <Grid.Column style={{ maxWidth: 450 }}>
              <Segment style={{ maxWidth: 450 }}>
                <Header as="h1" textAlign="center">
                  <Icon name="cube" />
                  Let's get started.
                </Header>
                <br />
                <Form onSubmit={this.handleSubmit.bind(this)}>
                  <Form.Group widths="equal">
                    <Form.Input
                      fluid
                      label="Email"
                      type="email"
                      value={this.state.email}
                      onChange={(e) => this.setState({ email: e.target.value })}
                    />
                  </Form.Group>

                  <p>
                    <span style={{ color: "red" }}>
                      Please use a valid email, as you will need to confirm it
                      to complete registration.
                    </span>{" "}
                    Your email will be used to login to the site.
                  </p>
                  <Form.Input
                    fluid
                    label="Password"
                    type="password"
                    value={this.state.password}
                    onChange={(e) =>
                      this.setState({ password: e.target.value })
                    }
                  />
                  <Form.Input
                    fluid
                    label="Confirm Password"
                    type="password"
                    value={this.state.confirmpassword}
                    onChange={this.checkPasswords.bind(this)}
                  />

                  {this.state.passwordStatus === false && (
                    <Message negative="negative" icon="icon">
                      <Icon name="exclamation triangle" />
                      <Message.Content>
                        <Message.Header>Passwords do not match.</Message.Header>
                        Please reconfirm your password is correct.
                      </Message.Content>
                    </Message>
                  )}
                  <Form.Field>
                    <label>Username</label>
                    <input
                      className="input"
                      type="text"
                      required="required"
                      value={this.state.username}
                      onChange={this.checkUsername.bind(this)}
                    />
                  </Form.Field>
                  <p>
                    Your username will be how people locate your profile on the
                    site. Usernames can only consist of lowercase letters and
                    numbers with no spaces. You can change your username later
                    if you wish.
                  </p>
                  {this.state.nope && (
                    <Message negative="negative" icon="icon">
                      <Icon name="exclamation triangle" />
                      <Message.Content>
                        <Message.Header>
                          Invalid Username Detected.
                        </Message.Header>
                        It looks like the username you entered is either taken
                        or in an invalid format.
                      </Message.Content>
                    </Message>
                  )}

                  {this.state.nopeDone && !this.state.nope && (
                    <Message positive="positive" icon="icon">
                      <Icon name="check" />
                      <Message.Content>
                        <Message.Header>Username available.</Message.Header>
                        The username you entered is available for use. You
                        profile will be located at:
                        <br />
                        <strong>
                          {"http://thecontingencyplan.net/u/" +
                            this.state.username}
                        </strong>
                      </Message.Content>
                    </Message>
                  )}
                  <Form.Field>
                    <label>Region</label>
                    <Dropdown
                      fluid
                      selection
                      value={this.state.region}
                      onChange={(e, data) =>
                        this.setState({ region: data.value })
                      }
                      options={options}
                    />
                    <p>Please select the region you play in.</p>
                  </Form.Field>
                </Form>
                <Divider hidden />

                <Grid>
                  <Grid.Row columns={1}>
                    <Grid.Column>
                      <Button
                        onClick={this.handleSubmit.bind(this)}
                        positive
                        fluid="fluid"
                      >
                        Register Account
                      </Button>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Segment>

              {this.state.loadSignUp === true && (
                <Message icon>
                  <Icon name="circle notched" loading />
                  <Message.Content>
                    <Message.Header>
                      Registering your account now...
                    </Message.Header>
                    Your account information is being sent to the server to
                    confirm registration. Please wait while we verify your
                    credentials.
                  </Message.Content>
                </Message>
              )}

              {this.state.erroredSignup !== null && (
                <Message error icon>
                  <Icon name="exclamation triangle" />
                  <Message.Content>
                    <Message.Header>
                      ERROR: {this.state.erroredSignup}
                    </Message.Header>
                    Please correct the above errors and resubmit your
                    registration.
                  </Message.Content>
                </Message>
              )}
            </Grid.Column>
          </Grid>
        ) : (
          <Grid centered style={{ height: "100%" }} verticalAlign="middle">
            <Grid.Column style={{ maxWidth: 450 }}>
              <Segment style={{ maxWidth: 450 }}>
                <Header textAlign="center" as="h2" icon>
                  <Icon name="mail" />
                  Email Confirmation Required
                  <Header.Subheader>
                    A verifcation link has been sent to your email. Please check
                    it to confirm your registration.
                  </Header.Subheader>
                </Header>
                <p style={{ color: "red" }}>
                  If you do not see the email, please check your Spam folder.
                </p>
              </Segment>
            </Grid.Column>
          </Grid>
        )}
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  thisIp: state.ip.ip,
});

export default connect(mapStateToProps)(Signup);
