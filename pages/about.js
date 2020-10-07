/* global window */
import React from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { connect } from "react-redux";
import { API } from "../config";
import initialize from "../utils/initialize";
import actions from "../redux/actions";
import {
  Accordion,
  Table,
  Divider,
  Button,
  List,
  Sticky,
  Ref,
  Card,
  Menu,
  Image,
  Container,
  Segment,
  Header,
  Message,
  Grid,
  Rail,
} from "semantic-ui-react";

class About extends React.Component {
  static async getInitialProps(ctx) {
    initialize(ctx);

    return {};
  }
  constructor(props) {
    super(props);

    this.state = {
      category: "main",
    };
  }

  render() {
    return (
      <React.Fragment>
        <Grid>
          <Grid.Row columns={1}>
            {/*<Grid.Column width={4}>
          <Container>
            <Menu size='large' vertical>
              <Menu.Item active={this.state.category === 'main'} onClick={() => this.setState({category: 'main' })}>OVERVIEW</Menu.Item>
                <Menu.Item active={this.state.category === 'judging'} onClick={() => this.setState({category: 'judging' })}>MATCHUP JUDGING</Menu.Item>
                <Menu.Item active={this.state.category === 'contingencies'} onClick={() => this.setState({category: 'contingencies' })}>CONTINGENCIES</Menu.Item>
                  <Menu.Item active={this.state.category === 'trust'} onClick={() => this.setState({category: 'trust' })}>TRUST</Menu.Item>
                    <Menu.Item active={this.state.category === 'ranking'} onClick={() => this.setState({category: 'ranking' })}>RANKING</Menu.Item>
            </Menu>
          </Container>
        </Grid.Column>*/}
            <Grid.Column>
              {this.state.category === "main" && (
                <Container>
                  <Segment>
                    <Header as="h2">Introduction</Header>
                    <p>
                      The Contingency Plan is a website that allows players of
                      Super Smash Brothers Ultimate to vote on and share their
                      opinions on the many possible character matchups present
                      within the game.
                    </p>

                    <p>
                      The main concept is focused around creating a centralized
                      information source that collects the community's judgments
                      on how advantageous (or disadvantageous) every matchup is,
                      as well as providing a database of helpful tips and
                      insight that players can use to better understand how to
                      play each matchup.
                      <br />
                    </p>
                    <Header as="h2">Matchup Judging</Header>
                    <p>
                      One of the core features of the site is centered around
                      the matchup judging system, which allows users to
                      contribute and share their thoughts on the many matchups
                      in Smash Ultimate by voting on how they see each matchup
                      using a scale of -2 -1 0 +1 +2.
                    </p>

                    <p>
                      View the matchup judging section to learn more about how
                      this system works.
                    </p>

                    <Header as="h2">User Interaction</Header>
                    <p>
                      The Contingency Plan's user system has a number of
                      features that allow players to contribute, track, share,
                      and compare their views on character matchups.
                    </p>

                    <p>Registered users can:</p>

                    <List size="large" bulleted>
                      <List.Item>
                        Judge the quality of matchups for any character
                        utilizing a scale of Disadvantage (-2) to Advantage
                        (+2).
                      </List.Item>
                      <List.Item>
                        Create and share Contingencies: Tips, articles, or even
                        full guides on how to play any matchup in the game.
                      </List.Item>
                      <List.Item>
                        Gain Trust from other users through submitting
                        insightful contingencies.
                      </List.Item>
                      <List.Item>
                        Create a personalized profile that can be used to
                        display their matchup judgments, contingencies, the
                        characters they play, and the Trust they have gained
                        through their contributions.
                      </List.Item>
                    </List>

                    <p>
                      View the Contingencies or Trust sections to learn more
                      about the User system.
                    </p>

                    <Header as="h2">Power Assessment & Ranking</Header>
                    <p>
                      The ranking and power assessment system is an upcoming
                      feature of The Contingency Plan.
                      <br />
                      <br />
                      The main idea of the system revolves around using the
                      results of the judgment system to calculate and assign
                      power ratings to each character by placing them through an
                      algorithm taking different factors into consideration.
                      <br />
                      <br />
                      After assigning ratings to each character, they are then
                      ranked from highest to lowest. The aim of this system is
                      to help provide further information on how powerful each
                      character is perceived to be by the community.
                    </p>

                    <p>
                      You can read more about how the ranking feature works by
                      viewing the Ranking section of this page.
                    </p>
                  </Segment>
                </Container>
              )}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </React.Fragment>
    );
  }
}

export default connect((state) => state)(About);
