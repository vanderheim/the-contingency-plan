import { connect } from "react-redux";
import initialize from "../utils/initialize";
import Link from "next/link";
import axios from "axios";
import _ from "lodash";
import Moment from "react-moment";
import { charDatabase } from "../utils/charDatabase";
import { API } from "../config";
import NewUserFeed from "../components/landing/NewUserFeed";
import RecentActivityFeed from "../components/landing/RecentActivityFeed";
import RecentNewsFeed from "../components/landing/RecentNewsFeed";
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

class Index extends React.Component {
  static async getInitialProps(ctx) {
    let res2 = await axios.get(`${API}/api/retrieverecents`);
    let recentFeed = await res2.data.feeds.docs;
    let userFeed = await res2.data.users;

    let res = await axios.get(`${API}/api/news`);
    let newsFeed = await res.data;

    return { recentFeed, newsFeed, userFeed };
  }

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <React.Fragment>
        <Container text>
          <Grid stackable>
            <Grid.Row>
              <Grid.Column>
                <Message icon positive>
                  <Icon name="chat" />
                  <Message.Content>
                    <Message.Header>We have a discord too.</Message.Header>
                    Consider joining it to help grow this community.{" "}
                    <a href="https://discord.gg/rbud5SD" target="_blank">
                      Click here to join.
                    </a>
                  </Message.Content>
                </Message>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Segment>
                  <Header as="h2">What is this website for?</Header>
                  <p>
                    The Contingency Plan is a website where people can save and
                    share their opinions on character interactions (matchups) in
                    Super Smash Brothers Ultimate using a personalized user
                    system.{" "}
                    <Link prefetch href="/about">
                      <a>
                        Click here to read more about how this website works.
                      </a>
                    </Link>
                  </p>
                </Segment>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={2} textAlign="center" centered>
              <Grid.Column width={8}>
                <RecentActivityFeed recentFeed={this.props.recentFeed} />
              </Grid.Column>
              <Grid.Column width={8}>
                <NewUsersFeed userFeed={this.props.userFeed} />
              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <Grid.Column>
                <RecentNewsFeed newsFeed={this.props.newsFeed} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </React.Fragment>
    );
  }
}

export default connect((state) => state)(Index);
