import { connect } from "react-redux";
import initialize from "../utils/initialize";
import Link from "next/link";
import axios from "axios";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import dynamic from "next/dynamic"; // (if using Next.js or use own dynamic loader)
const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);
import _ from "lodash";
import Moment from "react-moment";
import { charDatabase } from "../utils/charDatabase";
import { EditorState, RichUtils, convertToRaw, convertFromRaw } from "draft-js";
import { API } from "../config";
import {
  Divider,
  Card,
  Form,
  Modal,
  Icon,
  Statistic,
  Responsive,
  Progress,
  Message,
  Table,
  Dropdown,
  Sticky,
  Ref,
  Flag,
  List,
  Rail,
  Header,
  Segment,
  Container,
  Button,
  Item,
  Menu,
  Grid,
  Image,
  Transition,
  Feed,
  Comment,
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

class RecentNewsFeed extends React.Component {
  constructor(props) {
    super(props);

    // Initializing editor for displaying news.
    this.state = {
      editor: false,
    };
  }

  render() {
    const { editorState, editor } = this.state;
    return (
      <React.Fragment>
        <Segment>
          <Header
            style={{ marginBottom: 3 }}
            textAlign="center"
            sub
            size="huge"
          >
            NEWS & UPDATES
          </Header>
          {!this.props.newsFeed.length ? (
            <React.Fragment>
              <br />
              <Header textAlign="center">
                No activity found...
                <Header.Subheader>No news found.</Header.Subheader>
              </Header>
              <br />
            </React.Fragment>
          ) : (
            <React.Fragment>
              {this.props.newsFeed.map((feed) => (
                <React.Fragment>
                  <Divider horizontal>
                    <Moment format="MMM D, YYYY">{feed.created}</Moment>
                  </Divider>
                  <Editor
                    toolbarHidden="toolbarHidden"
                    editorState={EditorState.createWithContent(
                      convertFromRaw(JSON.parse(feed.content))
                    )}
                    readOnly={true}
                    editorStyle={{
                      marginTop: 0,
                    }}
                  />
                </React.Fragment>
              ))}
            </React.Fragment>
          )}
        </Segment>
      </React.Fragment>
    );
  }
}

export default connect((state) => state)(RecentNewsFeed);
