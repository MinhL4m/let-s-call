# let's-chat

Description: Message and Video Call Application.

Stack: MERN

## TODO

- Clean up and create document

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

- Reset password: Done

  - Send email with generated link: Done

- Add Friend: Done

  - Using ID

- Unfriend: Done

- Get room: Done

  - Get room belong to user: Only get all room!

- Create room: Done

  - Create room with list of user only: Backend Done
  - Suggest friend appear when type: Done -> will show `username,id`
    - Using rebounce to limit the fetch: Done

- Join room: Done

  - Join room and connect socket to room: Done

- Send and receive message: Done

  - Send and receive message from all user in the room: Done
    - Text: Done
  - Load old messages: Done -> old message old onscroll

- Video call (WebRTC): Only perfect case -> both clients in the room

  - Start call: Done
  - End call: Done

- Notification: Done

  - When receive chat: Done
