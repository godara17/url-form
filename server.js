const express = require('express')
const path = require('path')
const cheerio = require('cheerio')
const request = require('request')

const port = 3000
const app = express()

app.use(express.static(__dirname))


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/form.html'))
})

app.get('/fetch_urls', (req, res) => {
    let url = req.query.url
    let fUrl = url
    let extUrl = url

    if (extUrl.startsWith("http://"))
        extUrl = extUrl.substring(7)
    if (extUrl.startsWith("www."))
        extUrl = extUrl.substring(4)
    
    fUrl = "http://www." + extUrl
    
    request(fUrl, function (error, response, body) {
        let data = {}
        if (!error && response.statusCode == 200) {
            data[url] = cheerio.load(body)("title").text()
            res.send(JSON.stringify(data))
        } else {
            data[url] = error.code
            res.send(JSON.stringify(data))
        }
    })
})

app.listen(port, () => console.log(`Url-Form app listening on port ${port}!`))
