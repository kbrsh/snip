# Snip

a dead-simple URL shortener

### Usage

Head on the website, enter a URL, and click submit (or enter)

### Stats

Go on any Snipped URL, and append a `/stats` to the URL. (/Qra7ecH/stats)

Now you will be able to see the stats of the website.

### API Usage

Snip has an api that you can use to access the details of a URL in your application! Simply make a call to your url and `/api`. You will get a JSON output, in the following format:

```js
{
    snippedURL: 'Qra7ecH',
    longURL: 'http://thisisareallylongurlifonlyitcouldbeshorter.com',
    stats: {
        views: '123'
    }
}
```