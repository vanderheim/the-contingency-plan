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

import {
  Table,
  Button,
  List,
  Card,
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

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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

      animation: "pulse",
      duration: 500,
      visible: true,
    };

    //Event
    this.checkUsername = this.checkUsername.bind(this);
    this.callSearch = this.callSearch.bind(this);
  }

  static getInitialProps(ctx) {
    initialize(ctx);

    return {};
  }

  handleSubmit(e) {
    var finishedChars = {};

    for (var charK in this.state.characters) {
      if (this.state.characters[charK].active === true) {
        finishedChars[charK] = {
          trust: [],
          active: true,
        };
      }
    }
    console.log(finishedChars);
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
          this.props.authenticate(
            {
              email: this.state.email,
              password: this.state.password,
              username: this.state.username,
              region: this.state.region,
              characters: finishedChars,
            },
            "signup"
          );
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
    return (
      <React.Fragment>
        <Container>
          <Segment>
            <Header dividing="dividing" textAlign="center" as="h2">
              CHARACTER SELECT
            </Header>
            <Segment basic>
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
                    Errors have been found in your user information, please
                    return to the previous form to correct them.
                  </Message.Content>
                </Message>
              )}
              <Grid>
                <Grid.Row columns={3}>
                  <Grid.Column verticalAlign="middle" width={8}>
                    {this.state.registeredChar === "unchosen" && (
                      <Message>
                        <Message.Content>
                          <Message.Header>
                            Welcome to character select.
                          </Message.Header>
                          Click on any of the characters below to add them to
                          your currently playing roster.
                        </Message.Content>
                      </Message>
                    )}
                    <Image.Group size="mini">
                      {this.state.charDatabase.map(
                        (char) =>
                          this.state.characters[char.id].active === true && (
                            <Image
                              key={char.id}
                              centered
                              src={"static/heads/" + char.id + ".png"}
                            />
                          )
                      )}
                    </Image.Group>
                  </Grid.Column>
                  <Grid.Column verticalAlign="middle" width={4}>
                    <Button
                      onClick={(e) =>
                        this.setState({ selectingCharacters: false })
                      }
                      error
                      fluid="fluid"
                    >
                      Return To User Details
                    </Button>
                  </Grid.Column>
                  <Grid.Column verticalAlign="middle" width={4}>
                    <Button
                      type="submit"
                      positive="positive"
                      fluid="fluid"
                      onClick={this.handleSubmit.bind(this)}
                    >
                      Complete Registration
                    </Button>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Segment>

            {this.state.registeredChar !== null &&
              this.state.registeredChar !== "unchosen" && (
                <Message size="large" positive="positive">
                  <strong>{this.state.registeredChar + " "}</strong>
                  has been added to your character roster.
                </Message>
              )}
            {this.state.unregisteredChar !== null && (
              <Message size="large" error="error">
                <strong>{this.state.unregisteredChar + " "}</strong>
                has been removed from your character roster.
              </Message>
            )}
            <Container textAlign="center">
              <Image.Group style={{ padding: -5 }}>
                {this.state.charDatabase.map((char) => (
                  <Image
                    key={char.id}
                    className={
                      this.state.characters[char.id].active === true
                        ? "charregistered"
                        : "charimg"
                    }
                    centered="centered"
                    value={char.id}
                    onClick={() => this.registerChar(char.id)}
                    src={"/static/small/" + char.id + ".png"}
                  />
                ))}
              </Image.Group>
            </Container>
          </Segment>
        </Container>
      </React.Fragment>
    );
  }
}

export default connect((state) => state, actions)(Signup);
