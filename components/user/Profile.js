import React from "react";
import { connect } from "react-redux";
import _ from "lodash";
import Moment from "react-moment";
import Avatar from "../components/addAvatar";
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

class Profile extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { editorState, editor } = this.props;
    return (
      <Segment attached="attached">
        {this.props.isAuthenticated &&
        this.props.userInfo.username === this.props.userProfo.username ? (
          <Modal
            size="mini"
            trigger={
              <Image
                centered="centered"
                style={{
                  cursor: "pointer",
                  borderRadius: "50%",
                  height: 200,
                  width: 200,
                }}
                bordered="bordered"
                src={this.props.userInfo.avatar.url}
              />
            }
          >
            <Avatar />
          </Modal>
        ) : (
          <Image
            centered="centered"
            style={{
              borderRadius: "50%",
              height: 200,
              width: 200,
            }}
            bordered="bordered"
            src={this.props.userInfo.avatar.url}
          />
        )}
        {this.props.isAuthenticated &&
        this.props.userProfo.avatar.url === "/static/contact/blank.png" &&
        this.props.userInfo.username === this.props.userProfo.username ? (
          <Message positive="positive">
            <Message.Header>No avatar found.</Message.Header>Click the picture
            above to upload one.
          </Message>
        ) : null}

        <Header as="h2">
          {this.props.userInfo.displayName}
          <Header.Subheader>/u/{this.props.userInfo.username}</Header.Subheader>
        </Header>
        <Editor
          onEditorStateChange={this.props.onEditorChange}
          toolbarHidden={true}
          editorState={EditorState.createWithContent(
            convertFromRaw(JSON.parse(this.props.userInfo.bio))
          )}
          readOnly={this.props.editing === true ? false : true}
          editorStyle={{
            marginTop: -20,
          }}
        />
        <p>
          <Icon name="world"></Icon>
          {_.find(options, { key: this.props.userInfo.region }).text}
        </p>

        <p>
          <Icon name="calendar alternate outline"></Icon>
          Joined
          <Moment format="MMM Do, YYYY">
            {dateFromObjectId(this.props.userInfo._id)}
          </Moment>
        </p>
      </Segment>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: !!state.authentication.token,
  userProfo: state.user.profile,
  token: state.authentication.token,
});

export default connect(mapStateToProps)(Profile);
