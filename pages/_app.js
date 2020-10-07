import { Provider } from "react-redux";
import App, { Container } from "next/app";
import { withRouter } from "next/router";
import withRedux from "next-redux-wrapper";
import { SET_ITEMS } from "../redux/types";
import actions from "../redux/actions";
import "semantic-ui-css/semantic.min.css";
import { PageTransition } from "next-page-transitions";
import Layout from "../components/Layout";
import Router from "next/router";

import { initStore } from "../redux";

export default withRedux(initStore, { debug: false })(
  class MyApp extends App {
    static async getInitialProps({ Component, router, ctx }) {
      const isProduction = true;
      // const pageProps = {};
      // Call the page's `getInitialProps` if it exists. Don't `await` it yet,
      // because we'd rather `await` them together concurrently.
      const pageProps = Component.getInitialProps
        ? await Component.getInitialProps(ctx)
        : {};
      // Call the layout's `getInitialProps` if it exists. Don't `await` it yet,
      // because we'd rather `await` them together concurrently.
      const layoutProps = Layout.getInitialProps
        ? await Layout.getInitialProps(ctx)
        : {};
      return { pageProps, layoutProps, isProduction };
    }

    render() {
      const { Component, pageProps, layoutProps, store, router } = this.props;
      return (
        <Container>
          <Provider store={store}>
            <Layout {...layoutProps}>
              <PageTransition timeout={200} classNames="page-transition">
                <Component {...pageProps} key={router.route} />
              </PageTransition>
            </Layout>
          </Provider>
          <style jsx global>
            {`
              body {
                background: url("/static/shattered.png") no-repeat center center
                  fixed;
                background-size: cover;
              }

              .page-transition-enter {
                opacity: 0;
              }
              .page-transition-enter-active {
                opacity: 1;
                transition: opacity 300ms;
              }
              .page-transition-exit {
                opacity: 1;
              }
              .page-transition-exit-active {
                opacity: 0;
                transition: opacity 300ms;
              }
            `}
          </style>
        </Container>
      );
    }
  }
);
