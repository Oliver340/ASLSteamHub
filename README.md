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

### Note on adding new dependencies to Plesk

Plesk isn't exactly the happiest camper when it comes to adding some new dependencies if you aren't an admin. Some dependencies try to run their own scripts and will directly declare `npm` or `node`, but Plesk uses the full route every time. This breaks these scripts and therefore installation.

The easiest way around that is as follows:

1. Install NodeJS onto a Linux VM. WSL2 is the ideal environment for this. Microsoft has a great WSL tutorial [here](https://docs.microsoft.com/en-us/windows/wsl/install), and NodeJS has installation instructions [here](https://nodejs.org/en/download/package-manager/). If you're using Ubuntu, just run `sudo apt install nodejs` and `sudo apt install npm`.

2. Run `/bin/npm init` in the desired directory. This will create a `package.json`.

3. Install all desired NodeJS packages with `/bin/npm install package-name --save`.

4. Compress the resulting `node-modules` folder to a zip or tarball.

5. Upload the compressed file into your server directory on Plesk. The current directory is `~/server/`. You also might want to consider uploading the resulting `package.json`, but this is not required.

6. Uncompress the file, and your `node-modules` file should be up to date and work.

## Adding New Pages
Express is setup to use the `.pug` template language.
If a page is created using the `.html` extension, using [html-to-pug](https://html-to-pug.com) is likely the easiest way to convert those pages.
Page routes are contained within the [routes folder](./routes/). The basic routing template is as such:
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
|`/api/getList`|`token`: __string__<br>`ListID`: __int__|Get the specified list|
|`/api/editList`|`token`: __string__<br>`operation`: __enum__<br>`ListID`: __int__<br>`WordID`: __int__<br>`ListName`: __string__|Add a word to a specified list.<br>Delete a word from a specified list.<br>Update list name.<br><br>Valid options for `operation`:<br>`ADD`<br>`DELETE`<br>`UPDATE`
|`/api/addWord`|`token`: __string__<br>`Word`: __string__<br>`PlainDef`: __string__<br>`TechDef`: __string__<br>`VideoLink`: __string__|Add a word to the pending global dictionary|
|`/api/library`||Get all words in the approved global dictionary|
|`/api/admin`|`token`: __string__|Get all pending global words|
|`/api/profile`|`token`: __string__<br>`operation`: __enum__|Get or update user profile.<br>Valid options for `operation`:<br>`GET`<br>`UPDATE`|
|`/api/createNewList`|`token`: __string__<br>`ListName`: __string__|Create a new list owned by the logged in user.
|`/api/modifyPendingWord`|`token`: __string__<br>`operation`: __enum__<br>`Word`: __string__<br>`PlainDef`: __string__<br>`TechDef`: __string__<br>`VideoLink`: __string__<br>`Status`: __string__<br>`WordID`: __int__|Approve, deny, or update a pending word. User must be an admin to perform this.<br>Valid options for `operation`:<br>`ADD`<br>`DELETE`<br>`UPDATE`|
|`/api/getUserLists`|`token`: __string__|Get all the lists associated with the user.|
|`/api/searchLibrary`|`SearchTerm`: __string__|Gets all words like the search term from the approved global dictionary.|

### What is a __token__?
When a user signs in, they will be granted a temporary token as a [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken). This key lasts for 12 hours in localstorage and contains the user's UserID and Permission level.

Upon passing a token to the server, the token will be decrypted to get the user's permission level and their UserID for accessing the database. 

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

## HTML Pages

Primary HTML pages are located in the [html](./views/html) folder.

| Page Name | Description |
|---|---|
|[Admin](./views/html/admin.html)|Page that allows the admin to view the pending words that user's have submitted and accept or reject them from the database.|
|[EditList](./views/html/editList.html)|Page where a user can add and remove words from their list and change their list names.|
|[FAQ](./views/html/FAQ.html)|Page that has a couple answers to frequent questions (static page)|
|[Home](./views/html/home.html)|Page that acts as a directory for navigation, there are options to go to the user's list, their settings/profile, the FAQ page and the library page to view all the words in the database.|
|[Library](./views/html/library.html)|Page where it has the list of all the words in the database, you can add them to your list, search for a specific word or add a new word to the database.|
|[Lists](./views/html/lists.html)|Page where it has all your lists and you can edit and send them to other users.|
|[SendList](./views/html/sendList.html)|Page where you can enter information for someone's email and other details and it will send them a list of words for them to view.|
|[Settings](./views/html/settings.html)|Page where you can edit your account information, log out and go to admin view to accept or reject words if you are authorized.|
|[SignIn](./views/html/signIn.html)|Page where can sign in go to create a new account or continue without an account.|
|[SignUp](./views/html/signUp.html)|Page where you can create an account or go to sign in page.|
|[WordSubmission](./views/html/wordSubmission.html)|Page where you can submit words to the dictionary, with details of the term the url to the video of the ASL sign, the scientific definition and the plain definition. They will then be pending and have to be approved by an admin on the admin view.|

Pages will need to be converted to the `.pug` template language and moved into the [views](./views) folder in order for the server to show them to a client. More information is available [here](README#adding-new-pages).

## CSS

CSS is stored [here](./public/css/). Each CSS file has an equivalent HTML file, in addition to the [general css file](./public/css/general.css).

Unique elements use IDs, while elements that may be repeated use Classes. Each ID and Class should be easily marked and the equivalent reference is easy to find within the equivalent HTML file.

## JavaScript

The client end of this project is done using Vanilla JavaScript, and can be found [here](./public/js/). HTML pages that need their own behaviour have their own equivalent `.js` file.

There are some remnants of this project using firebase. These should be considered depricated and invalid as the project is now using MySQL. Anything related to firebase can be safely ignored.

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