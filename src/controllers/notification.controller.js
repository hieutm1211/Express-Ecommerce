'use strict';

const { SuccessResponse } = require("../core/success.response");
const { listNotificationsByUser } = require("../services/notification.service");

class NotificationController {
  listNotificationByUser = async (req, res, next) => {
    new SuccessResponse({
      message: 'Code created',
      metadata: await listNotificationsByUser(req.body)
    }).send(res);
  }
}

module.exports = new NotificationController();