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

class Settings extends React.Component {
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
            pathname: "/user/settings",
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
          pathname: "/user/settings",
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
      <Container text>
        {this.state.loadingData === true && (
          <Message icon>
            <Icon name="circle notched" loading />
            <Message.Content>
              <Message.Header>
                Updating your account information now...
              </Message.Header>
              Your new account information is being sent to the server. Please
              wait while we verify your credentials.
            </Message.Content>
          </Message>
        )}

        {this.state.erroredSignup !== null && (
          <Message error icon>
            <Icon name="exclamation triangle" />
            <Message.Content>
              <Message.Header>ERROR: {this.state.erroredSignup}</Message.Header>
              Please correct the above errors and resubmit your registration.
            </Message.Content>
          </Message>
        )}
        <Grid container>
          <Grid.Row columns={1}>
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
        </Grid>
        {this.state.selectingCharacters === false ? (
          <Grid container>
            <Grid.Row>
              <Grid.Column>
                <Segment>
                  <Form onSubmit={this.submitCharData.bind(this)}>
                    <Form.Field>
                      <label>
                        <Header as="h3">Username</Header>
                      </label>
                      <input
                        type="text"
                        value={this.state.username}
                        onChange={this.checkUsername.bind(this)}
                      />
                    </Form.Field>
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
                      <label>
                        <Header as="h3">Display Name</Header>
                      </label>
                      <Form.Input
                        fluid
                        type="text"
                        value={this.state.displayName}
                        onChange={(e) =>
                          this.setState({ displayName: e.target.value })
                        }
                      />
                    </Form.Field>
                    <Form.Field>
                      <label>
                        <Header as="h3">Password</Header>
                      </label>
                      <Form.Input
                        fluid
                        type="password"
                        value={this.state.password}
                        onChange={(e) =>
                          this.setState({ password: e.target.value })
                        }
                      />
                    </Form.Field>
                    <Form.Field>
                      <label>
                        <Header as="h3">Region</Header>
                      </label>
                      <Dropdown
                        placeholder={this.props.userProfo.region || null}
                        fluid
                        selection
                        value={this.state.region}
                        onChange={(e, data) =>
                          this.setState({ region: data.value })
                        }
                        options={options}
                      />
                      {/*<Select fluid options={options} onChange={e => this.setState({region: e.target.value})} />*/}
                    </Form.Field>
                  </Form>
                </Segment>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Segment>
                  <label>
                    <Header as="h3">Bio</Header>
                  </label>
                  {editor ? (
                    <Segment basic>
                      <Editor
                        editorState={editorState}
                        editorStyle={{
                          minHeight: 100,
                          marginTop: -10,
                        }}
                        onEditorStateChange={this.onEditorChange}
                      />
                    </Segment>
                  ) : null}
                </Segment>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        ) : (
          <Container>
            <Segment>
              <Segment basic>
                <Grid>
                  <Grid.Row columns={1}>
                    <Grid.Column textAlign="center" verticalAlign="middle">
                      {this.state.registeredChar === "unchosen" && (
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
                      {/*<Image.Group size='mini' centered>
                      {
                        this.state.charDatabase.map(char => (this.state.characters[char.id].active === true && <Image key={char.id} centered src={"/static/heads/" + char.id + ".png"}/>))
                      }
                    </Image.Group>*/}
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
                      bordered
                      size="tiny"
                      src={"/static/profiles/" + char.id + ".png"}
                    />
                  ))}
                </Image.Group>
              </Container>
            </Segment>
          </Container>
        )}
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: !!state.authentication.token,
  userProfo: state.user.profile,
  token: state.authentication.token,
});

export default connect(mapStateToProps)(Settings);
