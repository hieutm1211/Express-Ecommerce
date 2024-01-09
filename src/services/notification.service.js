const {
  Notification
} = require("../models/notification.model");

const pushNotificationToSystem = async ({
  type = 'SHOP-001',
  receiverId = 1,
  senderId = 1,
  options = {}
}) => {
  let content;

  if (type === 'SHOP-001') {
    content = `SHOP added a new PRODUCT`;
  } else if (type === 'PROMOTION-001') {
    content = `@ added a new VOUCHER`;
  }

  const notification = await Notification.create({
    noti_type: type,
    noti_content: content,
    noti_senderId: senderId,
    noti_receiverId: receiverId,
    noti_options: options
  });

  return notification;
}

const listNotificationsByUser = async ({
  userId = '1',
  type = 'ALL',
  isRead = 0
}) => {
  const match = {
    noti_receiverId: userId,
  }

  if (type !== 'ALL') {
    match['noti_type'] = type;
  }

  return await Notification.aggregate([{
      $match: match
    },
    {
      $project: {
        noti_type: 1,
        noti_senderId: 1,
        noti_receiverId: 1,
        noti_content: {
          $concat: [{
              $substr: ['$noti_options.shop_name', 0, -1]
            },
            'Added a new product: ',
            {
              $substr: ['$noti_options.product_name', 0, -1]
            }
          ]
        },
        noti_options: 1,
        createdAt: 1
      }
    }
  ])
}

module.exports = {
  pushNotificationToSystem,
  listNotificationsByUser
}