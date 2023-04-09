const express = require("express")
const { columns, UniqueIdentifier } = require("mssql")
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

app.get("/table", async function (req, res) {
    const tableName = req.query.tableName
    const queryResult = await (databasePool.request().query(`SELECT * FROM ${tableName}`))
    const columnName = await (databasePool.request().query(`SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '${tableName}'`))

    Promise.all([queryResult, columnName])
        .then((results) => {
            const result = results[0].recordset.map(object => Object.values(object))
            const columnName = results[1].recordset.map(object => Object.values(object))
            res.render("table", { "tableName": tableName, "columnName": columnName, "result": result });
        })
        .catch((err) => {
            console.error(`Error querying database: ${err}`);
            res.sendStatus(500);
        });
})
function createDataTypeObject(dataType) {
    dataType = dataType.map(object => Object.values(object))
    dataTypeObject = {}
    for (const value of dataType) {
        Object.defineProperty(dataTypeObject, value[0], {
            value: value[1]
        })
    }
    return dataTypeObject
}
function writeQueryString(dataType, query) {
    dataTypeObject = createDataTypeObject(dataType)
    let queryString = []
    for (const p in query) {
        const type = ["int", "decimal"]
        const value = query[p]
        if (type.includes(dataTypeObject[p])) {
            queryString.push(`${value}`)
        }
        else {
            queryString.push(`'${value}'`)
        }
    }
    return queryString.join(',')
}

app.get("/insert", async function (req, res) {
    const tableName = req.query.tableName
    const query = req.query
    delete query.tableName

    const dataType = databasePool.request()
        .query(`
        SELECT COLUMN_NAME, DATA_TYPE
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_NAME = '${tableName}';    
    `)

    let columnString;
    let valueString;
    await Promise.all([dataType])
        .then((results) => {
            columnString = Object.keys(query).join(", ")
            valueString = writeQueryString(results[0].recordset, query)
        })
        .catch((err) => {
            console.error(`Error querying database: ${err}`);
            res.sendStatus(500);
        });

    databasePool.request()
        .query(`
            INSERT INTO ${tableName} (${columnString})
            VALUES (${valueString})
        `)
        .then(() => {
            res.redirect(req.headers.referer)
        })
        .catch((err) => {
            console.error(`Error querying database: ${err}`);
            res.sendStatus(500);
        });
})

app.get("/delete", function (req, res) {
    const tableName = req.query.tableName
    const query = req.query
    delete query.tableName
    databasePool.request()
        .query(`
            DELETE FROM ${tableName}
            WHERE ${Object.keys(query)[0]}=${Object.values(query)[0]};        
        `)
        .then(() => {
            res.redirect(req.headers.referer)
        })
        .catch((err) => {
            console.error(`Error querying database: ${err}`);
            res.sendStatus(500);
        });
})
app.get("/update", async function (req, res) {
    const tableName = req.query.tableName
    let query = req.query
    delete query.tableName

    let columnName = await databasePool.request().query(`SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '${tableName}'`)
    columnName = columnName.recordset.map(object => Object.values(object)[0])

    let columnCount = columnName.length

    let oldData = await databasePool.request().query(`SELECT * FROM ${tableName} WHERE ${Object.keys(query)[0]}=${Object.values(query)[0]}`)
    oldData = oldData.recordset.map(object => Object.values(object))[0]

    res.render("update", {tableName: tableName, columnName: columnName, oldData: oldData, columnCount:columnCount})
})
app.get("/update/process", async function (req, res) {
    const tableName = req.query.tableName
    let query = req.query
    delete query.tableName
    delete query.action

    

    await databasePool.request().query(`
        UPDATE ${tableName}
        SET first_name = 'John', last_name = 'Doe'
        WHERE ${Object.keys(query)[0]} = ${Object.values(query)[0]};
    `)
    console.log(req.query)
    res.send('hello')

})
app.listen(port, function () {
    console.log(`Starting http://${server}:${port}`)
})