import "./index.styl"

import Application from "components/application"
import elementDatasetPolyfill from "element-dataset"

document.addEventListener("DOMContentLoaded", () => {
  elementDatasetPolyfill()

  const application = new Application(document.getElementById("app"))

  if (process.env.NODE_ENV !== "production") {
    window.application = application
  }
})
