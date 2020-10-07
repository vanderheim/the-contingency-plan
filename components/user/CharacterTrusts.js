import React from "react";
import { connect } from "react-redux";
import SettingsChar from "../pages/charactermanage";
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

class CharacterTrusts extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <React.Fragment>
        <Segment attached="attached">
          <Grid>
            <Grid.Row
              style={{
                marginBottom: -15,
              }}
            >
              <Grid.Column textAlign="center">
                <Header sub="sub" size="huge">
                  Characters
                </Header>
                <Divider clearing="clearing" />
              </Grid.Column>
            </Grid.Row>
            {Object.keys(this.props.userInfo.characters).map(
              (registered, i) =>
                this.props.userInfo.characters[registered].active && (
                  <Grid.Row
                    style={{
                      marginTop: -15,
                    }}
                    centered="centered"
                  >
                    <Grid.Column textAlign="center">
                      <Image src={"/static/slights/" + registered + ".png"} />
                      <Label
                        color="green"
                        style={{
                          marginTop: 5,
                        }}
                        size="medium"
                      >
                        TRUST
                        <Label.Detail>
                          {this.props.userInfo.characters[registered].trustCount
                            ? this.props.userInfo.characters[registered]
                                .trustCount
                            : 0}
                        </Label.Detail>
                      </Label>
                      <Label
                        style={{
                          marginTop: 5,
                          cursor: "pointer",
                        }}
                        onClick={() => this.props.selectCharacter(registered)}
                        size="medium"
                      >
                        VIEW DATA
                      </Label>
                    </Grid.Column>
                  </Grid.Row>
                )
            )}
          </Grid>
        </Segment>
        {this.props.isAuthenticated &&
        this.props.userInfo.username === this.props.userProfo.username ? (
          <Modal
            trigger={
              <Button positive attached="bottom">
                {" "}
                ADD CHARACTERS
              </Button>
            }
          >
            <SettingsChar />
          </Modal>
        ) : null}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: !!state.authentication.token,
  userProfo: state.user.profile,
  token: state.authentication.token,
});

export default connect(mapStateToProps)(CharacterTrusts);
