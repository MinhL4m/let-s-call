# let's-chat

Description: Message and Video Call Application.

Stack: MERN

## TODO

### Front-end

- Implement Add friend + create Room

### Back-end

- Done most cases

## Features

- Create account:

  - Hashed password: SHA256. Done

- Update account: Not implement

  - Change password:

- Login:

  - Email and Password: Done
  - JWT: store JWT in localstorage.
  - Backend check for JWT using `auth` middleware: Done

- Logout: Done

  - Remove JWT in storage
  - remove user state in front end
  - Move user in this device from notification list

- Reset password:

  - Send email with generated link: Done

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
  - Load old messages: Done -> old message old onscroll

- Video call (WebRTC): Only perfect case -> both clients in the room

  - Start call: Done
  - End call: Done

- Notification:

  - When receive chat: Done
