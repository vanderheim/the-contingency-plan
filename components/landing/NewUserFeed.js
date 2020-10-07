import { connect } from "react-redux";
import initialize from "../utils/initialize";
import Link from "next/link";
import axios from "axios";
import _ from "lodash";
import Moment from "react-moment";
import { charDatabase } from "../utils/charDatabase";
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

class NewUserFeed extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Segment>
        <Header textAlign="center" sub size="huge">
          NEW USERS
        </Header>
        <Feed>
          {this.props.userFeed.map((userobj) => (
            <Feed.Event>
              <Feed.Label>
                <Link
                  prefetch="prefetch"
                  as={`/u/${userobj.username}`}
                  href={`/user?user=${userobj.username}`}
                >
                  <Image
                    style={{ cursor: "pointer" }}
                    src={userobj.avatar.url}
                  />
                </Link>
              </Feed.Label>
              <Feed.Content>
                <Feed.Summary>
                  <Feed.User>
                    <Link
                      prefetch="prefetch"
                      as={`/u/${userobj.username}`}
                      href={`/user?user=${userobj.username}`}
                    >
                      {userobj.username}
                    </Link>
                  </Feed.User>
                  <Feed.Date>
                    <Moment fromNow>{dateFromObjectId(userobj._id)}</Moment>
                  </Feed.Date>
                </Feed.Summary>
              </Feed.Content>
            </Feed.Event>
          ))}
        </Feed>
      </Segment>
    );
  }
}

export default connect((state) => state)(NewUserFeed);
