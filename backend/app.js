const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const path = require("path")
const cors = require("cors")
const PORT = process.env.PORT || 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
// app.use(express.json)
app.use(cors())

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

const routes = require("./routes/blogRoutes")
app.use("/", routes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
