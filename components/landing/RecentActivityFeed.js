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

class RecentActivityFeed extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Segment>
        <Header textAlign="center" sub size="huge">
          RECENT ACTIVITY
        </Header>
        <Feed>
          {this.props.recentFeed.map((feed) => (
            <Feed.Event>
              {feed.type === "TRUST" && (
                <React.Fragment>
                  <Feed.Label>
                    <Link
                      prefetch="prefetch"
                      as={`/c/${feed.slug._id}`}
                      href={`/cont?cont=${feed.slug._id}`}
                    >
                      <Image
                        style={{ cursor: "pointer" }}
                        src={"/static/profiles/" + feed.charname + ".png"}
                      />
                    </Link>
                  </Feed.Label>
                  <Feed.Content>
                    <Feed.Date>
                      <Moment fromNow="fromNow">{feed.created}</Moment>
                    </Feed.Date>
                    <Feed.Summary>
                      <Link
                        prefetch="prefetch"
                        as={`/u/${feed.subject.username}`}
                        href={`/user?user=${feed.subject.username}`}
                      >
                        {feed.subject.username}
                      </Link>{" "}
                      trusted{" "}
                      <Link
                        prefetch="prefetch"
                        as={`/u/${feed.target.username}`}
                        href={`/user?user=${feed.subject.username}`}
                      >
                        {feed.target.username}
                      </Link>
                      's contingency for{" "}
                      <Link
                        prefetch="prefetch"
                        as={`/c/${feed.slug._id}`}
                        href={`/cont?cont=${feed.slug._id}`}
                      >
                        <a>
                          {this.formatName(feed.charname)} against{" "}
                          {this.formatName(feed.slug.opponent)}
                        </a>
                      </Link>
                      .
                    </Feed.Summary>
                  </Feed.Content>
                </React.Fragment>
              )}
              {feed.type === "CONT" && (
                <React.Fragment>
                  <Feed.Label>
                    <Link
                      prefetch="prefetch"
                      as={`/c/${feed.slug._id}`}
                      href={`/cont?cont=${feed.slug._id}`}
                    >
                      <Image
                        style={{ cursor: "pointer" }}
                        src={"/static/profiles/" + feed.charname + ".png"}
                      />
                    </Link>
                  </Feed.Label>
                  <Feed.Content>
                    <Feed.Date>
                      <Moment fromNow="fromNow">{feed.created}</Moment>
                    </Feed.Date>
                    <Feed.Summary>
                      <Link
                        prefetch="prefetch"
                        as={`/u/${feed.subject.username}`}
                        href={`/user?user=${feed.subject.username}`}
                      >
                        {feed.subject.username}
                      </Link>{" "}
                      submitted a new contingency for{" "}
                      <Link
                        prefetch="prefetch"
                        as={`/c/${feed.slug._id}`}
                        href={`/cont?cont=${feed.slug._id}`}
                      >
                        <a>
                          {this.formatName(feed.charname)} against{" "}
                          {this.formatName(feed.slug.opponent)}
                        </a>
                      </Link>
                      .
                    </Feed.Summary>
                  </Feed.Content>
                </React.Fragment>
              )}
              {feed.type === "CHARDATA" && (
                <React.Fragment>
                  <Feed.Label>
                    <Link
                      prefetch
                      as={`/for/${feed.charname}?type=matchups`}
                      href={`/formatchups?target=${feed.charname}&type=matchups`}
                    >
                      <Image
                        style={{ cursor: "pointer" }}
                        src={"/static/profiles/" + feed.charname + ".png"}
                      />
                    </Link>
                  </Feed.Label>
                  <Feed.Content>
                    <Feed.Date>
                      <Moment fromNow="fromNow">{feed.created}</Moment>
                    </Feed.Date>
                    <Feed.Summary>
                      <Link
                        prefetch="prefetch"
                        as={`/u/${feed.subject.username}`}
                        href={`/user?user=${feed.subject.username}`}
                      >
                        {feed.subject.username}
                      </Link>{" "}
                      submitted {feed.affected.length} new matchup judgments for{" "}
                      <Link
                        prefetch
                        as={`/for/${feed.charname}?type=matchups`}
                        href={`/formatchups?target=${feed.charname}&type=matchups`}
                      >
                        <a>{this.formatName(feed.charname)}</a>
                      </Link>
                      .
                    </Feed.Summary>
                  </Feed.Content>
                </React.Fragment>
              )}
            </Feed.Event>
          ))}
        </Feed>
      </Segment>
    );
  }
}

export default connect((state) => state)(RecentActivityFeed);
