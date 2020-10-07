/* global window */
import React from "react";
import { connect } from "react-redux";
import {
  Label,
  Table,
  Button,
  List,
  Card,
  Image,
  Container,
  Menu,
  Icon,
  Segment,
  Header,
  Message,
  Grid,
  Divider,
  Feed,
} from "semantic-ui-react";

class Tlist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTier: "S",
    };
  }

  changeTier(tier) {
    this.setState({ activeTier: tier });
  }

  render() {
    return (
      <Container text="text">
        <Segment textAlign="center">
          <Divider section="section" hidden="hidden" />
          <Icon name="cog" loading="loading" size="huge" />
          <Header as="h3">
            This page is currently under construction. Please check back later.
          </Header>
          <Divider section="section" hidden="hidden" />
        </Segment>
      </Container>
    );
  }
}

export default connect((state) => state)(Tlist);
