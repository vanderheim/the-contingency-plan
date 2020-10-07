/* global window */
import React from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { connect } from "react-redux";
import actions from "../redux/actions";
import Router from "next/router";
import { API } from "../config";
import _ from "lodash";
import initialize from "../utils/initialize";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Editor } from "react-draft-wysiwyg";
import {
  // Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
} from "draft-js";
import { charDatabase } from "../utils/charDatabase";
import {
  Table,
  Button,
  Select,
  List,
  Divider,
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
  Menu,
  Grid,
} from "semantic-ui-react";
const options = [
  {
    key: "US",
    text: "US - United States",
    value: "US",
  },
  {
    key: "CA",
    text: "CA - Canada",
    value: "CA",
  },
  {
    key: "JP",
    text: "JP - Japan",
    value: "JP",
  },
];

class Avatar extends React.Component {
  static async getInitialProps(ctx) {
    initialize(ctx);

    return {};
  }

  constructor(props) {
    super(props);
    //Timer
    this.typingTimeout = null;

    //Event
    this.checkUsername = this.checkUsername.bind(this);
    this.callSearch = this.callSearch.bind(this);
    this.onEditorChange = this.onEditorChange.bind(this);

    this.state = {
      // EditorState.createWithContent(convertFromRaw(JSON.parse(this.props.userProfo.bio)))
      editorState: EditorState.createWithContent(
        convertFromRaw(JSON.parse(this.props.userProfo.bio))
      ),
      editor: false,
      loadingData: false,
      loadingUsername: false,
      submittedNew: false,
      nopeDone: null,
      nope: false,
      spaces: false,
      checked: false,
      selectedFile: null,
      description: "",
      displayName: this.props.userProfo.displayName,
      file: this.props.userProfo.avatar.url || null,
      email: this.props.userProfo.email,
      username: this.props.userProfo.username,
      password: null,
      region: this.props.userProfo.region,
      characters: this.props.userProfo.characters,
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

      // characters:
      characters: this.props.userProfo.characters,
    };
  }

  onEditorChange = (editorState) => this.setState({ editorState });

  componentWillMount() {}

  componentDidMount() {
    this.setState({ editor: true });
  }

  toggleVote = () => {
    let newProfile = Object.assign({}, this.props.userProfo.characters);

    if (newProfile.chararacters[charTarget] === true) {
      newProfile.chararacters[charTarget] = false;
    } else {
      newProfile.chararacters[charTarget] = true;
    }

    this.setState({ characters: newProfile });
  };

  toggleCheckBox() {
    this.setState({ checked: !this.state.checked });
  }

  submitCharData(e) {
    e.preventDefault();

    this.setState({ loadingData: true, erroredSignup: null });

    axios({
      method: "POST",
      url: `${API}/api/profile/charUpdate`,
      headers: { authorization: this.props.token },
      data: {
        email: this.props.userProfo.email,
        newUpdated: {
          // image: this.state.selectedFile,
          username: this.state.username,
          password: this.state.password,
          region: this.state.region,
          displayName: this.state.displayName,
          bio: JSON.stringify(
            convertToRaw(this.state.editorState.getCurrentContent())
          ),
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
          this.setState({ loadingData: false, submittedNew: true });
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
          pathname: "/u/" + this.props.userProfo.username,
        });
      })
      .catch((error) => {});
  };

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
      data: { username: this.state.username },
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
    const { editorState, editor } = this.state;

    return (
      <Segment>
        <Image
          centered
          bordered
          src={this.state.file}
          style={{ borderRadius: "50%", height: 200, width: 200 }}
        />
        <Divider hidden />
        <Form onSubmit={this.fileChangedHandler} enctype="multipart/form-data">
          <Form.Field>
            <input type="file" name="image" onChange={this.fileChanged} />
          </Form.Field>
          <Button fluid positive type="submit">
            Save Profile Picture
          </Button>
        </Form>
        <Message warning>
          Max Resolution: 200x200, Accepted Filetypes: JPG, PNG, GIF
        </Message>
      </Segment>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: !!state.authentication.token,
  userProfo: state.user.profile,
  token: state.authentication.token,
});

export default connect(mapStateToProps)(Avatar);
