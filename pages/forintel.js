/* global window */
import React from "react";
import { createRef } from "react";
import Layout from "../components/Layout";
import { connect } from "react-redux";
import Router from "next/router";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import _ from "lodash";
import { API } from "../config";
import axios from "axios";
import Moment from "react-moment";
import initialize from "../utils/initialize";
import { charDatabase } from "../utils/charDatabase";
import { stages } from "../utils/stages";
import { dropdownOptions } from "../utils/dropdownOptions";
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
  Responsive,
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
import Contingency from "../components/for/Contingency";
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

class CharPageIntel extends React.Component {
  static async getInitialProps(ctx) {
    initialize(ctx);
    const charTarget = ctx.query.target;

    let res = await axios.get(`${API}/api/char/` + ctx.query.target);
    let charInfo = await res.data.characterData;
    let charCont = [];
    let chartype = null;

    if (ctx.query.type) {
      chartype = ctx.query.type;
    }

    let resCont = await axios.get(`${API}/api/getcont/` + ctx.query.target);

    charCont = await resCont.data;

    return { charInfo, charTarget, chartype, charCont };
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
              <ForNavBar activeTab="intel" />
              <Contingency
                charCont={this.props.charCont}
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

export default connect(mapStateToProps, {})(CharPageIntel);
