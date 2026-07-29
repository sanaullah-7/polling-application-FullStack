import Notification from "../models/Notifications.js";

export const notify = async ({ user, actor, type, poll }) => {
  try {
    await Notification.create({ user, actor, type, poll });
  } catch {
    // ignore duplicate or validation errors
  }
};

export const getNotifications = async (req, res) => {
  try {
    const items = await Notification.find({ user: req.userId })
      .populate("actor", "name username avatar")
      .populate("poll", "question")
      .sort({ createdAt: -1 })
      .limit(20);

    const unread = await Notification.countDocuments({
      user: req.userId,
      read: false,
    });

    return res.json({ items, unread });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const markRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.userId, read: false },
      { read: true },
    );
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
