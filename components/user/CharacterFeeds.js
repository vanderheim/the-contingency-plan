/* global window */
import React from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { connect } from "react-redux";
import actions from "../redux/actions";
import { API } from "../config";
import initialize from "../utils/initialize";
import { charDatabase } from "../utils/charDatabase";
import _ from "lodash";
import Router from "next/router";
import Moment from "react-moment";
import Link from "next/link";
import {
  Table,
  Progress,
  Statistic,
  Button,
  Label,
  Item,
  List,
  Divider,
  Checkbox,
  Card,
  Responsive,
  Modal,
  Feed,
  Visibility,
  Dropdown,
  Image,
  Container,
  Icon,
  Form,
  Input,
  Segment,
  Header,
  Message,
  Grid,
  Menu,
} from "semantic-ui-react";

class CharacterFeeds extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { editorState, editor } = this.props;
    return (
      <Segment>
        <Menu widths={2} secondary="secondary" pointing="pointing">
          <Menu.Item
            active={this.props.activeTab === "feed"}
            value="feed"
            onClick={this.props.setTab}
            header="header"
          >
            <Header sub="sub" size="huge">
              FEED
            </Header>
          </Menu.Item>
          <Menu.Item
            header="header"
            active={this.props.activeTab === "characters"}
            value="characters"
            onClick={this.props.setTab}
          >
            <Header sub="sub" size="huge">
              CHARACTERS
            </Header>
          </Menu.Item>
        </Menu>

        {!this.props.userFeeds.docs.length && this.props.activeTab === "feed" && (
          <Header textAlign="center">
            No activity found...
            <Header.Subheader>
              There is no activity logged for this user.
            </Header.Subheader>
          </Header>
        )}
        {this.props.activeTab === "feed" &&
          this.props.userFeeds.docs.length > 0 && (
            <Visibility
              once={false}
              onBottomVisible={this.props.addFeeds.bind(this)}
            >
              <Feed size="large">
                {this.props.userFeeds.docs.map((feed) => (
                  <Feed.Event>
                    {feed.type === "CHARDATA" && (
                      <React.Fragment>
                        <Feed.Label>
                          <Image
                            style={{
                              marginLeft: 3,
                            }}
                            src={"/static/heads/" + feed.charname + ".png"}
                          />
                        </Feed.Label>
                        <Feed.Content>
                          <Feed.Date>
                            <Moment fromNow="fromNow">{feed.created}</Moment>
                          </Feed.Date>
                          <Feed.Summary>
                            {feed.subject.username}
                            submitted {feed.affected.length}
                            new matchup judgments for{" "}
                            {this.formatName(feed.charname)}.
                          </Feed.Summary>
                          <Feed.Extra images="images">
                            <div
                              style={{
                                marginTop: 20,
                              }}
                            >
                              {feed.affected.map((char) => (
                                <Image
                                  style={{
                                    maxWidth: 50,
                                    marginRight: 10,
                                  }}
                                  bordered="bordered"
                                  src={
                                    "/static/profiles/" + char.opponent + ".png"
                                  }
                                  label={{
                                    color: judgeColors(char.weight),
                                    content: formatWeight(char.weight),
                                    floating: true,
                                  }}
                                ></Image>
                              ))}
                            </div>
                          </Feed.Extra>
                        </Feed.Content>
                      </React.Fragment>
                    )}

                    {feed.type === "CONT" && (
                      <React.Fragment>
                        <Feed.Label>
                          <Image
                            style={{
                              marginLeft: 3,
                            }}
                            src={"/static/heads/" + feed.charname + ".png"}
                          />
                        </Feed.Label>
                        <Feed.Content>
                          <Feed.Date>
                            <Moment fromNow="fromNow">{feed.created}</Moment>
                          </Feed.Date>
                          <Feed.Summary>
                            {feed.subject.username}
                            submitted a new contingency for{" "}
                            {this.formatName(feed.charname)}.
                          </Feed.Summary>
                          <Feed.Extra>
                            <Link
                              prefetch="prefetch"
                              as={`/c/${feed.slug}`}
                              href={`/cont?cont=${feed.slug}`}
                            >
                              <Header as="a">
                                <Image
                                  bordered="bordered"
                                  src={
                                    "/static/profiles/" + feed.opponent + ".png"
                                  }
                                />
                                <Header.Content>
                                  {feed.title}
                                  <Header.Subheader>
                                    A contingency for fighting against{" "}
                                    {this.formatName(feed.opponent)}
                                  </Header.Subheader>
                                </Header.Content>
                              </Header>
                            </Link>
                          </Feed.Extra>
                        </Feed.Content>
                      </React.Fragment>
                    )}
                  </Feed.Event>
                ))}
              </Feed>
            </Visibility>
          )}
        {this.props.activeTab === "characters" && (
          <Grid>
            <Grid.Row columns={1}>
              <Grid.Column>
                <Input
                  icon="search"
                  fluid="fluid"
                  placeholder="Search for a character..."
                  value={this.props.value}
                  onChange={this.props.handleSearchChange}
                />
              </Grid.Column>
            </Grid.Row>

            <Grid.Row only="computer">
              <Grid.Column>
                <Table
                  basic="very"
                  unstackable="unstackable"
                  textAlign="center"
                  celled="celled"
                >
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Character</Table.HeaderCell>
                      <Table.HeaderCell>Matchups Completed</Table.HeaderCell>
                      <Table.HeaderCell>Trust</Table.HeaderCell>
                      <Table.HeaderCell>Contingencies</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                    {this.props.charInfo.map(
                      (char) =>
                        this.charNameOrUniverse(char, this.props.value) &&
                        this.props.isActive(char.id) === true && (
                          <Table.Row>
                            <Table.Cell verticalAlign="middle">
                              <Header
                                as="h4"
                                style={{
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  this.props.selectCharacter(char.id)
                                }
                                image="image"
                              >
                                <Image
                                  src={"/static/profiles/" + char.id + ".png"}
                                  size="small"
                                />
                                <Header.Content>
                                  {this.formatName(char.id)}
                                </Header.Content>
                              </Header>
                            </Table.Cell>
                            <Table.Cell verticalAlign="middle">
                              <Header sub="sub" textAlign="center" size="huge">
                                {char.judged}
                              </Header>
                            </Table.Cell>
                            <Table.Cell verticalAlign="middle">
                              <Header sub="sub" textAlign="center" size="huge">
                                {this.props.userInfo.characters[char.id].trust
                                  ? this.props.userInfo.characters[char.id]
                                      .trust
                                  : 0}
                              </Header>
                            </Table.Cell>
                            <Table.Cell verticalAlign="middle">
                              <Header sub="sub" textAlign="center" size="huge">
                                {this.props.userInfo.characters[char.id]
                                  .contingencyTotal
                                  ? this.props.userInfo.characters[char.id]
                                      .contingencyTotal
                                  : 0}
                              </Header>
                            </Table.Cell>
                          </Table.Row>
                        )
                    )}
                  </Table.Body>
                </Table>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row only="mobile">
              <Grid.Column>
                <Grid>
                  {this.props.charInfo.map(
                    (char) =>
                      this.charNameOrUniverse(char, this.props.value) &&
                      this.props.isActive(char.id) === true && (
                        <Grid.Row>
                          <Grid.Column>
                            <Image
                              onClick={() =>
                                this.props.selectCharacter(char.id)
                              }
                              src={"/static/slights/" + char.id + ".png"}
                            />
                          </Grid.Column>
                        </Grid.Row>
                      )
                  )}
                </Grid>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row only="mobile">
              <Grid.Column>
                {this.props.isAuthenticated &&
                this.props.userInfo.username ===
                  this.props.userProfo.username ? (
                  <Modal
                    trigger={
                      <Button positive fluid>
                        {" "}
                        ADD CHARACTERS
                      </Button>
                    }
                  >
                    <SettingsChar />
                  </Modal>
                ) : null}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        )}

        {this.props.activeTab === "single" && (
          <Grid>
            <Grid.Row columns={1}>
              <Grid.Column verticalAlign="middle">
                <Image
                  bordered="bordered"
                  centered="centered"
                  src={
                    "/static/slights/" + this.props.selectedChar.name + ".png"
                  }
                />
                <Header textAlign="center" as="h1">
                  {this.formatName(this.props.selectedChar.name)}
                  <Header.Subheader>
                    {this.props.selectedChar.total}
                    matchups completed.
                    <span color="green">
                      {this.props.userInfo.characters[
                        this.props.selectedChar.name
                      ].trustCount
                        ? this.props.userInfo.characters[
                            this.props.selectedChar.name
                          ].trustCount
                        : 0}
                    </span>
                    trust earned.
                  </Header.Subheader>
                </Header>
                <Progress
                  percent={(this.props.selectedChar.total / 75) * 100}
                  indicating="indicating"
                >
                  <Label
                    style={{
                      marginTop: 4,
                    }}
                    size="medium"
                    color="green"
                  >
                    WIN
                    <Label.Detail>
                      {this.props.selectedChar.winning}
                    </Label.Detail>
                  </Label>
                  <Label
                    style={{
                      marginTop: 4,
                    }}
                    size="medium"
                    color="blue"
                  >
                    EVEN
                    <Label.Detail>
                      {this.props.selectedChar.evenmatch}
                    </Label.Detail>
                  </Label>
                  <Label
                    style={{
                      marginTop: 4,
                    }}
                    size="medium"
                    color="red"
                  >
                    LOSE
                    <Label.Detail>
                      {this.props.selectedChar.losing}
                    </Label.Detail>
                  </Label>
                </Progress>
              </Grid.Column>
            </Grid.Row>

            <Grid.Row columns={1}>
              <Grid.Column>
                <Header dividing="dividing" sub="sub" size="huge">
                  MATCHUP DATA
                </Header>
                <Table basic="very" unstackable="unstackable" celled="celled">
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell
                        verticalAlign="middle"
                        color="green"
                        collapsing="collapsing"
                      >
                        <Header textAlign="center" color="green">
                          +2
                        </Header>
                      </Table.Cell>
                      <Table.Cell verticalAlign="middle">
                        <Image.Group
                          style={{
                            padding: -5,
                          }}
                        >
                          {this.props.selectedChar.highwin.map((char) => (
                            <Image
                              key={char}
                              bordered="bordered"
                              style={{
                                maxWidth: 50,
                                marginLeft: -2,
                              }}
                              src={"/static/profiles/" + char + ".png"}
                            />
                          ))}
                        </Image.Group>
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell color="green" collapsing="collapsing">
                        <Header textAlign="center" color="teal">
                          +1
                        </Header>
                      </Table.Cell>
                      <Table.Cell>
                        <Image.Group
                          style={{
                            padding: -5,
                          }}
                        >
                          {this.props.selectedChar.win.map((char) => (
                            <Image
                              key={char}
                              bordered="bordered"
                              style={{
                                maxWidth: 50,
                                marginLeft: -2,
                              }}
                              src={"/static/profiles/" + char + ".png"}
                            />
                          ))}
                        </Image.Group>
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell color="green" collapsing="collapsing">
                        <Header textAlign="center" color="blue">
                          0
                        </Header>
                      </Table.Cell>
                      <Table.Cell>
                        <Image.Group
                          style={{
                            padding: -5,
                          }}
                        >
                          {this.props.selectedChar.even.map((char) => (
                            <Image
                              key={char}
                              bordered="bordered"
                              style={{
                                maxWidth: 50,
                                marginLeft: -2,
                              }}
                              src={"/static/profiles/" + char + ".png"}
                            />
                          ))}
                        </Image.Group>
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell color="green" collapsing="collapsing">
                        <Header textAlign="center" color="yellow">
                          -1
                        </Header>
                      </Table.Cell>
                      <Table.Cell>
                        <Image.Group
                          style={{
                            padding: -5,
                          }}
                        >
                          {this.props.selectedChar.lose.map((char) => (
                            <Image
                              key={char}
                              bordered="bordered"
                              style={{
                                maxWidth: 50,
                                marginLeft: -2,
                              }}
                              src={"/static/profiles/" + char + ".png"}
                            />
                          ))}
                        </Image.Group>
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell color="green" collapsing="collapsing">
                        <Header textAlign="center" color="red">
                          -2
                        </Header>
                      </Table.Cell>
                      <Table.Cell>
                        <Image.Group
                          style={{
                            padding: -5,
                          }}
                        >
                          {this.props.selectedChar.highlose.map((char) => (
                            <Image
                              key={char}
                              bordered="bordered"
                              style={{
                                maxWidth: 50,
                                marginLeft: -2,
                              }}
                              src={"/static/profiles/" + char + ".png"}
                            />
                          ))}
                        </Image.Group>
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              </Grid.Column>
            </Grid.Row>

            <Grid.Row columns={1}>
              <Grid.Column>
                <Header dividing="dividing" sub="sub" size="huge">
                  CONTINGENCIES
                </Header>
                <Item.Group divided="divided">
                  {this.props.selectedConts.map((item) => (
                    <Item>
                      <Item.Image
                        size="tiny"
                        bordered="bordered"
                        src={"/static/profiles/" + item.opponent + ".png"}
                      />
                      <Item.Content>
                        <Link
                          prefetch="prefetch"
                          as={`/c/${item._id}`}
                          href={`/cont?cont=${item._id}`}
                        >
                          <Item.Header as="a">{item.title}</Item.Header>
                        </Link>
                        <Item.Description
                          style={{
                            marginTop: -15,
                          }}
                        >
                          <Editor
                            toolbarHidden="toolbarHidden"
                            editorState={EditorState.createWithContent(
                              convertFromRaw(JSON.parse(item.content))
                            )}
                            readOnly={true}
                            editorStyle={{
                              maxHeight: 200,
                            }}
                          />
                        </Item.Description>

                        <Item.Extra
                          style={{
                            color: "black",
                          }}
                        >
                          <Icon color="green" name="check" />
                          {item.trustCount}
                          users trust this contingency.
                        </Item.Extra>
                      </Item.Content>
                    </Item>
                  ))}
                </Item.Group>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        )}
      </Segment>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: !!state.authentication.token,
  userProfo: state.user.profile,
  token: state.authentication.token,
});

export default connect(mapStateToProps)(CharacterFeeds);
