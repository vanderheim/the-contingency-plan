import React from "react";
import { createRef } from "react";
import Layout from "../components/Layout";
import { connect } from "react-redux";
import Router from "next/router";
import Link from "next/link";
import _ from "lodash";
import { API } from "../config";
import axios from "axios";
import initialize from "../utils/initialize";
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
  Responsive,
  Sticky,
  Button,
  Loader,
  Dimmer,
} from "semantic-ui-react";
import CharacterInfoBar from "../components/for/CharacterInfoBar";
import ForNavBar from "../components/for/ForNavBar";
import Activity from "../components/for/Activity";
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

class CharPage extends React.Component {
  static async getInitialProps(ctx) {
    initialize(ctx);
    const charTarget = ctx.query.target;

    let res = await axios.get(`${API}/api/char/` + ctx.query.target);

    let charInfo = await res.data.characterData;

    let charFeed = [];
    charFeed = await res.data.characterFeeds;

    return { charInfo, charTarget, charFeed };
  }

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Container text>
        <CharacterInfoBar charInfo={this.props.charInfo} />

        <Grid>
          <Grid.Row>
            <Grid.Column>
              <ForNavBar />
              <Activity
                activeTab="main"
                charFeed={this.props.charFeed}
                charTarget={this.props.charTarget}
                charInfo={this.props.charInfo}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return { userProfile: state.user.profile, token: state.authentication.token };
}

export default connect(mapStateToProps, {})(CharPage);
