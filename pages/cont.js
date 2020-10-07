/* global window */
import React from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { connect } from "react-redux";
import actions from "../redux/actions";
import Router from "next/router";
import Link from "next/link";
import { API } from "../config";
import { stages } from "../utils/stages";
import _ from "lodash";
import initialize from "../utils/initialize";
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
import { charDatabase } from "../utils/charDatabase";
import {
  Table,
  Button,
  Select,
  List,
  Divider,
  Card,
  Label,
  Dropdown,
  Image,
  Container,
  Icon,
  Form,
  Input,
  Segment,
  Header,
  Message,
  Responsive,
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

class Cont extends React.Component {
  static async getInitialProps(ctx) {
    initialize(ctx);

    let contRes = await axios.get(`${API}/api/contlookup/` + ctx.query.cont);
    // console.log(res.data.characters);
    let contData = await contRes.data;

    console.log(contData);
    return { contData };
  }

  constructor(props) {
    super(props);

    this.onEditorChange = this.onEditorChange.bind(this);
    this.addTrust = this.addTrust.bind(this);

    this.state = {
      editorState: EditorState.createWithContent(
        convertFromRaw(JSON.parse(this.props.contData.content))
      ),
      editorStateMobile: EditorState.createWithContent(
        convertFromRaw(JSON.parse(this.props.contData.content))
      ),
      editor: false,
      msg: null,
      editting: false,
      submittedNewTrust: null,
      contData: this.props.contData,
      title: this.props.contData.title,
      selectedStages: this.props.contData.stages,
    };
  }

  onEditorChange = (editorState) => this.setState({ editorState });
  onEditorChangeMobile = (editorStateMobile) =>
    this.setState({ editorStateMobile });

  editSubmitCont = (mobile) => {
    // this.setState({loadingData: true, failedSend: false, submittedNew: false});

    axios({
      method: "POST",
      url: `${API}/api/editcont`,
      headers: {
        authorization: this.props.token,
      },
      data: {
        contId: this.props.contData._id,
        title: this.state.title,
        stages: this.state.selectedStages,
        content:
          mobile === false
            ? JSON.stringify(
                convertToRaw(this.state.editorState.getCurrentContent())
              )
            : JSON.stringify(
                convertToRaw(this.state.editorStateMobile.getCurrentContent())
              ),
      },
    })
      .then((response) => {
        console.log(response);
        if (response.data.status === false) {
          return null;
        } else if (response.data.status === true) {
          this.setState({ editting: false });
        }
      })
      .catch((err) => {
        console.log("err", err);
        throw new Error(err);
      });
  };

  addTrust(selected) {
    axios({
      method: "POST",
      url: `${API}/api/addtrust`,
      headers: {
        authorization: this.props.token,
      },
      data: {
        targetId: this.props.contData._id,
        submittingId: this.props.userProfo._id,
        selectedCharacter: this.props.contData.target,
        creatorId: this.props.contData.creator._id,
        creator: this.props.contData.creator.username,
      },
    }).then((response) => {
      console.log(response.data);
      if (response.data.result === true) {
        if (response.data.msg === "Trust revoked.") {
          var removed = _.without(this.state.contData.trust, selected);
          let newContData = Object.assign({}, this.state.contData);
          newContData.trust = removed;
          this.setState({
            submittedNewTrust: "success",
            msg: response.data.msg,
            contData: newContData,
          });
        }

        if (response.data.msg === "Trust received.") {
          var joined = this.state.contData.trust.concat(selected);
          let newContData = Object.assign({}, this.state.contData);
          newContData.trust = joined;
          this.setState({
            submittedNewTrust: "success",
            msg: response.data.msg,
            contData: newContData,
          });
        }
      } else {
        this.setState({ submittedNewTrust: "fail", msg: response.data.msg });
      }
    });
  }

  componentWillMount() {}

  componentDidMount() {
    this.setState({ editor: true });
  }

  addStage = (value) => {
    if (_.includes(this.state.selectedStages, value)) {
      return null;
    }

    var joined = this.state.selectedStages.concat(value);
    this.setState({ selectedStages: joined });
  };

  editCont = async (value) => {
    this.setState({ editting: !this.state.editting });
    //
    // let resCont = await axios.get(`${API}/api/getcont/` + this.props.charTarget + '?opponent=' + value);
    // // console.log(res.data.characters);
    // let charCont = await resCont.data;
    //
    // this.setState({ charCont: charCont, loadingContingency: false });
  };

  render() {
    const { editorState, editorStateMobile, editor } = this.state;

    return (
      <Container text>
        <Grid>
          <Grid.Row only="mobile">
            <Grid.Column>
              {this.state.submittedNewTrust === "success" && (
                <Message positive="positive" icon="icon">
                  <Icon name="thumbs up" />
                  <Message.Content>
                    <Message.Header>{this.state.msg}</Message.Header>
                    Thank you for your contribution.
                  </Message.Content>
                </Message>
              )}

              {this.state.submittedNewTrust === "fail" && (
                <Message warning="warning" icon="icon">
                  <Icon name="wheelchair" />
                  <Message.Content>
                    <Message.Header>
                      Trust Submission failed. Error Code: {this.state.msg}
                    </Message.Header>
                    An error occurred on the server. Please try again later or
                    contact an admin.
                  </Message.Content>
                </Message>
              )}
              {this.state.editting === true && (
                <Button
                  positive
                  onClick={() => this.editSubmitCont(true).bind(this)}
                  attached="top"
                >
                  SAVE CHANGES
                </Button>
              )}

              <Segment attached>
                <Grid>
                  <Grid.Row columns={2}>
                    <Grid.Column>
                      <Link
                        prefetch="prefetch"
                        as={`/u/${this.props.contData.creator.username}`}
                        href={`/user?user=${this.props.contData.creator.username}`}
                      >
                        <span style={{ cursor: "pointer" }}>
                          <Image
                            avatar="avatar"
                            src={this.props.contData.creator.avatar.url}
                          />
                          {this.props.contData.creator.username}
                        </span>
                      </Link>
                    </Grid.Column>
                    <Grid.Column textAlign="right">
                      {this.props.isAuthenticated ? (
                        <Label
                          color="green"
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            this.addTrust(this.props.userProfo._id)
                          }
                        >
                          TRUST
                          <Label.Detail>
                            {this.state.contData.trust.length}
                          </Label.Detail>
                        </Label>
                      ) : (
                        <Label color="green">
                          TRUST
                          <Label.Detail>
                            {this.state.contData.trust.length}
                          </Label.Detail>
                        </Label>
                      )}
                      {this.props.isAuthenticated &&
                        this.props.userProfo._id ===
                          this.state.contData.creator._id &&
                        !this.state.editting && (
                          <Icon
                            style={{
                              marginLeft: 5,
                              marginRight: -5,
                              cursor: "pointer",
                            }}
                            size="large"
                            name="edit"
                            onClick={this.editCont}
                          />
                        )}

                      {this.props.isAuthenticated &&
                        this.props.userProfo._id ===
                          this.state.contData.creator._id &&
                        this.state.editting && (
                          <Icon
                            color="green"
                            style={{
                              marginLeft: 5,
                              marginRight: -5,
                              cursor: "pointer",
                            }}
                            size="large"
                            name="edit"
                            onClick={this.editCont}
                          />
                        )}
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column>
                      {this.state.editting ? (
                        <Input
                          fluid
                          type="text"
                          value={this.state.title}
                          onChange={(e) =>
                            this.setState({ title: e.target.value })
                          }
                        />
                      ) : (
                        <Header as="h2" textAlign="center">
                          {this.state.title}
                        </Header>
                      )}
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
                <Editor
                  onEditorStateChange={this.onEditorChangeMobile}
                  toolbarHidden={!this.state.editting}
                  editorState={editorStateMobile}
                  readOnly={!this.state.editting}
                  editorStyle={{
                    marginTop: 0,
                  }}
                />
                <Divider />
                <Grid centered>
                  <Grid.Row>
                    <Header
                      style={{ marginBottom: -20 }}
                      textAlign="center"
                      sub
                    >
                      RECOMMENDED STAGES
                    </Header>
                  </Grid.Row>
                  <Grid.Row>
                    {this.state.editting ? (
                      <React.Fragment>
                        <Dropdown
                          placeholder="Add a stage..."
                          selection="selection"
                          value={this.state.selectedStage}
                          onChange={(e, data) => this.addStage(data.value)}
                          search="search"
                          options={stages}
                        />
                        <Divider hidden />
                        <Image.Group size="small">
                          {this.state.selectedStages.map((stage) => (
                            <Image
                              bordered
                              onClick={() => this.removeStage(stage)}
                              src={"/static/stages/" + stage + ".png"}
                            ></Image>
                          ))}
                        </Image.Group>
                      </React.Fragment>
                    ) : (
                      <Image.Group size="small">
                        {this.state.selectedStages.map((stage) => (
                          <React.Fragment>
                            <Image
                              bordered
                              src={"/static/stages/" + stage + ".png"}
                            ></Image>
                          </React.Fragment>
                        ))}
                      </Image.Group>
                    )}
                  </Grid.Row>
                </Grid>
              </Segment>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row only="computer">
            <Grid.Column>
              {this.state.submittedNewTrust === "success" && (
                <Message positive="positive" icon="icon">
                  <Icon name="thumbs up" />
                  <Message.Content>
                    <Message.Header>{this.state.msg}</Message.Header>
                    Thank you for your contribution.
                  </Message.Content>
                </Message>
              )}

              {this.state.submittedNewTrust === "fail" && (
                <Message warning="warning" icon="icon">
                  <Icon name="wheelchair" />
                  <Message.Content>
                    <Message.Header>
                      Trust Submission failed. Error Code: {this.state.msg}
                    </Message.Header>
                    An error occurred on the server. Please try again later or
                    contact an admin.
                  </Message.Content>
                </Message>
              )}

              {this.state.editting === true && (
                <Button
                  positive
                  onClick={() => this.editSubmitCont(false).bind(this)}
                  attached="top"
                >
                  SAVE CHANGES
                </Button>
              )}

              <Segment attached>
                <Grid>
                  <Grid.Row columns={3}>
                    <Grid.Column width={4}>
                      <Link
                        prefetch="prefetch"
                        as={`/u/${this.props.contData.creator.username}`}
                        href={`/user?user=${this.props.contData.creator.username}`}
                      >
                        <span style={{ cursor: "pointer" }}>
                          <Image
                            avatar="avatar"
                            src={this.props.contData.creator.avatar.url}
                          />
                          {this.props.contData.creator.username}
                        </span>
                      </Link>
                    </Grid.Column>
                    <Grid.Column width={8}>
                      {this.state.editting ? (
                        <Input
                          fluid
                          type="text"
                          value={this.state.title}
                          onChange={(e) =>
                            this.setState({ title: e.target.value })
                          }
                        />
                      ) : (
                        <Header as="h1" textAlign="center">
                          {this.state.title}
                        </Header>
                      )}
                    </Grid.Column>
                    <Grid.Column width={4} textAlign="right">
                      {this.props.isAuthenticated ? (
                        <Label
                          color="green"
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            this.addTrust(this.props.userProfo._id)
                          }
                        >
                          TRUST
                          <Label.Detail>
                            {this.state.contData.trust.length}
                          </Label.Detail>
                        </Label>
                      ) : (
                        <Label color="green">
                          TRUST
                          <Label.Detail>
                            {this.state.contData.trust.length}
                          </Label.Detail>
                        </Label>
                      )}
                      {this.props.isAuthenticated &&
                        this.props.userProfo._id ===
                          this.state.contData.creator._id &&
                        !this.state.editting && (
                          <Icon
                            style={{
                              marginLeft: 5,
                              marginRight: -5,
                              cursor: "pointer",
                            }}
                            size="large"
                            name="edit"
                            onClick={this.editCont}
                          />
                        )}

                      {this.props.isAuthenticated &&
                        this.props.userProfo._id ===
                          this.state.contData.creator._id &&
                        this.state.editting && (
                          <Icon
                            color="green"
                            style={{
                              marginLeft: 5,
                              marginRight: -5,
                              cursor: "pointer",
                            }}
                            size="large"
                            name="edit"
                            onClick={this.editCont}
                          />
                        )}
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
                <Editor
                  onEditorStateChange={this.onEditorChange}
                  toolbarHidden={!this.state.editting}
                  editorState={editorState}
                  readOnly={!this.state.editting}
                  editorStyle={{
                    marginTop: 0,
                  }}
                />
                <Divider />
                <Grid centered>
                  <Grid.Row>
                    <Header
                      style={{ marginBottom: -20 }}
                      textAlign="center"
                      as="h3"
                    >
                      RECOMMENDED STAGES
                    </Header>
                  </Grid.Row>
                  <Grid.Row>
                    {this.state.editting ? (
                      <React.Fragment>
                        <Dropdown
                          placeholder="Add a stage..."
                          selection="selection"
                          value={this.state.selectedStage}
                          onChange={(e, data) => this.addStage(data.value)}
                          search="search"
                          options={stages}
                        />
                        <Divider hidden />
                        <Image.Group size="small">
                          {this.state.selectedStages.map((stage) => (
                            <Image
                              bordered
                              onClick={() => this.removeStage(stage)}
                              src={"/static/stages/" + stage + ".png"}
                            ></Image>
                          ))}
                        </Image.Group>
                      </React.Fragment>
                    ) : (
                      <Image.Group size="medium">
                        {this.state.selectedStages.map((stage) => (
                          <React.Fragment>
                            <Image
                              bordered
                              src={"/static/stages/" + stage + ".png"}
                            ></Image>
                          </React.Fragment>
                        ))}
                      </Image.Group>
                    )}
                  </Grid.Row>
                </Grid>
              </Segment>
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

export default connect(mapStateToProps)(Cont);
