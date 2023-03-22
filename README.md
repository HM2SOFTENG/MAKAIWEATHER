# _Sabio_ Customizations

> Be sure you read this file in its entirety before you think about coding. Much of this should be review, but some of it may not be so be sure you take the time to educate yourself on these important points.

### Naming Conventions

Rules for casing in React Application:

-   React files: Use .jsx extension and use TitleCase
-   JS files: Use .js extension and use camelCase
-   folders in React : all lowercase.
-   css files: all lowercase

## Logging in React

> No more console.log statements

Look at how the `debug` module (aka logger) is implemented by viewing the console. The SabioInit component will help you set up your env/localStorage so that you can see the debug package in action.

The logger will allow you to turn on and off specific logger instances. You do this by specifying what namespaces you want to see. Different namespaces comma separated and can end in wildcards (aka \* )

Any namespace starting with &quot;sabio:Wild\*&quot; such as &quot;sabio:Wildcard&quot; or &quot;sabio:WildBill&quot; or just &quot;sabio:Wild&quot; will be shown.

Follow the instructions provide in the there with the help of the links below to further customize.

Change what is actually seen by changing the localStore key of "debug" to "sabio:\*" (do not use the quotes)

### How to change localStorage by hand

https://stackoverflow.com/questions/9404813/how-to-view-or-edit-localstorage

### Blackboxing the logger scripts

You will need to blackbox a couple of scripts so that the console.log lines show up correctly.
When you have the logs from the debug/logging tool showing, click on the line that shows up to the right side of the console.

Once you open up that code file you will need to black box that file.
You will have to reload and the page and repeat the process for at least 2 times until the line numbers that up on the far right are the line numbers that you are expecting

https://developer.chrome.com/devtools/docs/blackboxing

---

## Compile Errors

This application is much more strict about the development practices you follow. The errors you will encounter will easily be explained with a quick google search.

> :warning: Do not disable these feature locally as the remote server will pick up many of the errors when you commit code.

### Prop-types

Prop types will be enforced. You can read more about them [on github](https://github.com/facebook/prop-types)

---

## The .env.development file

The start up scripts should have created a copy for you to modify and customize with your own user settings.

This file is not going to be pushed to the git server so you can edit freely without affecting other developers.

```
# ------------------------------------------------------------
# These settings are intended to be changed by each developer to customize the
# credentials their logged in user have while they interact with the application
# ------------------------------------------------------------
REACT_APP_TEMP_USER_ID="198"
REACT_APP_TEMP_USER_NAME="SabioFellow"
REACT_APP_TEMP_USER_ROLE="Developer"

# ------------------------------------------------------------
# These settings will probably not need to be managed by each developer differently.
#
# ------------------------------------------------------------
HTTPS=true

# ------------------------------------------------------------
# Api Endpoints
#

# These api endpoints will leverage cross site calls and will only work if CORS is set up correctly
# These are the default setting used by the application.
REACT_APP_API_HOST_PREFIX="https://localhost:50001"
REACT_APP_API_NODE_HOST_PREFIX="http://localhost:8080/node-api"
# To go through proxy put these swap out the last two api vars for these
# REACT_APP_API_HOST_PREFIX=""
# REACT_APP_API_NODE_HOST_PREFIX=""

# Enable for verbose logging from the sabio logging namespacing
REACT_APP_VERBOSE=true

# ------------------------------------------------------------
# Enable Api Endpoints tests at startup. The api's are enabled regardless of these flags
#
REACT_APP_DOT_NET_ENABLED=true
REACT_APP_NODE_ENABLED=true


```

## Code Splitting

We will be lazy loading many modules in the application. You should read about "code splitting" here:

-   https://facebook.github.io/create-react-app/docs/code-splitting
-   https://reactjs.org/docs/code-splitting.html

## Path Alias

Within the application you have a set of "path aliases" set up to make referencing code files in commonly used folder more conveniently.

For example, instead of importing `userService.js` like so

```js
import * as service from './../../../services/userService';
```

you can simply write

```js
import * as service from '@services/userService';
```

These are the following alias in this application:

-   **@services** maps to "./src/services",
-   **@components** maps to "./src/components"

# State Management

The application you are diving into may be using other state management tools and libraries that we have not explored. Here are some simple guidelines to help you work with these.

### Redux

Redux is a global state management library. It allows you to manage state globally so that you do not have to worry about passing state into child components or passing data back up to parents.

The application you jump into may be using redux to manage theme level settings. You should not have to worry about those settings at all.

Learning Redux is a large task. With the wider adoption of React Context and lesser so, other state management libraries we have determined is not the best use of your time while you training with us.

**In short, do not spend any time trying to learn this while you with us. Please ask an instructor if you feel like you need to engage with Redux.**

# Messages to user

### toastr

Working Example in _SabioInit_ Component

We will be using this package to give the user messages or feedback.
https://codeseven.github.io/toastr/demo.html

Other Examples
https://github.com/CodeSeven/toastr#other-options

### sweetalert

We will be using this package to prompt the user to confirm any action that needs confirmation.
https://www.npmjs.com/package/sweetalert

# Additional Services

## lookUpService.js

The lookUpService is used to make calls to bring information stored in the Database in lookup tables. This service will typically be needed to be used when creating forms that use selectors or dropdowns that need to present the information stored in the lookup tables.

Most of our lookup tables will contain 2 columns _Id_ and _Name_. In your .NET Application there is already an API Controller that will get the information for one or _many_ lookup tables in the same request.

-   **LookUp Method**

If you want to get the data from the tables called _StatusTypes_ and _BlogTypes_ you will have to use the **LookUp** method in the service. This is a POST axios call where you need to provide an **array** of string with the names of the tables you are trying to use:

```js
const payload = ['StatusTypes', 'BlogTypes'];

lookUpService.LookUp(payload).then(onLookupSuccess).catch(onLookupError);
```

-   **LookUp3Col Method**

A few of our tables contain 3 columns as the **States** reference table. For this we have a GET axios call to bring the information back. This only brings back one reference table at a time.

If you want to bring the information in the _States_ table:

```js
const tableName = 'States';

lookUpService.LookUp3Col(tableName).then(onLookupSuccess).catch(onLookupError);
```

## dateFormater.js

Most of the time we will get dates from the Database as a string in UTC format such as "2022-11-16 22:54:07.4933333". In the utils folder there is a service for formatting this kind of data. There are many methods you can use to do different operations or present the string in different formats. To use most you will only have to pass the UTC string to the function and you will get back a string with the date formatted according to the method.

    ```js
    let createdBy = "2022-11-16 22:54:07.4933333"

    let formatedDate =  dateFormater.formatDate(createdby)

     //// result for formatedDate would  be "Wed, Nov 16, 2022"
    ```