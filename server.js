const express = require("express");
const next = require("next");
const cookieParser = require("cookie-parser");
const proxy = require("http-proxy-middleware");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({
  dev,
});
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();

    let options = {
      target: "http://localhost:2000/",
      changeOrigin: true,
      logLevel: "debug",
      onError: function onError(err, req, res) {
        console.log("Something went wrong with the proxy middleware.", err);
        res.end();
      },
    };

    server.use("/api", proxy(options)); //only forward calls with ‘/api’ route
    server.use(cookieParser());

    server.get("/signin", (req, res) => {
      if (req.cookies.token) {
        res.redirect("/");
      } else {
        return app.render(req, res, "/signin", req.query);
      }
    });

    server.get("/signup", (req, res) => {
      if (req.cookies.token) {
        res.redirect("/");
      } else {
        return app.render(req, res, "/signup", req.query);
      }
    });

    server.get("/for/:target", (req, res) => {
      if (req.query.type === "matchups") {
        return app.render(req, res, "/formatchups", {
          target: req.params.target,
          type: req.query.type,
        });
      } else if (req.query.type === "players") {
        return app.render(req, res, "/forplayers", {
          target: req.params.target,
          type: req.query.type,
        });
      } else if (req.query.type === "intel") {
        return app.render(req, res, "/forintel", {
          target: req.params.target,
          type: req.query.type,
        });
      } else {
        return app.render(req, res, "/for", {
          target: req.params.target,
          type: req.query.type,
        });
      }
    });

    server.get("/u/:user", (req, res) => {
      return app.render(req, res, "/user", {
        user: req.params.user,
      });
    });

    server.get("/c/:cont", (req, res) => {
      return app.render(req, res, "/cont", {
        cont: req.params.cont,
      });
    });

    server.get("/area52/:ip", (req, res) => {
      return app.render(req, res, "/area52", {
        ip: req.params.ip,
      });
    });

    server.get("/verify/:token", (req, res) => {
      return app.render(req, res, "/verify", {
        token: req.params.token,
      });
    });

    server.get("/resetpass/:token", (req, res) => {
      return app.render(req, res, "/resetpass", {
        token: req.params.token,
      });
    });

    server.get("/user/settings", (req, res) => {
      return app.render(req, res, "/settings");
    });

    server.get("/user/characters", (req, res) => {
      return app.render(req, res, "/charactermanage");
    });

    server.get("/u/:user/:character", (req, res) => {
      return app.render(req, res, "/userChar", {
        user: req.params.user,
        character: req.params.character,
      });
    });

    server.get("*", (req, res) => {
      return handle(req, res);
    });

    server.listen(port, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port}`);
    });
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });
