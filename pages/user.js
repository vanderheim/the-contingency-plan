import React from "react";
import axios from "axios";
import { connect } from "react-redux";
import { API } from "../config";
import initialize from "../utils/initialize";
import { charDatabase } from "../utils/charDatabase";
import _ from "lodash";
import CharacterFeeds from "../components/user/CharacterFeeds";
import CharacterTrusts from "../components/user/CharacterTrusts";
import Profile from "../components/user/Profile";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import dynamic from "next/dynamic"; // (if using Next.js or use own dynamic loader)
const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
} from "draft-js";
import Link from "next/link";
import {
  Table,
  Progress,
  Statistic,
  Button,
  Label,
  Item,
  List,
  Divider,
  Checkbox,
  Card,
  Responsive,
  Modal,
  Feed,
  Visibility,
  Dropdown,
  Image,
  Container,
  Icon,
  Form,
  Input,
  Segment,
  Header,
  Message,
  Grid,
  Menu,
} from "semantic-ui-react";

class User extends React.Component {
  static async getInitialProps(ctx) {
    initialize(ctx);
    const userT = ctx.query.user;

    let res = await axios.get(`${API}/api/userlookup/` + ctx.query.user);
    let userInfo = await res.data;
    let userFeed = userInfo.feeds;

    return { userInfo, userT, userFeed };
  }

  constructor(props) {
    super(props);

    this.state = {
      editing: false,
      selected: "",
      editorState: EditorState.createEmpty(),
      editor: false,
      loadingData: false,
      value: "",
      activeTab: "feed",
    };
  }

  componentDidMount() {
    this.setState({
      editor: true,
      charInfo: formatInfo(this.props.userInfo.charData),
      characters: this.props.userInfo.characters,
      userFeeds: this.props.userFeed,
    });
  }

  addFeeds = async () => {
    this.setState({ loadingFeeds: true });

    let resCont = await axios.get(
      `${API}/api/userfeed/` +
        this.props.userInfo._id +
        "?page=" +
        (this.state.userFeeds.page + 1)
    );
    let newAdds = await resCont.data.docs;

    var joined = this.state.userFeeds.docs.concat(newAdds);

    let newData = Object.assign({}, this.state.userFeeds);
    newData.page = resCont.data.page;
    newData.docs = joined;

    this.setState({ userFeeds: newData, loadingFeeds: false });
  };

  selectCharacter = async (charId) => {
    let resCont = await axios.get(
      `${API}/api/usercharcont/` + this.props.userInfo._id + "?charid=" + charId
    );

    let newAdds = await resCont.data;

    let charData = formatSingle(charId, this.props.userInfo.charData);

    this.setState({
      activeTab: "single",
      selectedChar: charData,
      selectedConts: newAdds,
    });
  };

  handleSearchChange = (e, { value }) => {
    this.setState({ value });
  };

  setTab = (e, { value }) => {
    this.setState({ activeTab: value });
  };

  addTrust(selected) {
    console.log(this.props.userInfo._id, this.props.userProfo._id, selected);
    axios({
      method: "POST",
      url: `${API}/api/usertrust`,
      headers: {
        authorization: this.props.token,
      },
      data: {
        targetId: this.props.userInfo._id,
        submittingId: this.props.userProfo._id,
        selectedCharacter: selected,
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

  isActive(charid) {
    if (this.props.userInfo.characters.hasOwnProperty(charid)) {
      console.log(charid, this.props.userInfo.characters[charid]);
      if (this.props.userInfo.characters[charid].active === true) {
        return true;
      }
    } else {
      return false;
    }
  }

  render() {
    const { editorState, editor } = this.state;
    return (
      <Container>
        <Grid stackable="stackable">
          <Grid.Row columns={3}>
            <Grid.Column width={4}>
              <Profile
                editor={this.state.editor}
                editorState={this.state.editorState}
              />
              <br />
            </Grid.Column>
            <Grid.Column width={8}>
              <FeedsCharacter
                setTab={this.setTab}
                handleSearchChange={this.handleSearchChange}
                activeTab={this.state.activeTab}
                addFeeds={this.addFeeds}
                charInfo={this.state.charInfo}
                characters={this.state.characters}
                userFeeds={this.state.userFeeds}
                editor={this.state.editor}
                editorState={this.state.editorState}
                isActive={this.isActive}
                selectCharacter={this.selectCharacter}
              />
            </Grid.Column>
            <Grid.Column width={4}>
              <CharacterTrusts selectCharacter={this.selectCharacter} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: !!state.authentication.token,
  userProfo: state.user.profile,
  token: state.authentication.token,
});

export default connect(mapStateToProps)(User);
