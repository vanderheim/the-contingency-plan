import React from "react";
import { connect } from "react-redux";
import actions from "../redux/actions";
import Router from "next/router";
import { API } from "../config";
import _ from "lodash";
import initialize from "../utils/initialize";
import { charDatabase } from "../utils/charDatabase";
import {
  Table,
  Button,
  Select,
  List,
  Responsive,
  Divider,
  Card,
  Modal,
  Dropdown,
  Image,
  Container,
  Accordion,
  Icon,
  Form,
  Input,
  Segment,
  Header,
  Message,
  Menu,
  Grid,
} from "semantic-ui-react";

class SettingsChar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      characters: this.props.userProfo.characters,
      selectingCharacters: false,
      charDatabase: charDatabase,
      unregisteredChar: null,
      registeredChar: "unchosen",
    };
  }

  isActive(charid) {
    if (this.state.characters.hasOwnProperty(charid)) {
      if (this.state.characters[charid].active === true) {
        return true;
      }
    } else {
      return false;
    }
  }

  submitCharData(e) {
    e.preventDefault();

    this.setState({ loadingData: true });

    axios({
      method: "POST",
      url: `${API}/api/profile/characters`,
      headers: { authorization: this.props.token },
      data: {
        email: this.props.userProfo.email,
        newUpdated: {
          characters: this.state.characters,
        },
      },
    })
      .then((response) => {
        if (response.data.error !== null) {
          this.setState({
            loadingData: false,
            erroredSignup: response.data.error,
          });
        } else {
          this.setState({ changesSaved: true, registeredChar: "unchosen" });
          Router.push({
            pathname: "/u/" + this.props.userProfo.username,
          });
        }
      })
      .catch((err) => {
        console.log("err", err);
        throw new Error(err);
      });
  }

  registerChar(charid) {
    var objToSet = this.state.characters;

    if (objToSet.hasOwnProperty(charid)) {
      if (objToSet[charid].active) {
        this.setState({
          unregisteredChar: _.find(this.state.charDatabase, ["id", charid])
            .name,
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
    } else {
      this.setState({
        registeredChar: _.find(this.state.charDatabase, ["id", charid]).name,
        unregisteredChar: null,
      });
      objToSet[charid] = { active: true, contingencyTotal: 0, trust: 0 };
    }

    this.setState({ characters: objToSet });
  }

  render() {
    return (
      <Container>
        <Responsive {...Responsive.onlyMobile}>
          <Segment basic>
            <Grid>
              <Grid.Row>
                <Grid.Column>
                  {this.state.changesSaved === true &&
                    this.state.registeredChar === "unchosen" && (
                      <Message positive>
                        <Message.Content>
                          <Message.Header>Changes saved!</Message.Header>
                          Your updated character roster has been saved.
                        </Message.Content>
                      </Message>
                    )}
                  {this.state.registeredChar === "unchosen" &&
                    this.state.changesSaved === false && (
                      <Message>
                        <Message.Content>
                          <Message.Header>
                            Welcome to character select!
                          </Message.Header>
                          You can register characters here to be shown on your
                          profile. Click on any of the characters below to add
                          them to your currently playing roster.
                        </Message.Content>
                      </Message>
                    )}

                  {this.state.registeredChar !== null &&
                    this.state.registeredChar !== "unchosen" && (
                      <Message size="large" positive="positive">
                        <strong>{this.state.registeredChar + " "}</strong>
                        has been added to your character roster.
                      </Message>
                    )}
                  {this.state.unregisteredChar !== null &&
                    this.state.registeredChar !== "unchosen" && (
                      <Message size="large" error="error">
                        <strong>{this.state.unregisteredChar + " "}</strong>
                        has been removed from your character roster.
                      </Message>
                    )}
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column verticalAlign="middle">
                  <Button
                    size="big"
                    fluid
                    onClick={this.submitCharData.bind(this)}
                    positive
                  >
                    SAVE CHANGES
                  </Button>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row centered>
                <Grid.Column>
                  <Image.Group style={{ padding: -5 }}>
                    {this.state.charDatabase.map((char) => (
                      <Image
                        key={char.id}
                        className={
                          this.isActive(char.id) === true
                            ? "charregistered"
                            : "charimg"
                        }
                        centered="centered"
                        value={char.id}
                        onClick={() => this.registerChar(char.id)}
                        size="mini"
                        src={"/static/heads/" + char.id + ".png"}
                      />
                    ))}
                  </Image.Group>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Segment>
        </Responsive>
        <Responsive {...Responsive.onlyComputer}>
          <Segment>
            <Grid container>
              <Grid.Row columns={2}>
                <Grid.Column width={12}>
                  {this.state.changesSaved === true &&
                    this.state.registeredChar === "unchosen" && (
                      <Message positive>
                        <Message.Content>
                          <Message.Header>Changes saved!</Message.Header>
                          Your updated character roster has been saved.
                        </Message.Content>
                      </Message>
                    )}
                  {this.state.registeredChar === "unchosen" &&
                    this.state.changesSaved === false && (
                      <Message>
                        <Message.Content>
                          <Message.Header>
                            Welcome to character select!
                          </Message.Header>
                          You can register characters here to be shown on your
                          profile. Click on any of the characters below to add
                          them to your currently playing roster.
                        </Message.Content>
                      </Message>
                    )}

                  {this.state.registeredChar !== null &&
                    this.state.registeredChar !== "unchosen" && (
                      <Message size="large" positive="positive">
                        <strong>{this.state.registeredChar + " "}</strong>
                        has been added to your character roster.
                      </Message>
                    )}
                  {this.state.unregisteredChar !== null &&
                    this.state.registeredChar !== "unchosen" && (
                      <Message size="large" error="error">
                        <strong>{this.state.unregisteredChar + " "}</strong>
                        has been removed from your character roster.
                      </Message>
                    )}
                </Grid.Column>
                <Grid.Column width={4} verticalAlign="middle">
                  <Button
                    size="big"
                    fluid
                    onClick={this.submitCharData.bind(this)}
                    positive
                  >
                    SAVE CHANGES
                  </Button>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row centered>
                <Image.Group style={{ padding: -5 }}>
                  {this.state.charDatabase.map((char) => (
                    <Image
                      key={char.id}
                      className={
                        this.isActive(char.id) === true
                          ? "charregistered"
                          : "charimg"
                      }
                      centered="centered"
                      value={char.id}
                      onClick={() => this.registerChar(char.id)}
                      bordered
                      size="tiny"
                      src={"/static/profiles/" + char.id + ".png"}
                    />
                  ))}
                </Image.Group>
              </Grid.Row>
            </Grid>
          </Segment>
        </Responsive>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: !!state.authentication.token,
  userProfo: state.user.profile,
  token: state.authentication.token,
});

export default connect(mapStateToProps)(SettingsChar);
