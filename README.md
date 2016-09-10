# Snip

a dead-simple URL shortener

### Usage

Head on the website, enter a URL, and click submit (or enter)

<!--### Stats-->

<!--Go on any Snipped URL, and append a `/stats` to the URL. (/Qra7ecH/stats)-->

<!--Now you will be able to see the stats of the website.-->

### API Usage

Snip has a dead-simple, easy to use API.

- To get the details of a URL, make a GET request to the url + `/api`, to make it pretty, make it to the url + `/api?pretty=true`, example output:

```js
{
    id: "Qra7ecH",
    stats: {
        visits: 10
    },
    shortURL: 'http://snipit.herokuapp.com/Qra7ecH',
    longURL: 'http://thisisareallylongurlifonlyitcouldbeshorter.com'
}
```

- To get an array of ALL recent URL's, make a GET request to `/api/links`, example output:

```js
[{"id":"erbpgb9","stats":{"visits":1},"snippedURL":"http://snipit.herokuapp.com/erbpgb9","longURL":"http://kabir.ml"},{"id":"72satt9","stats":{"visits":2295},"snippedURL":"http://snipit.herokuapp.com/72satt9","longURL":"http://usewing.ml"}]
```

### Bugs/Issues

Find a bug in Snip?

[Let us know!](https://github.com/KingPixil/snip/issues/new)

### License

Released under the [MIT License](https://kingpixil.github.io/license) by [Kabir Shah](http://kabir.ml)
