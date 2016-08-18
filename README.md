# Snip

a dead-simple URL shortener

### Usage

Head on the website, enter a URL, and click submit (or enter)

<!--### Stats-->

<!--Go on any Snipped URL, and append a `/stats` to the URL. (/Qra7ecH/stats)-->

<!--Now you will be able to see the stats of the website.-->

### API Usage

Snip has an API!

- To get the details of a URL, make a GET request to the url + `/api`, example output:

```js
{
    id: "Qra7ecH",
    stats: {
        visits: 10
    },
    snippedURL: 'http://snipit.herokuapp.com/Qra7ecH',
    longURL: 'http://thisisareallylongurlifonlyitcouldbeshorter.com'
}
```

To get the

### Bugs/Issues

Find a bug in Snip?

[Let us know!](https://github.com/KingPixil/snip/issues/new)

### License

Released under the [MIT License](https://kingpixil.github.io/license) by [Kabir Shah](http://kabir.ml)