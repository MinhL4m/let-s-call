# Frontend

## Dependencies

**socket.io-client**: socket for client side

---

## JWT

- Should be store in LocalStorage: [Here is Why](https://www.reddit.com/r/Frontend/comments/cubcpj/local_storage_vs_cookies_for_auth_tokens/)

- Little trick here is when user login, or validate that user has token, update axios to auto include token in header

```js
axios.defaults.headers.common["Authorization"] = `Basic ${res.data.token}`;
```

---

## Socket

- Connect socket to the domain

```js
const newSocket = io(<Domain>, {
        transports: ["websocket"],
        query: {
          token: localStorage.getItem("CC_Token"),
        },
      });
```

--> Need `transports: ["websocket"]` for cors

- Use `on()` to check for event

- Use `emit()` to emit event
