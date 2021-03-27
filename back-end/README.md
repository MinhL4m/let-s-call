# Backend

## Dependencies

**cookie-parser**(middleware): Parse Cookie header and populate req.cookies with an object keyed by the cookie names.
**crypto**: Used in Hashing Password
**dotenv**: Used to get env variables
**jwt-then**: Used for create jwt
**mongoose**: Connect to MongoDB
**morgan**: HTTP request logger middleware for node.js

---

## JWT

- Login -> Generate JWT token using id and SECRET String

```js
const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET);
```

- Return this token -> Front-end store this token in cookie

- Create `auth` (middleware/auth.js) middle that will check jwt when user try to access protected route.

- Add `auth` middleware for protected route

```js
const auth = require("../middlewares/auth");

// before user can get to createChatroom, it need to pass the middleware auth
router.post("/", auth, catchErrors(createChatroom));
```

---

## Catch Error (handlers/errorHandler.js)

**catchError**: receive a route. If that route throught any error, this function will catch it. If the error type is not String which dev manually throw, then pass it to next middleware.

Others Middleware will catch other type of error

---

## Socket

- [Learn more about socket](https://stackabuse.com/node-js-websocket-examples-with-socket-io/)

