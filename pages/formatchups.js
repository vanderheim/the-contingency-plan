/* global window */
import React from "react";
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
import CharacterInfoBar from "../components/for/CharacterInfoBar";
import ForNavBar from "../components/for/ForNavBar";
import Matchups from "../components/for/Matchups";
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

class CharPageMatchups extends React.Component {
  static async getInitialProps(ctx) {
    initialize(ctx);
    const charTarget = ctx.query.target;

    let res = await axios.get(`${API}/api/char/` + ctx.query.target);
    let charInfo = await res.data.characterData;

    return { charInfo, charTarget };
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
              <ForNavBar activeTab="matchups" />
              <Matchups
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
  return {
    isAuthenticated: !!state.authentication.token,
    userProfile: state.user.profile,
    token: state.authentication.token,
  };
}

export default connect(mapStateToProps, {})(CharPageMatchups);
