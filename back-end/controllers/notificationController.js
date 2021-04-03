const { json } = require("express");
const mongoose = require("mongoose");
const Notification = mongoose.model("Notification");

const subscribe = async (req, res) => {
  const { subscription, userId } = req.body;
  const sub = await Notification.findOne({ user: userId });

  if (sub) {
    const existedEndPoint = sub.subscriptions.find(
      (e) => e.endpoint === subscription.endpoint
    );
    if (!existedEndPoint) {
      await Notification.updateOne(
        { user: userId },
        {
          $addToSet: {
            subscriptions: [
              {
                endpoint: subscription.endpoint,
                keys: subscription.keys,
              },
            ],
          },
        }
      );
    }
  } else {
    const notification = new Notification({
      user: userId,
      subscriptions: [
        {
          endpoint: subscription.endpoint,
          keys: subscription.keys,
        },
      ],
    });
    await notification.save();
  }
  return res.json(true);
};

const unsubscribe = async (req, res) => {
  const { subscription, userId } = req.body;
  const endpoint = subscription?.endpoint;
  await Notification.updateOne(
    { user: userId },
    { $pull: { subscriptions: { endpoint: endpoint } } }
  );
  res.json(true);
};

module.exports = { subscribe, unsubscribe };
