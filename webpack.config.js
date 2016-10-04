/* eslint-env node */
"use strict"

const ENVIRONMENT = process.env.NODE_ENV || "development"
const {resolve} = require("path")
const {description, version} = require("./package.json")
const routes = require("./routes.json")
const viewsRoute = routes.views[ENVIRONMENT]
const webpack = require("webpack")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const marked = require("marked")
const autoprefixer = require("autoprefixer")

const toURL = ({hostname, port, protocol}) => `${protocol}://${hostname}${port ? ":" + port : ""}`

const API_BASE = toURL(routes.api[ENVIRONMENT])
const APP_BASE = toURL(routes.app[ENVIRONMENT])
const exclude = /node_modules/

const renderer = new marked.Renderer()
const $ = {}

$.devtool = "source-map"

$.entry = {
  site: "./app/index.js",
  segment: "./app/segment.js"
}

$.markdownLoader = {renderer}

$.output = {
  path: __dirname + "/site-deploy",
  filename: "[name].js",
  sourceMapFilename: "[name].map"
}

$.plugins = [
  new webpack.NoErrorsPlugin(),
  new webpack.DefinePlugin({
    API_BASE: JSON.stringify(API_BASE),
    APP_BASE: JSON.stringify(APP_BASE),
    VERSION: JSON.stringify(version),
    "process.env.NODE_ENV": JSON.stringify(ENVIRONMENT)
  }),
  new HtmlWebpackPlugin({
    title: "Instant Plugin",
    description,
    template: "app/index.pug"
  })
]

$.resolve = {
  extensions: ["", ".js", ".json"],
  modules: [resolve(__dirname, "app"), "node_modules"]
}

$.postcss = () => [autoprefixer({remove: false, browsers: ["last 2 versions", "ie 10"]})]

const minimizeParam = ENVIRONMENT === "development" ? "-minimize" : "minimize"

$.module = {
  loaders: [
    {test: /\.pug$/, loader: "pug", exclude},
    {test: /\.png|jpe?g|gif$/i, loader: "url?limit=0", exclude},
    {test: /\.js$/, loader: "babel", exclude},
    {test: /\.svg$/, loader: "svg-inline", exclude},
    {test: /\.styl$/, loader: `style!css?${minimizeParam}!postcss!stylus?paths=app`}
  ],
  noParse: /\.min\.js/
}

if (ENVIRONMENT === "development") {
  $.devtool = "eval"

  $.module.preLoaders = [{
    exclude,
    loader: "eslint-loader",
    test: /\.js$/
  }]

  const devServerClient = `webpack-dev-server/client?http://0.0.0.0:${viewsRoute.port}`

  if (Array.isArray($.entry)) {
    $.entry.unshift(devServerClient)
  }
  else {
    $.entry["dev-server-client"] = devServerClient
  }
}

module.exports = $
