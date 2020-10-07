import Router from "next/router";
import actions from "../redux/actions";
import { getCookie } from "../utils/cookie";

// checks if the page is being loaded on the server, and if so, get auth token from the cookie:
export default async function (ctx) {

  if (ctx.req) {
    await ctx.store.dispatch(actions.setip(ctx.req.ip));

    if (ctx.req.headers.cookie) {
      if (getCookie("token", ctx.req) !== undefined) {
        await ctx.store.dispatch(actions.refetch(getCookie("token", ctx.req)));
        await ctx.store.dispatch(
          actions.reauthenticate(getCookie("token", ctx.req))
        );
      }
    }

  } else {
    const token = ctx.store.getState().authentication.token;

    if (token && (ctx.pathname === "/signin" || ctx.pathname === "/signup")) {
      await ctx.store.dispatch(actions.refetch(getCookie("token", ctx.req)));
      setTimeout(function () {
        Router.push("/");
      }, 0);
    }
  }
}
