const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const PORT = process.env.PORT || 8080

const app = express()

const newsSources = [
    {
        name: 'bbc',
        address: 'https://www.bbc.com/news/world-60525350',
        base: 'https://www.bbc.com'
    },
    {
        name: 'reuters',
        address: 'https://www.reuters.com/world/europe/',
        base: 'https://www.reuters.com'
    },
    {
        name: 'ap',
        address: 'https://apnews.com/hub/russia-ukraine',
        base: 'https://apnews.com'
    },
    {
        name: 'foreignaffairs',
        address: 'https://www.foreignaffairs.com/tags/war-ukraine',
        base: 'https://www.foreignaffairs.com'
    },
    {
        name: 'defenceblog',
        address: 'https://defence-blog.com/category/news/',
        base: ''
    },
    {
        name: 'voanews',
        address: 'https://www.voanews.com/flashpoint',
        base: 'https://www.voanews.com'
    },
    {
        name: 'nytimes',
        address: 'https://www.nytimes.com/news-event/ukraine-russia',
        base: 'https://www.nytimes.com'
    },
    {
        name: 'aljazeera',
        address: 'https://www.aljazeera.com/tag/ukraine-russia-crisis/',
        base: 'https://www.aljazeera.com'
    },
    {
        name: 'dw',
        address: 'https://www.dw.com/en/war-in-ukraine/t-60931789',
        base: 'https://www.dw.com'
    },
    {
        name: 'france24',
        address: 'https://www.france24.com/en/tag/ukraine/',
        base: 'https://www.france24.com'
    },
    {
        name: 'kyivindependent',
        address: 'https://kyivindependent.com/tag/russias-war',
        base:'https://kyivindependent.com'
    },
    {
        name: 'theguardian',
        address: 'https://www.theguardian.com/world/ukraine',
        base:''   
    }
]

const articles = []
let unique = []

newsSources.forEach(source => {
    axios.get(source.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("Ukraine")', html).each(function() {
                const title = $(this).text().replace(/<[^>]*>?/gm, '').trim();
                const url = $(this).attr('href')

                if(!articles.some(e => e.title === title)){
                    articles.push({
                        title: title.replace(/\s+/g, ' '),
                        url: source.base + url,
                        src: source.name
                    })
                }

            })
            unique = articles.filter((v,i,a) => a.indexOf(v) === i)
        })
})


app.get('/', (req,res) => {
    res.json('Welcome to ukraine war update API')
})

app.get('/news', (req,res) => {
    res.json(unique)
})

app.get('/news/:srcId', (req, res) => {
    const srcId = req.params.srcId

    const src = newsSources.filter(source => source.name == srcId)[0].address
    const srcBase = newsSources.filter(source => source.name == srcId)[0].base
    console.log(src)
    axios.get(src)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("Ukraine")', html).each(function() {
                const title = $(this).text().replace(/\s+/g, ' ').trim();
                const url = $(this).attr('href')

                specificArticles.push({
                    title,
                    url: srcBase + url,
                    src: srcId
                })
            })
            res.json(specificArticles)
        })
})




app.listen(PORT, () => {
    console.log(`server running on ${PORT}`)
})