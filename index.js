const e = require("express")
var bodyParser = require('body-parser')
const app = e()

const authApi = require("./routes/auth")

const port = process.env.PORT || 8080

// body parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(e.json())

// api router
let mainRouter = e.Router()



// api middleware
mainRouter.use((req, res, next) => {
    res.setHeader("Content-Type", "application/json")

    next()
})

// set auth api
mainRouter.use("/auth", authApi)

// 404 error
mainRouter.use((req, res) => {
    res.send({
        status: false,
        massage: "API Not Found"
    })
})



// set main router
app.use("/api", mainRouter)

// app listen on 8080
app.listen(port, () => {
    console.log(`app running on port ${port}`);
})


