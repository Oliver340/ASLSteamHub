# ASLSteamHub
An ASL dictionary for technical terms.

## Build
Clone this repository and run the following command:
```
npm install
```

This will install all dependencies as per [package.json](./package.json)

## Dependencies
ASLSteamHub has the following NodeJS dependencies:
- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [body-parser](https://www.npmjs.com/package/body-parser)
- [cookie-parser](https://www.npmjs.com/package/cookie-parser)
- [core-js](https://www.npmjs.com/package/core-js)
- [ejs](https://www.npmjs.com/package/ejs)
- [express](https://www.npmjs.com/package/express)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [morgan](https://www.npmjs.com/package/morgan)
- [mysql](https://www.npmjs.com/package/mysql)
- [pug](https://www.npmjs.com/package/pug)

## Adding New Pages
Express is setup to use the `.pug` template language.
If a page is created using the `.html` extension, using [html-to-pug](https://html-to-pug.com) is likely the easiest way to convert those pages.
Page routes are contained within [routes](./routes/). The basic routing template is as such:
```js
router.get(['/routename', '/alternate-route-name'], (req, res) => {
    res.render('pug-page-without-extension');
});
```
It is important to note that you cannot do both `res.render()` and `res.send()`. the `.pug` template allows for passing a `json` object to fill some data field for more dynamic content using `#{variableContentName}`. More information is available at [pugjs](https://pugjs.org/api/getting-started.html).

More information on Express routing is available in the [Express Documentation](https://expressjs.com/en/guide/routing.html).

## API Endpoints
API endpoints are contained within the [api.js](./routes/api.js) file.

API endpoints will always start with `/api`.
Currently, there are a few endpoints:

|Endpoint|Body Parameters|Description|
|---|---|---|
|`/api/signup`|`email`: __string__<br>`name`: __string__<br>`password`: __string__|Signs a new user up for an account|
|`/api/signIn`|`email`: __string__<br>`password`: __string__|Signs an existing user into their account|
|`/api/getList`|`token`: __string__|Get the specified list|
|`/api/addWord`|`token`: __string__<br>|Add a new word to the current list __`TODO: I HAVE NO IDEA WHERE THE WORD IS COMING FROM HERE, I THINK WE NEED A NEW BODY PARAMETER`__|
|`/api/library`|`token`: __string__|Get all words in the approved global dictionary|
|`/api/admin`|`token`: __string__|Get all pending global words|
|`/api/profile`|`token`: __string__|Update user profile|
|`/api/modifyPendingWord`|`token`: __string__|Perform an action on a Pending word|

### What is a __token__?
When a user signs in, they will be granded a temporary token as a [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) `secretkey`. This key lasts for 12 hours in localstorage.

This token will automatically get the user's permission level and their UserID for accessing the database. 

## TODOs
- [x] Express routing
- [x] API signup & signin
- [x] List creation
- [x] Admin word verification
- [ ] Add a word
- [ ] Add notes / comments
- [ ] External search
- [ ] Game (learning aspect, likely quite in-depth)
- [x] Documentation