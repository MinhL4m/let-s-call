import axios from "axios";
const convertedVapidKey = urlBase64ToUint8Array(
  process.env.REACT_APP_PUBLIC_VAPID_KEY
);

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  // eslint-disable-next-line
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function sendSubscription(subscription, userId) {
  axios.post("http://localhost:3001/notification/subscribe", {
    subscription,
    userId,
  });
}

function sendUnSubscription(subscription, userId) {
  axios.put("http://localhost:3001/notification/unsubscribe", {
    subscription,
    userId,
  });
}

export function subscribeUser(userId) {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready
      .then(function (registration) {
        console.log("serviceWorker");
        if (!registration.pushManager) {
          console.log("Push manager unavailable.");
          return;
        }
        registration.pushManager
          .getSubscription()
          .then(function (existedSubscription) {
            if (existedSubscription === null) {
              console.log("No subscription detected, make a request.");
              registration.pushManager
                .subscribe({
                  applicationServerKey: convertedVapidKey,
                  userVisibleOnly: true,
                })
                .then(function (newSubscription) {
                  sendSubscription(newSubscription, userId);
                })
                .catch(function (e) {
                  if (Notification.permission !== "granted") {
                  } else {
                  }
                });
            } else {
              sendSubscription(existedSubscription, userId);
            }
          });
      })
      .catch(function (e) {
        console.error(
          "An error ocurred during Service Worker registration.",
          e
        );
      });
  }
}

export function unsubscribeUser(userId) {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready
      .then(function (registration) {
        console.log("serviceWorker");
        if (!registration.pushManager) {
          console.log("Push manager unavailable.");
          return;
        }
        registration.pushManager
          .getSubscription()
          .then(function (existedSubscription) {
            if (existedSubscription) {
              sendUnSubscription(existedSubscription, userId);
            }
          });
      })
      .catch(function (e) {
        console.error(
          "An error ocurred during Service Worker registration.",
          e
        );
      });
  }
}
