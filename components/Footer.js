import Link from "next/link";
import Styles from "../css/index.scss";
import {
  TransitionablePortal,
  Divider,
  Card,
  Form,
  Modal,
  Icon,
  Responsive,
  Statistic,
  Progress,
  Message,
  Table,
  Dropdown,
  Sticky,
  Ref,
  Flag,
  List,
  Sidebar,
  Rail,
  Header,
  Segment,
  Container,
  Button,
  Menu,
  Grid,
  Image,
  Transition,
} from "semantic-ui-react";

const Footer = ({}) => (
  <Segment
    inverted
    vertical
    style={{ margin: "5em 0em 0em", padding: "3em 0em" }}
  >
    <Grid textAlign="center" divided inverted stackable>
      <Grid.Column width={5}>
        <Header inverted as="h4" content="Main" />
        <List link inverted>
          <Link prefetch href="/">
            <List.Item as="a">Home</List.Item>
          </Link>
          <Link prefetch href="/characters">
            <List.Item as="a">Characters</List.Item>
          </Link>
          <Link prefetch href="/ranking">
            <List.Item as="a">Ranking</List.Item>
          </Link>
          <Link prefetch href="/contact">
            <List.Item as="a">Contact</List.Item>
          </Link>
        </List>
      </Grid.Column>
      <Grid.Column width={5}>
        <Header inverted as="h4" content="How To Use" />
        <List link inverted>
          <Link prefetch href="/about">
            <List.Item as="a">Overview</List.Item>
          </Link>
          <Link prefetch href="/about?section=matchups">
            <List.Item as="a">Matchup Judging</List.Item>
          </Link>
          <Link prefetch href="/about?section=contingency">
            <List.Item as="a">Contingencies</List.Item>
          </Link>
          <Link prefetch href="/about?section=trust">
            <List.Item as="a">Trust</List.Item>
          </Link>
        </List>
      </Grid.Column>
      <Grid.Column width={6}>
        <Header
          inverted
          as="h4"
          content="Join our discord server to stay connected!"
        />
        <Image
          size="medium"
          centered
          target="_blank"
          href="https://discord.gg/rbud5SD"
          src="/static/Discord-Logo+Wordmark-White.png"
        />
      </Grid.Column>
    </Grid>
  </Segment>
    );
  }
}

export default Footer;
