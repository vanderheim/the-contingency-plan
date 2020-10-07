/* global window */
import React from "react";
import { createRef } from "react";
import Layout from "../components/Layout";
import { connect } from "react-redux";
import Router from "next/router";
import Link from "next/link";
import _ from "lodash";
import { API } from "../config";
import axios from "axios";
import Moment from "react-moment";
import initialize from "../utils/initialize";
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
  Responsive,
  Icon,
  List,
  Header,
  Statistic,
  Progress,
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

class Players extends React.Component {
  static async getInitialProps(ctx) {
    initialize(ctx);
    let playersData = [];

    playersData = await res.data.characterPlayers;

    return { playersData };
  }

  constructor(props) {
    super(props);

    this.state = {
      playersData: null,
    };
  }

  componentDidMount() {
    this.setState({
      playersData: this.props.playersData,
    });
  }

  addPlayers = async () => {
    let resCont = await axios.get(
      `${API}/api/playerslookup/` +
        this.props.charTarget +
        "?page=" +
        (this.state.playersData.page + 1)
    );

    let resPlayers = await resCont.data.docs;

    var joined = this.state.playersData.docs.concat(resPlayers);

    let newData = Object.assign({}, this.state.playersData);
    newData.page = resCont.data.page;
    newData.docs = joined;

    this.setState({ playersData: newData });
  };

  render() {
    const { editorState, editor } = this.state;

    return (
      <React.Fragment>
        {!this.state.playersData.docs.length && (
          <Segment>
            <Header textAlign="center">
              No players found for this character.
              <Header.Subheader>
                You can add this character to your roster by visiting your
                profile.
              </Header.Subheader>
            </Header>
          </Segment>
        )}
        {this.state.playersData.docs.length > 0 && (
          <Segment>
            <Table
              textAlign="center"
              unstackable="unstackable"
              basic="very"
              celled="celled"
            >
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Player</Table.HeaderCell>
                  <Table.HeaderCell>Matchups Progress</Table.HeaderCell>
                  <Table.HeaderCell>Trust</Table.HeaderCell>
                  <Table.HeaderCell>Join Date</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Visibility
                as="tbody"
                continuous={true}
                onBottomVisible={this.addPlayers.bind(this)}
              >
                {this.state.playersData.docs.map((player) => (
                  <React.Fragment key={player._id}>
                    <Table.Row>
                      <Table.Cell>
                        <Header as="h4" image="image">
                          <Image src={player.avatar.url} circular="circular" />
                          <Header.Content>
                            <Link
                              prefetch="prefetch"
                              as={`/u/${player.username}`}
                              href={`/user?user=${player.username}`}
                            >
                              <a>{player.username}</a>
                            </Link>
                          </Header.Content>
                        </Header>
                      </Table.Cell>

                      <Table.Cell>
                        {player.hasOwnProperty("charData") ? (
                          <Progress
                            percent={
                              (getJudged(
                                this.props.charTarget,
                                player.charData
                              ) /
                                75) *
                              100
                            }
                            indicating="indicating"
                          >
                            <span>
                              {getJudged(
                                this.props.charTarget,
                                player.charData
                              )}{" "}
                              COMPLETED
                            </span>
                          </Progress>
                        ) : null}
                      </Table.Cell>

                      <Table.Cell textAlign="center">
                        <Header color="green">
                          {player.characters[this.props.charTarget].trust
                            ? player.characters[this.props.charTarget].trust
                            : 0}
                        </Header>
                      </Table.Cell>

                      <Table.Cell>
                        <Moment format="MMM Do, YYYY">
                          {dateFromObjectId(player._id)}
                        </Moment>
                      </Table.Cell>
                    </Table.Row>
                  </React.Fragment>
                ))}
              </Visibility>
            </Table>
          </Segment>
        )}
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return { userProfile: state.user.profile, token: state.authentication.token };
}

export default connect(mapStateToProps, {})(CharPagePlayers);
