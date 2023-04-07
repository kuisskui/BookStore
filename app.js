const express = require("express")
const app = express()
const databasePool = require("./database/mssql")
const port = 8000
const server = "127.0.0.1"

const authors = require("./routers/authors")
const bookCategories = require("./routers/authors")
const books = require("./routers/books")
const borrowers = require("./routers/borrowers")
const categories = require("./routers/categories")
const rentedBooks = require("./routers/rentedBooks")
const soldBooks = require("./routers/soldBooks")

app.set("view engine", "ejs")

// app.use("/authors", authors)
// app.use("/bookCategories", bookCategories)
// app.use("/books", books)
// app.use("/borrowers", borrowers)
// app.use("/categories", categories)
// app.use("/rentedBooks", rentedBooks)
// app.use("/soldBooks", soldBooks)
app.get('/', function (req, res) {
    databasePool.request()
        .query(`
    SELECT name FROM sys.tables
    WHERE type_desc='USER_TABLE'
    ORDER BY name
  `)
        .then((result) => {
            // console.log(result) // debug here
            res.render("app", { data: result.recordset })// point to template here
        })
        .catch((err) => {
            console.error(`Error querying database: ${err}`);
            res.sendStatus(500);
        });
})

app.get('/table', async function (req, res) {
    // databasePool.request()
    //     .query(`SELECT * FROM ${req.params.table}`)
    //     .then((result) => {
    //         // console.log(result) // debug here
    //         res.render(`${req.params.table}`, { data: result.recordset, "tableName": `${req.params.table}` })// point to template here
    //     })
    //     .catch((err) => {
    //         console.error(`Error querying database: ${err}`);
    //         res.sendStatus(500);
    //     });
    const tableName = req.query.tableName
    const queryResult = await databasePool.request().query(`SELECT * FROM ${tableName}`);
    const columnName = await databasePool.request().query(`SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '${tableName}'`);

    Promise.all([queryResult, columnName])
        .then((results) => {
            const result = results[0].recordset.map(object => Object.values(object))
            const columnName = results[1].recordset.map(object => Object.values(object))
            res.render("table", {"tableName": tableName, "columnName": columnName, "result": result});
        })
        .catch((err) => {
            console.error(`Error querying database: ${err}`);
            res.sendStatus(500);
        });
})

app.use("/insert", function (req, res, next) {
    const tableName = req.query.tableName
    const query = req.query
    delete query.tableName
    const columnString = Object.keys(query).join(", ")
    const valueString = Object.values(query).join(", ")     // fix if it is string quote them ''
    console.log(valueString)
    databasePool.request()
        .query(`
            INSERT INTO ${tableName} (${columnString})
            VALUES (${valueString})
        `)
        .then(() => {
            next()
        })
        .catch((err) => {
            console.error(`Error querying database: ${err}`);
            res.sendStatus(500);
        });
})

app.get("/delete", function (req, res) {
    
})
app.get("/update", function (req, res) {
    
})
app.listen(port, function () {
    console.log(`Starting http://${server}:${port}`)
})