/* global window */
import React from "react";
import { connect } from "react-redux";
import Router from "next/router";
import Link from "next/link";
import _ from "lodash";
import Moment from "react-moment";
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
  Responsive,
  Sticky,
  Button,
  Loader,
  Dimmer,
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

class Activity extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      charFeed: this.props.charFeed,
      loadingFeeds: false,
    };
  }

  addFeeds = async () => {
    if (this.state.charFeed.page === this.state.charFeed.pages) {
      return null;
    }

    this.setState({ loadingFeeds: true });

    let resCont = await axios.get(
      `${API}/api/charfeed/` +
        this.props.charTarget +
        "?page=" +
        (this.state.charFeed.page + 1)
    );
    let newAdds = await resCont.data.docs;

    var joined = this.state.charFeed.docs.concat(newAdds);

    let newData = Object.assign({}, this.state.charFeed);
    newData.page = resCont.data.page;
    newData.docs = joined;

    this.setState({ charFeed: newData, loadingFeeds: false });
  };

  render() {
    return (
      <Segment>
        {!this.state.charFeed.docs.length ? (
          <React.Fragment>
            <br />
            <Header textAlign="center">
              No activity found...
              <Header.Subheader>
                Contingencies or matchup data generate activity for this
                character.
              </Header.Subheader>
            </Header>
            <br />
          </React.Fragment>
        ) : (
          <Visibility once={false} onBottomVisible={this.addFeeds.bind(this)}>
            <Feed>
              {this.state.charFeed.docs.map((feed) => (
                <Feed.Event>
                  {feed.type === "TRUST" && (
                    <React.Fragment>
                      <Feed.Label>
                        <Link
                          prefetch="prefetch"
                          as={`/u/${feed.subject.username}`}
                          href={`/user?user=${feed.subject.username}`}
                        >
                          <Image
                            style={{ cursor: "pointer" }}
                            src={feed.subject.avatar.url}
                          />
                        </Link>
                      </Feed.Label>
                      <Feed.Content>
                        <Feed.Date>
                          <Moment fromNow="fromNow">{feed.created}</Moment>
                        </Feed.Date>
                        <Feed.Summary>
                          {feed.subject.username} trusted {feed.target.username}
                          's contingency for {formatName(feed.charname)}.
                        </Feed.Summary>
                        <Feed.Extra>
                          <Link
                            prefetch="prefetch"
                            as={`/c/${feed.slug._id}`}
                            href={`/cont?cont=${feed.slug._id}`}
                          >
                            <Header as="a">
                              <Image
                                src={
                                  "/static/heads/" + feed.slug.opponent + ".png"
                                }
                              />
                              <Header.Content>{feed.slug.title}</Header.Content>
                            </Header>
                          </Link>
                        </Feed.Extra>
                      </Feed.Content>
                    </React.Fragment>
                  )}
                  {feed.type === "CONT" && (
                    <React.Fragment>
                      <Feed.Label>
                        <Link
                          prefetch="prefetch"
                          as={`/u/${feed.subject.username}`}
                          href={`/user?user=${feed.subject.username}`}
                        >
                          <Image
                            style={{ cursor: "pointer" }}
                            src={feed.subject.avatar.url}
                          />
                        </Link>
                      </Feed.Label>
                      <Feed.Content>
                        <Feed.Date>
                          <Moment fromNow="fromNow">{feed.created}</Moment>
                        </Feed.Date>
                        <Feed.Summary>
                          {feed.subject.username} submitted a new contingency
                          for {formatName(feed.charname)}.
                        </Feed.Summary>
                        <Feed.Extra>
                          <Link
                            prefetch="prefetch"
                            as={`/c/${feed.slug._id}`}
                            href={`/cont?cont=${feed.slug._id}`}
                          >
                            <Header as="a">
                              <Image
                                src={
                                  "/static/heads/" + feed.slug.opponent + ".png"
                                }
                              />
                              <Header.Content>{feed.slug.title}</Header.Content>
                            </Header>
                          </Link>
                        </Feed.Extra>
                      </Feed.Content>
                    </React.Fragment>
                  )}
                  {feed.type === "CHARDATA" && (
                    <React.Fragment>
                      <Feed.Label>
                        <Link
                          prefetch="prefetch"
                          as={`/u/${feed.subject.username}`}
                          href={`/user?user=${feed.subject.username}`}
                        >
                          <Image
                            style={{ cursor: "pointer" }}
                            src={feed.subject.avatar.url}
                          />
                        </Link>
                      </Feed.Label>
                      <Feed.Content>
                        <Feed.Date>
                          <Moment fromNow="fromNow">{feed.created}</Moment>
                        </Feed.Date>
                        <Feed.Summary>
                          {feed.subject.username} submitted{" "}
                          {feed.affected.length} new matchup judgments for{" "}
                          {formatName(feed.charname)}.
                        </Feed.Summary>
                      </Feed.Content>
                    </React.Fragment>
                  )}
                </Feed.Event>
              ))}
            </Feed>
          </Visibility>
        )}
      </Segment>
    );
  }
}

export default Activity;
