## Get Started

1. **Install [Node 8](https://nodejs.org)** or newer. Need to run multiple versions of Node? Use [nvm](https://github.com/creationix/nvm)
2. **Navigate to this project's root directory on the command line.**
3. **Install Node Packages.** - `npm install`
4. **Install [React developer tools in Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en) and Eslint, Prettier components for VisualCode.**
5. Having issues? See below.

## Having Issues? Try these things first:

1. Run `npm install` - If you forget to do this, you'll get an error when you try to do `npm start` the app later.
2. Don't run the project from a symbolic link. It will cause issues with file watches.
3. Delete any .eslintrc in your user directory and disable any ESLint plugin / custom rules within your editor since these will conflict with the ESLint rules defined in the course.
4. On Windows? Open your console as an administrator. This will assure the console has the necessary rights to perform installs.
5. Ensure you do not have NODE_ENV=production in your env variables as it will not install the devDependencies. To check run this on the command line: `set NODE_ENV`. If it comes back as production, you need to clear this env variable.
6. Nothing above work? Delete your node_modules folder and re-run npm install.

### Production Dependencies

| **Dependency**                  | **Use**                                                          |
| ------------------------------- | ---------------------------------------------------------------- |
| axios                           | Promise based HTTP client for the browser and node.js            |
| body-parser                     | Node.js body parsing middleware.                                 |
| chalk                           | Terminal string styling.                                         |
| cookie-parser                   | Parse Cookie header and populate req.cookies.                    |
| debug                           | A tiny JavaScript debugging utility.                             |
| ejs                             | Embedded JavaScript templates.                                   |
| express                         | Minimalist web framework for node.                               |
| express-session                 | Simple session middleware for Express.                           |
| morgan                          | HTTP request logger middleware for node.js.                      |
| nodemon                         | Monitor script for use during development of a node.js app.      |




### Development Dependencies

| **Dependency**                  | **Use**                                                          |
| ------------------------------- | ---------------------------------------------------------------- |
| eslint                          | Lints JavaScript                                                 |
| eslint-config-airbnb-base       | Lints configuration with AirBNB integration                      |
| eslint-plugin-import            | Lints plugin                                                     |


#  End points

### Login
```
POST: API_URL/users/login
```
expected body:
```
{
	"username": "lebard504@gmail.com",
	"password": "Tr4nS13N7"
}
```

### List
```
GET: https://3pv1ar9nf6.execute-api.us-east-2.amazonaws.com/dev/users
```