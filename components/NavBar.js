import Link from "next/link";
import { connect } from "react-redux";
import actions from "../redux/actions";
import {
  Dropdown,
  Ref,
  Header,
  Segment,
  Container,
  Button,
  Menu,
  Grid,
} from "semantic-ui-react";
import initialize from "../utils/initialize";

class NavBar extends React.Component {
  static async getInitialProps(ctx) {
    await initialize(ctx);
    const token = ctx.store.getState().authentication.token;
    if (token) {
      const userProfo = ctx.store.getState().user.profile;
      return {
        userProfo
      };
    }

    return {};
  }

  constructor(props) {
    super(props);
    this.state = {
      userProfile: { username: "" },
      visible: false,
    };
  }

  render() {
    const {
      isAuthenticated,
      userProfo,
      deauthenticate,
      children,
      getWidth,
    } = this.props;

    return (
        <Menu compact fixed="top" inverted size="large">
        <Link prefetch href="/">
          <Menu.Item as="a">
            <Header inverted>
              <Icon name="cube" size="small" /> THE CONTINGENCY PLAN
            </Header>
          </Menu.Item>
        </Link>
        <Link prefetch href="/characters">
          <Menu.Item link>
            <Header inverted sub>
              Characters
            </Header>
          </Menu.Item>
        </Link>
        <Link prefetch href="/ranking">
          <Menu.Item>
            <Header inverted sub>
              Ranking
            </Header>
          </Menu.Item>
        </Link>
        <Link prefetch href="/about">
          <Menu.Item>
            <Header inverted sub>
              About
            </Header>
          </Menu.Item>
        </Link>
        <Link prefetch href="/contact">
          <Menu.Item>
            <Header inverted sub>
              Contact
            </Header>
          </Menu.Item>
        </Link>
        {!isAuthenticated && (
          <Menu.Menu position="right">
            <Menu.Item as="a">
              <Link prefetch href="/signin">
                <Header inverted sub>
                  Login
                </Header>
              </Link>
            </Menu.Item>
            <Menu.Item colored="green" as="a">
              <Link prefetch href="/signup">
                <Header color="green" inverted sub>
                  Register
                </Header>
              </Link>
            </Menu.Item>
          </Menu.Menu>
        )}
        {isAuthenticated && (
          <Menu.Item position="right">
            <Dropdown
              trigger={
                <Image avatar bordered src={userProfo.avatar.url} />
              }
              direction="left"
              floating
              icon={null}
            >
              <Dropdown.Menu>
                <Dropdown.Header>
                  <Header as="h2">
                    {userProfo.username}
                    <Header.Subheader>
                      {userProfo.email}
                    </Header.Subheader>
                  </Header>
                </Dropdown.Header>
                <Dropdown.Divider />

                <Link
                  prefetch
                  href={`/user?user=${userProfo.username}`}
                  as={`/u/${userProfo.username}`}
                >
                  <Dropdown.Item text="View Profile" />
                </Link>

                <Link prefetch as="/user/settings" href="/settings">
                  <Dropdown.Item text="Account Settings" />
                </Link>

                <Dropdown.Item
                  onClick={deauthenticate}
                  text="Log Out"
                />
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Item>
        )}
      </Menu>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: !!state.authentication.token,
  userProfo: state.user.profile
    ? state.user.profile
    : { username: "", email: "" },
});

export default connect(mapStateToProps, actions)(NavBar);
