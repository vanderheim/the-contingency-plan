/* global window */
import React from "react";
import { connect } from "react-redux";
import actions from "../redux/actions";
import Link from "next/link";
import {
  Table,
  Button,
  List,
  Card,
  Image,
  Container,
  Segment,
  Header,
  Message,
  Grid,
} from "semantic-ui-react";

class Contact extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Container text>
          <Segment>
            <Header as="h1">
              Have something to say?
              <Header.Subheader>
                If you have any questions, concerns, or suggestions, you can
                find information on the staff of The Contingency Plan below.
              </Header.Subheader>
            </Header>
            <Grid celled="internally">
              <Grid.Row textAlign="center" columns="equal">
                <Grid.Column>
                  <Image
                    centered
                    bordered
                    size="medium"
                    src="static/contact/blank.png"
                  />
                  <Header as="h3">
                    A Poor Shrine Maiden
                    <Header.Subheader>Founder</Header.Subheader>
                  </Header>

                  <p>
                    A poor shrine maiden is the original founder of The
                    Contingency Plan.
                  </p>

                  <List>
                    <List.Item>
                      <Header as="h5">
                        <Image
                          circular
                          src="static/contact/twitter-icon-73.png"
                          avatar
                        />
                        <Link prefetch href="https://twitter.com/reimu_is_poor">
                          @reimu_is_poor
                        </Link>
                      </Header>
                    </List.Item>
                    <List.Item>
                      <Header as="h5">
                        <Image src="static/contact/email-icon-126.png" avatar />
                        poormiko@gmail.com
                      </Header>
                    </List.Item>
                  </List>
                </Grid.Column>
                <Grid.Column>
                  <Image
                    centered
                    bordered
                    size="medium"
                    src="static/contact/blank.png"
                  />

                  <Header as="h3">
                    CosmoVibe
                    <Header.Subheader>Programmer</Header.Subheader>
                  </Header>

                  <p>
                    CosmoVibe creates the algorithms used to calculate power
                    ratings, rankings, and tier classifications.
                  </p>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Segment>
        </Container>
      </React.Fragment>
    );
  }
}

export default connect((state) => state, actions)(Contact);
