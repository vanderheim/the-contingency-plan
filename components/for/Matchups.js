/* global window */
import React from "react";
import Layout from "../components/Layout";
import { connect } from "react-redux";
import Router from "next/router";
import Link from "next/link";
import _ from "lodash";
import { API } from "../config";
import axios from "axios";
import Moment from "react-moment";
import { charDatabase } from "../utils/charDatabase";
import {
  Message,
  Popup,
  Grid,
  Accordion,
  Dropdown,
  Visibility,
  Label,
  Form,
  Icon,
  List,
  Header,
  Statistic,
  Progress,
  Responsive,
  Item,
  Image,
  Segment,
  Feed,
  Transition,
  Search,
  Input,
  Table,
  Container,
  Divider,
  Ref,
  Menu,
  Sticky,
  Button,
  Loader,
  Dimmer,
} from "semantic-ui-react";
import {
  dateFromObjectId,
  formatName,
  charNameOrUniverse,
  formatInfo,
  formatWeight,
  getJudged,
  judgeRating,
  judgeColors,
  judgeTier
} from "../utils/utilityFunctions";

class Matchups extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: "",
      editting: false,
      submittedNew: false,
      userProfile: null,
      loadingData: false,
      failedSend: false,
      charDatabase: charDatabase,
    };

    this.toggleVote = this.toggleVote.bind(this);
  }

  componentDidMount() {
    this.setState({
      charInfo: this.props.charInfo,
      userProfile: this.props.userProfile || null,
      charTarget: this.props.charTarget,
    });
  }

  toggleEditting = () => {
    this.setState({ editting: true, submittedNew: false });
  };

  toggleVote = (opponent, newWeight) => {
    if (!this.state.editting) return null;

    let newProfile = Object.assign({}, this.state.userProfile);
    let changes = this.state.readyData || [];

    if (
      !_.find(newProfile.charData, {
        target: this.props.charTarget,
        opponent: opponent,
      })
    ) {
      newProfile.charData.push({
        target: this.props.charTarget,
        opponent: opponent,
        weight: newWeight,
      });
      changes = changes.concat({
        target: this.props.charTarget,
        opponent: opponent,
        weight: newWeight,
      });
    } else {
      _.remove(newProfile.charData, {
        target: this.props.charTarget,
        opponent: opponent,
      });
      _.remove(changes, {
        target: this.props.charTarget,
        opponent: opponent,
      });

      newProfile.charData.push({
        target: this.props.charTarget,
        opponent: opponent,
        weight: newWeight,
      });

      changes = changes.concat({
        target: this.props.charTarget,
        opponent: opponent,
        weight: newWeight,
      });
    }

    if (
      !_.find(newProfile.charData, {
        target: opponent,
        opponent: this.props.charTarget,
      })
    ) {
      newProfile.charData.push({
        target: opponent,
        opponent: this.props.charTarget,
        weight: newWeight * -1,
      });

      changes = changes.concat({
        target: opponent,
        opponent: this.props.charTarget,
        weight: newWeight * -1,
      });
    } else {
      _.remove(newProfile.charData, {
        target: opponent,
        opponent: this.props.charTarget,
      });
      _.remove(changes, {
        target: opponent,
        opponent: this.props.charTarget,
      });

      newProfile.charData.push({
        target: opponent,
        opponent: this.props.charTarget,
        weight: newWeight * -1,
      });

      changes = changes.concat({
        target: opponent,
        opponent: this.props.charTarget,
        weight: newWeight * -1,
      });
    }

    this.setState({ userProfile: newProfile, readyData: changes });
  };

  isVoted = (opponent) => {
    if (
      _.find(this.props.userProfile.charData, {
        target: this.props.charTarget,
        opponent: opponent,
      })
    ) {
      return _.find(this.props.userProfile.charData, {
        target: this.props.charTarget,
        opponent: opponent,
      });
    } else {
      return { weight: -100 };
    }
  };

  submitCharData = () => {
    this.setState({
      loadingData: true,
      failedSend: false,
      submittedNew: false,
    });

    axios({
      method: "POST",
      url: `${API}/api/db/updatevotes`,
      headers: {
        authorization: this.props.token,
      },
      data: {
        email: this.props.userProfile.email,
        newUpdated: {
          charData: this.state.readyData,
        },
        targettedChar: this.props.charTarget,
      },
    })
      .then((response) => {
        if (response.data.status !== "success") {
          return this.setState({
            loadingData: false,
            failedSend: true,
            errorMsg: response.data.status,
          });
        }
        this.setState({
          loadingData: false,
          submittedNew: true,
          editting: false,
        });
      })
      .catch((err) => {
        throw new Error(err);
      });
  };

  handleSearchChange = (e, { value }) => {
    this.setState({ value });
  };

  charNameOrUniverse = (char, val) => {
    if (_.includes(char.opponent.toLowerCase(), val.toLowerCase())) {
      return true;
    }

    return false;
  };

  render() {
    return (
      <React.Fragment>
        {this.state.loadingData && !this.state.submittedNew && (
          <Message icon="icon">
            <Icon name="circle notched" loading="loading" />
            <Message.Content>
              <Message.Header>Submitting matchup data now...</Message.Header>
              Your matchup data is being submitted to the server to be saved.
            </Message.Content>
          </Message>
        )}

        {this.state.submittedNew && (
          <Message positive="positive" icon="icon">
            <Icon name="download" />
            <Message.Content>
              <Message.Header>Thank you for your contribution.</Message.Header>
              Your data has been submitted to the system and saved to your
              profile. Remember that matchup totals are calculated every hour!
            </Message.Content>
          </Message>
        )}

        {this.state.failedSend && (
          <Message warning="warning" icon="icon">
            <Icon name="wheelchair" />
            <Message.Content>
              <Message.Header>
                Data Submission failed. Error Code: {this.state.errorMsg}
              </Message.Header>
              An error occurred on the server. Please try again later or contact
              an admin.
            </Message.Content>
          </Message>
        )}

        <Segment>
          <Grid stackable="stackable" columns={2}>
            <Grid.Column verticalAlign="middle">
              {!this.props.isAuthenticated && (
                <Link prefetch="prefetch" as={`/signin`} href={`/signin`}>
                  <Button primary="primary">Enable Matchup Judging</Button>
                </Link>
              )}
              {this.props.isAuthenticated && this.state.editting === false && (
                <Button primary="primary" onClick={this.toggleEditting}>
                  Enable Matchup Judging
                </Button>
              )}
              {this.props.isAuthenticated && this.state.editting === true && (
                <Button color="green" onClick={this.submitCharData}>
                  Submit Data
                </Button>
              )}
            </Grid.Column>
            <Grid.Column textAlign="right">
              {this.state.activeTab === "matchups" && (
                <Input
                  icon="search"
                  placeholder="Search for a character..."
                  value={this.state.value}
                  onChange={this.handleSearchChange}
                />
              )}
            </Grid.Column>
          </Grid>
          <Table
            size="large"
            padded="padded"
            unstackable="unstackable"
            textAlign="center"
            basic="very"
            celled="celled"
          >
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Opponent</Table.HeaderCell>

                <Table.HeaderCell
                  style={{
                    color: "red",
                  }}
                >
                  -2
                </Table.HeaderCell>
                <Table.HeaderCell
                  style={{
                    color: "orange",
                  }}
                >
                  -1
                </Table.HeaderCell>
                <Table.HeaderCell
                  style={{
                    color: "blue",
                  }}
                >
                  0
                </Table.HeaderCell>
                <Table.HeaderCell
                  style={{
                    color: "teal",
                  }}
                >
                  +1
                </Table.HeaderCell>
                <Table.HeaderCell
                  style={{
                    color: "green",
                  }}
                >
                  +2
                </Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {this.props.charInfo.matchups.map(
                (char) =>
                  this.charNameOrUniverse(char, this.state.value) &&
                  this.props.charTarget !== char.opponent && (
                    <React.Fragment key={char.opponent}>
                      <Table.Row>
                        <Table.Cell collapsing="collapsing">
                          <Header as="h4" image="image">
                            <Image
                              src={"/static/heads/" + char.opponent + ".png"}
                              size="small"
                            />
                            <Header.Content>
                              <Link
                                prefetch="prefetch"
                                as={`/for/${char.opponent}`}
                                href={`/for?target=${char.opponent}`}
                              >
                                <a>{this.formatName(char.opponent)}</a>
                              </Link>
                            </Header.Content>
                          </Header>
                        </Table.Cell>

                        {this.props.userProfile !== null && (
                          <React.Fragment>
                            <Table.Cell
                              selectable={this.state.editting}
                              onClick={() =>
                                this.toggleVote(
                                  char.opponent,
                                  char.votes[0].weight
                                )
                              }
                            >
                              <Header as="h5" color="red">
                                {char.votes[0].count}{" "}
                                {this.props.userProfile !== null &&
                                  this.isVoted(char.opponent).weight ===
                                    char.votes[0].weight && (
                                    <Icon
                                      name="checkmark"
                                      size="mini"
                                      color="green"
                                    />
                                  )}
                              </Header>
                            </Table.Cell>
                            <Table.Cell
                              selectable={this.state.editting}
                              onClick={() =>
                                this.toggleVote(
                                  char.opponent,
                                  char.votes[1].weight
                                )
                              }
                            >
                              <Header as="h5" color="yellow">
                                {char.votes[1].count}{" "}
                                {this.props.userProfile !== null &&
                                  this.isVoted(char.opponent).weight ===
                                    char.votes[1].weight && (
                                    <Icon
                                      name="checkmark"
                                      size="mini"
                                      color="green"
                                    />
                                  )}
                              </Header>
                            </Table.Cell>
                            <Table.Cell
                              selectable={this.state.editting}
                              onClick={() =>
                                this.toggleVote(
                                  char.opponent,
                                  char.votes[2].weight
                                )
                              }
                            >
                              <Header as="h5" color="blue">
                                {char.votes[2].count}{" "}
                                {this.props.userProfile !== null &&
                                  this.isVoted(char.opponent).weight ===
                                    char.votes[2].weight && (
                                    <Icon
                                      name="checkmark"
                                      size="mini"
                                      color="green"
                                    />
                                  )}
                              </Header>
                            </Table.Cell>
                            <Table.Cell
                              selectable={this.state.editting}
                              onClick={() =>
                                this.toggleVote(
                                  char.opponent,
                                  char.votes[3].weight
                                )
                              }
                            >
                              <Header as="h5" color="teal">
                                {char.votes[3].count}{" "}
                                {this.props.userProfile !== null &&
                                  this.isVoted(char.opponent).weight ===
                                    char.votes[3].weight && (
                                    <Icon
                                      name="checkmark"
                                      size="mini"
                                      color="green"
                                    />
                                  )}
                              </Header>
                            </Table.Cell>
                            <Table.Cell
                              selectable={this.state.editting}
                              onClick={() =>
                                this.toggleVote(
                                  char.opponent,
                                  char.votes[4].weight
                                )
                              }
                            >
                              <Header as="h5" color="green">
                                {char.votes[4].count}{" "}
                                {this.props.userProfile !== null &&
                                  this.isVoted(char.opponent).weight ===
                                    char.votes[4].weight && (
                                    <Icon
                                      name="checkmark"
                                      size="mini"
                                      color="green"
                                    />
                                  )}
                              </Header>
                            </Table.Cell>
                            <Table.Cell>
                              <Header
                                sub="sub"
                                color={judgeRating(char.difficulty).color}
                              >
                                {judgeRating(char.difficulty).status}
                              </Header>
                            </Table.Cell>
                          </React.Fragment>
                        )}

                        {!this.props.userProfile && (
                          <React.Fragment>
                            <Table.Cell>
                              <Header as="h4" color="red">
                                {char.votes[0].count}{" "}
                              </Header>
                            </Table.Cell>
                            <Table.Cell>
                              <Header as="h4" color="yellow">
                                {char.votes[1].count}{" "}
                              </Header>
                            </Table.Cell>
                            <Table.Cell>
                              <Header as="h4" color="blue">
                                {char.votes[2].count}{" "}
                              </Header>
                            </Table.Cell>
                            <Table.Cell>
                              <Header as="h4" color="teal">
                                {char.votes[3].count}{" "}
                              </Header>
                            </Table.Cell>
                            <Table.Cell>
                              <Header as="h4" color="green">
                                {char.votes[4].count}{" "}
                              </Header>
                            </Table.Cell>
                            <Table.Cell>
                              <Header
                                sub="sub"
                                color={judgeRating(char.difficulty).color}
                              >
                                {judgeRating(char.difficulty).status}
                              </Header>
                            </Table.Cell>
                          </React.Fragment>
                        )}
                      </Table.Row>
                    </React.Fragment>
                  )
              )}
            </Table.Body>
          </Table>
        </Segment>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    isAuthenticated: !!state.authentication.token,
    userProfile: state.user.profile,
    token: state.authentication.token,
  };
}

export default connect(mapStateToProps, {})(Matchups);
