import React from "react";
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

class CharacterNav extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Segment>
        <Grid>
          <Grid.Row columns={2}>
            <Grid.Column width={12}>
              <Image.Group>
                {this.props.sigils.map((sigil) => (
                  <Image
                    key={sigil.name}
                    style={{ width: 40, cursor: "pointer" }}
                    src={"static/sigils/" + sigil.name + ".svg"}
                    onClick={(e) =>
                      this.props.handleSigilChange(e, sigil.formal)
                    }
                  />
                ))}
              </Image.Group>
            </Grid.Column>
            <Grid.Column width={4}>
              <Input
                icon="search"
                fluid
                placeholder="Search..."
                value={this.props.value}
                onChange={this.props.handleSearchChange}
              />
              <br />
              <Button fluid onClick={this.props.handleReset}>
                RESET FILTER
              </Button>
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

export default connect((state) => state, {})(CharacterNav);
