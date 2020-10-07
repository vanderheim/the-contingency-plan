import React from "react";
import { connect } from "react-redux";
import Link from "next/link";
import _ from "lodash";
import {
  Grid,
  Label,
  Icon,
  List,
  Header,
  Statistic,
  Progress,
  Item,
  Image,
  Segment,
  Container,
  Menu,
  Button,
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

class CharInfoBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Segment>
        <Grid compact="compact" divided="divided">
          <Grid.Row textAlign="center" only="mobile" columns={1}>
            <Grid.Column>
              <Image
                style={{ marginBottom: 5 }}
                centered="centered"
                src={"/static/slights/" + this.props.charTarget + ".png"}
              />
              <Divider horizontal>
                {
                  _.find(this.state.charDatabase, {
                    id: this.props.charInfo.id,
                  }).name
                }
              </Divider>
              <Label color="red">
                LOSE
                <Label.Detail>{this.props.charInfo.losing}</Label.Detail>
              </Label>
              <Label color="blue">
                EVEN
                <Label.Detail>{this.props.charInfo.even}</Label.Detail>
              </Label>
              <Label color="green">
                WIN
                <Label.Detail>{this.props.charInfo.winning}</Label.Detail>
              </Label>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row only="computer" columns={4}>
            <Grid.Column width={3}>
              <Image
                centered="centered"
                src={"/static/profiles/" + this.props.charTarget + ".png"}
              />
            </Grid.Column>
            <Grid.Column verticalAlign="middle" width={6}>
              <Grid centered="centered">
                <Grid.Row>
                  <Header
                    style={{
                      marginBottom: -20,
                    }}
                    as="h1"
                  >
                    {
                      _.find(this.state.charDatabase, {
                        id: this.props.charInfo.id,
                      }).name
                    }
                    <Header.Subheader>
                      {this.props.charInfo.total} votes submitted.
                    </Header.Subheader>
                  </Header>
                </Grid.Row>
                <Grid.Row>
                  <Label color="red">
                    LOSE
                    <Label.Detail>{this.props.charInfo.losing}</Label.Detail>
                  </Label>
                  <Label color="blue">
                    EVEN
                    <Label.Detail>{this.props.charInfo.even}</Label.Detail>
                  </Label>
                  <Label color="green">
                    WIN
                    <Label.Detail>{this.props.charInfo.winning}</Label.Detail>
                  </Label>
                </Grid.Row>
              </Grid>
            </Grid.Column>
            <Grid.Column verticalAlign="middle" textAlign="center" width={4}>
              <Statistic size="medium">
                <Statistic.Label>POWER RATING</Statistic.Label>
                <Statistic.Value>
                  {this.props.charInfo.total < 1000
                    ? "N/A"
                    : parseFloat(this.props.charInfo.score).toFixed(2)}
                </Statistic.Value>
              </Statistic>
            </Grid.Column>
            <Grid.Column verticalAlign="middle" textAlign="center" width={3}>
              <Statistic size="medium">
                <Statistic.Label>CLASSICATION</Statistic.Label>
                <Statistic.Value>
                  {this.props.charInfo.total < 1000
                    ? "???"
                    : judgeTier(this.props.charInfo.score).tier}
                </Statistic.Value>
              </Statistic>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }
}

export default CharacterInfoBar;
