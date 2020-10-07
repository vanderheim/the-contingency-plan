/* global window */
import React from "react";
import Link from "next/link";
import Router from "next/router";
import initialize from "../utils/initialize";
import { connect } from "react-redux";
import CharacterGrid from "../components/characters/CharacterGrid";
import CharacterNav from "../components/characters/CharacterNav";
import { API } from "../config";
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
import axios from "axios";

class Characters extends React.Component {
  static async getInitialProps(ctx, store, query) {
    initialize(ctx);
    let res = await axios.get(`${API}/api/contingency`);
    let characters = await res.data.characters;
    return { characters };
  }

  constructor(props) {
    super(props);
    this.state = {
      value: "",
      sigils: [
        {
          name: "AnimalCrossingSymbol",
          formal: "Animal Crossing",
        },
        {
          name: "BayonettaSymbol",
          formal: "Bayonetta",
        },
        {
          name: "CastlevaniaSymbol",
          formal: "Castlevania",
        },
        {
          name: "DKSymbol",
          formal: "Donkey Kong",
        },
        {
          name: "DuckHuntSymbol",
          formal: "Duck Hunt",
        },
        {
          name: "EarthboundSymbol",
          formal: "Earthbound",
        },
        {
          name: "FinalFantasySymbol",
          formal: "Final Fantasy",
        },
        {
          name: "FireEmblemSymbol",
          formal: "Fire Emblem",
        },
        {
          name: "FZeroSymbol",
          formal: "F-Zero",
        },
        {
          name: "Game&WatchSymbol",
          formal: "Game & Watch",
        },
        {
          name: "IceClimberSymbol",
          formal: "Ice Climber",
        },
        {
          name: "KidIcarusSymbol",
          formal: "Kid Icarus",
        },
        {
          name: "KirbySymbol",
          formal: "Kirby",
        },
        {
          name: "MarioSymbol",
          formal: "Super Mario Brothers",
        },
        {
          name: "MegaManSymbol",
          formal: "Mega Man",
        },
        {
          name: "MetalGearSymbol",
          formal: "Metal Gear",
        },
        {
          name: "MetroidSymbol",
          formal: "Metroid",
        },
        {
          name: "MiiSymbol",
          formal: "Mii",
        },
        {
          name: "PacManSymbol",
          formal: "Pac-Man",
        },
        {
          name: "PikminSymbol",
          formal: "Pikmin",
        },
        {
          name: "PokemonSymbol",
          formal: "Pokemon",
        },
        {
          name: "PunchOutSymbol",
          formal: "Punch Out!!!",
        },
        {
          name: "ROBSymbol",
          formal: "R. O. B.",
        },
        {
          name: "SonicSymbol",
          formal: "Sonic The Hedgehog",
        },
        {
          name: "SplatoonSymbol",
          formal: "Splatoon",
        },
        {
          name: "StarFoxSymbol",
          formal: "Star Fox",
        },
        {
          name: "StreetFighterSymbol",
          formal: "Street Fighter",
        },
        {
          name: "WarioSymbol",
          formal: "Wario",
        },
        {
          name: "WiiFitSymbol",
          formal: "Wii Fitness",
        },
        {
          name: "XenobladeSymbol",
          formal: "Xenoblade",
        },
        {
          name: "YoshiSymbol",
          formal: "Yoshi's Island",
        },
        {
          name: "PersonaSymbol",
          formal: "Persona",
        },
      ],
    };
  }

  handleSearchChange = (e, { value }) => {
    this.setState({ value });
  };

  handleReset = () => {
    this.setState({ value: "" });
  };

  handleSigilChange = (e, value) => {
    this.setState({ value: value });
  };

  render() {
    return (
      <Container>
        <CharacterNav
          sigils={this.state.sigils}
          value={this.state.value}
          handleSearchChange={this.handleSearchChange}
          handleReset={this.handleReset}
          handleSigilChange={this.handleSigilChange}
        />
        <CharacterGrid characters={this.props.characters} />
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect((state) => state, {})(Characters);
