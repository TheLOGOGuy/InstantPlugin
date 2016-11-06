import "./index.styl"

// import Application from "components/application"
import Application from "components/application2"

document.addEventListener("DOMContentLoaded", () => {
  const application = new Application(document.getElementById("app"))

  if (process.env.NODE_ENV !== "production") {
    window.application = application
  }
})
