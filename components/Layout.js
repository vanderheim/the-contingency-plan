import Link from "next/link";
import Head from "next/head";
import Styles from "../css/index.scss";
import {
  Header,
  Segment,
  Container,
  Grid,
} from "semantic-ui-react";
import { createRef } from "react";
import Particles from "react-particles-js";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";

class Layout extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <React.Fragment>
        <Head>
          <title>The Contingency Plan</title>
          <style dangerouslySetInnerHTML={{ __html: Styles }} />
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
        </Head>

        <div
          style={{
            display: "flex",
            minHeight: "100vh",
            flexDirection: "column",
          }}
        >
          <Grid>
            <Grid.Row>
              <NavBar />
            </Grid.Row>
          </Grid>
          <Ref innerRef={this.segmentRef}>
            <div style={{ marginTop: "6em", flex: 1 }}>{children}</div>
          </Ref>
          <Footer />
        </div>
        <Particles
          params={{}}
          style={{
            top: "0",
            left: "0",
            bottom: "0",
            right: "0",
            zIndex: "-1",
            position: "fixed",
            background:
              'url("/static/shattered.png") no-repeat center center fixed',
            "-webkitBackgroundSize": "cover",
            "-mozBackgroundSize": "cover",
            "-oBackgroundSize": "cover",
            backgroundSize: "cover",
            backgroundColor: "#43464B",
          }}
        />
      </React.Fragment>
    );
  }
}

export default Layout;
