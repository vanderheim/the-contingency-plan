import React from "react";
import { createRef } from "react";
import { connect } from "react-redux";
import Router from "next/router";
import Link from "next/link";
import _ from "lodash";
import { Grid, Menu } from "semantic-ui-react";

class ForNavBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: this.props.chartype === null ? "main" : this.props.chartype,
    };
  }

  render() {
    return (
      <Menu widths={4}>
        <Link
          prefetch="prefetch"
          as={`/for/${this.props.charTarget}`}
          href={`/for?target=${this.props.charTarget}`}
        >
          <Menu.Item value="main" active={this.props.activeTab === "main"}>
            <Icon name="comments" />
          </Menu.Item>
        </Link>
        <Link
          prefetch="prefetch"
          as={`/for/${this.props.charTarget}?type=matchups`}
          href={`/formatchups?target=${this.props.charTarget}&type=matchups`}
        >
          <Menu.Item
            value="matchups"
            active={this.props.activeTab === "matchups"}
          >
            <Icon name="balance scale" />
          </Menu.Item>
        </Link>
        <Link
          prefetch="prefetch"
          as={`/for/${this.props.charTarget}?type=players`}
          href={`/forplayers?target=${this.props.charTarget}&type=players`}
        >
          <Menu.Item
            value="players"
            active={this.props.activeTab === "players"}
          >
            <Icon name="user" />
          </Menu.Item>
        </Link>
        <Link
          prefetch="prefetch"
          as={`/for/${this.props.charTarget}?type=intel`}
          href={`/forintel?target=${this.props.charTarget}&type=intel`}
        >
          <Menu.Item value="intel" active={this.props.activeTab === "intel"}>
            <Icon name="cogs" />
          </Menu.Item>
        </Link>
      </Menu>
    );
  }
}

export default ForNavBar;
