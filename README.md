# let's-chat

Description: Message and Video Call Application.

Stack: MERN

## TODO

### Front-end

- Implement forgetPasswordPage()

### Back-end

- Implement forgetPassword()

## Features

- Create account:

  - Hashed password: SHA256. Done
  - 0Auth: maybe??

- Update account: Not implement

  - Change Avatar(Firebase storage??):
  - Change password:

- Login:

  - Email and Password: Done
  - JWT: store JWT in localstorage.
  - Backend check for JWT using `auth` middleware: Done
  - Refresh Token: maybe??

- Logout: Not implemnt

  - Remove JWT in storage
  - remove user state in front end

- Reset password (Consider)[https://blog.logrocket.com/implementing-a-secure-password-reset-in-node-js/]

  - Send email with generated link: Not implement

- Add Friend: Done backend

  - Using ID

- Unfriend: Done backend

- Get room:

  - Get room belong to user: Only get all room!
  - Update when receive new chat

- Create room:

  - Create room with list of user only: Only create room with name and anyone can join
  - Suggest friend appear when type:
    - Using rebounce to limit the fetch

- Join room:

  - Join room and connect socket to room: Done

- Send and receive message:

  - Send and receive message from all user in the room: Done
    - Text: Done
    - Image + file: Firebase Storage are incosideration
  - Load old file: Not implement

- Video call (WebRTC):

  - Mute:
  - Turn off camera:
  - Join Call:
  - Start call:
  - End call:

- Notification: (Consider)[https://medium.com/@seladir/how-to-implement-web-push-notifications-in-your-node-react-app-9bed79b53f34]:

  - When receive chat
  - When receive call

- Live Stream (RTMP) (Consider)[https://quantizd.com/building-live-streaming-app-with-node-js-and-react/]: Thinking of implemtn

- Watch Youtube together (react-youtube): Still consider.
