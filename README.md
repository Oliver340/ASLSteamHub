# ASLSteamHub
An ASL dictionary for technical terms.

## Build
Run the following commands:
```
git clone https://github.com/Oliver340/ASLSteamHub.git
cd ASLSteamHub
npm install
```

This will clone the repository and  install all dependencies as per [package.json](./package.json)

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
|`/api/getList`|`token`: __string__<br>`ListID`: __string__|Get the specified list|
|`/api/editList`|`token`: __string__<br>`operation`: __string__<br>`ListID`: __string__<br>`WordID`: __string__<br>`ListName`: __string__|Add a word to a specified list.<br>Delete a word from a specified list.<br>Update list name.<br><br>Valid options for `operation`:<br>`ADD`<br>`DELETE`<br>`UPDATE`
|`/api/addWord`|`token`: __string__<br>`Word`: __string__<br>`PlainDef`: __string__<br>`TechDef`: __string__<br>`VideoLink`: __string__|Add a word to the pending global dictionary|
|`/api/library`||Get all words in the approved global dictionary|
|`/api/admin`|`token`: __string__|Get all pending global words|
|`/api/profile`|`token`: __string__<br>`operation`:__string__|Get or update user profile.<br>Valid options for `operation`:<br>`GET`<br>`UPDATE`|
|`/api/createNewList`|`token`: __string__<br>`ListName`: __string__|Create a new list owned by the logged in user.
|`/api/modifyPendingWord`|`token`: __string__<br>`operation`: __string__<br>`Word`: __string__<br>`PlainDef`: __string__<br>`TechDef`: __string__<br>`VideoLink`: __string__<br>`Status`: __string__<br>`WordID`: __string__|Approve, deny, or update a pending word. User must be an admin to perform this.<br>Valid options for `operation`:<br>`ADD`<br>`DELETE`<br>`UPDATE`|
|`/api/getUserLists`|`token`: __string__|Get all the lists associated with the user.|
|`/api/searchLibrary`|`SearchTerm`: __string__|Gets all words like the search term from the approved global dictionary.|

### What is a __token__?
When a user signs in, they will be granded a temporary token as a [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken). This key lasts for 12 hours in localstorage and contains the user's UserID and Permission level.

This token will automatically get the user's permission level and their UserID for accessing the database. 

## Database

The database for this project is [MariaDB](https://mariadb.com/) which is a MySQL relational database that uses the InnoDB storage engine. 

The database can be accessed through the BCIT Commons panel for the website.

## Schema Format 

Note that Primary keys are generated with the `UUID` function.

### __\[ Table Name \]__

> Basic notes

> \<__PK__\> \[ Primary Keys \]<br>
> \<__FK__\> \[ Foreign Keys \] 
	
|Column Name | DataType | Character Limit or accepted Enums | Additional Notes|
|---|---|---|---|

## Schema

### __\[ Word \]__

> This table stores the necessary information for words added to the website.

> \<__PK__\> \[ WordID \]<br>
> \<__FK__\> \[ UserID \]

|Column Name | DataType | Character Limit or accepted Enums | Additional Notes|
|---|---|---|---|
|WordID 	 | int 	| 32 	| WordID currently auto increments|
|UserID 	 | int 	| 32 	| User who submitted the word|
|Word 	 | varchar 	| 32	| |
|PlainDef | varchar	| 1000	| Plain definition of word|
|TechDef  | varchar	| 1000	| Technical definition of word|
|VideoLink| varchar	| 64	| Video links primarly youtube links|
|Status	 | enum		| 'PENDING', 'APPROVED'|
|DateAdded| datetime| 'YYYY-MM-DD hh:mm:ss'|

### __\[ User \]__

> This table stores the user data of people who create an account.<br>
> User is the default permission level of a recently created account.<br>
> Admin allows the user to view words that are pending and approve them.

> \<__PK__\> \[ UserID \]

|Column Name | DataType | Character Limit or accepted Enums | Additional Notes|
|---|---|---|---|
|UserID 	| int   | 32 | UserID currently auto increments|
|FullName| varchar	| 32 | Name/Username of the account|
|Email 	| varchar	| 32 | Email associated with the account|
|Password| varchar 	| 32 | Password is hashed with bcrypt with a 12 round salt|
|Permissions| enum	| 'USER', 'ADMIN' | Level of access the account has  |

### __\[ List \]__

> This table is used to store lists created by users.

> \<__PK__\> \[ ListID \]<br>
> \<__FK__\> \[ UserID \] 

|Column Name | DataType | Character Limit or accepted Enums | Additional Notes|
|---|---|---|---|
ListID      | int		| 32 | ListID currently auto increments|
UserID      | int 		| 32 | |
ListName    | varchar	| 32 | Name of the list chosen by the user. |
CreationDate| datetime	| 'YYYY-MM-DD hh:mm:ss' | 

### __\[ LinkedList \]__

>This table is used to connect words to lists.<br>
>This is to allow users to have a varible amount of words added to lists.

> \<__PK__\> \[ ListID, WordID \]<br>
> \<__FK__\> \[ ListID, WordID \]

|Column Name | DataType | Character Limit or accepted Enums | Additional Notes|
|---|---|---|---|
ListID | int | 32 | The list selected|
WordID | int | 32 | The Word being added to the list|

## TODOs
- [x] Express routing
- [x] API signup & signin
- [x] List creation
- [x] Admin word verification
- [x] Add a word
- [ ] Add notes / comments
- [ ] External search
- [ ] Game (learning aspect, likely quite in-depth)
- [x] Documentation