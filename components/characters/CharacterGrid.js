import React from "react";
import Link from "next/link";
import { connect } from "react-redux";
import {
  Message,
  Grid,
  Header,
  Statistic,
  Progress,
  Responsive,
  Image,
  Segment,
  Transition,
  Search,
  Input,
  Container,
  Divider,
  Button,
  Loader,
  Dimmer,
} from "semantic-ui-react";
import _ from "lodash";

class CharacterGrid extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      charPool: null,
    };
  }

  componentDidMount() {
    this.setState({ charPool: this.props.characters });
  }

  render() {
    return (
      <Segment>
        <Grid padded columns={4}>
          <Grid.Row only="computer">
            <Transition.Group animation="fade up" duration={500}>
              {this.state.charPool.map(
                (char) =>
                  this.charNameOrUniverse(char, this.props.value) && (
                    <Grid.Column key={char.id} textAlign="center">
                      <Link
                        prefetch
                        as={`/for/${char.id}`}
                        href={`/for?target=${char.id}`}
                      >
                        <Image
                          bordered
                          centered
                          href={"/for/" + char.id}
                          src={"static/slights/" + char.id + ".png"}
                        />
                      </Link>
                      <Header
                        as="h2"
                        style={{ marginTop: 3, marginBottom: -30 }}
                      >
                        {char.name}
                      </Header>
                      <Header sub>
                        <Image
                          style={{ width: 40, marginRight: 1 }}
                          src={"static/sigils/" + char.sigil + ".svg"}
                          onClick={(e) =>
                            this.handleSigilChange(e, char.origin)
                          }
                        />
                        {char.origin}
                      </Header>
                      <Statistic
                        style={{ marginTop: -3, marginBottom: 20 }}
                        size="small"
                      >
                        <Statistic.Value>{char.total}</Statistic.Value>
                        <Statistic.Label>Data Submissions</Statistic.Label>
                      </Statistic>
                    </Grid.Column>
                  )
              )}
            </Transition.Group>
          </Grid.Row>
        </Grid>
        <Grid>
          <Grid.Row only="mobile">
            <Grid.Column textAlign="center">
              <Image.Group>
                {this.state.charPool.map(
                  (char) =>
                    this.charNameOrUniverse(char, this.props.value) && (
                      <Link
                        key={char.id}
                        prefetch
                        as={`/for/${char.id}`}
                        href={`/for?target=${char.id}`}
                      >
                        <Image
                          bordered
                          style={{ maxWidth: "17%" }}
                          centered
                          src={"static/profiles/" + char.id + ".png"}
                        />
                      </Link>
                    )
                )}
              </Image.Group>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect((state) => state, {})(CharacterGrid);
