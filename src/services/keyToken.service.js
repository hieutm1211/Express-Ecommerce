'use strict';

const keytokenModel = require("../models/keytoken.model");

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken = null
  }) => {
    try {
      const filters = {
          user: userId
        },
        update = {
          publicKey,
          privateKey,
          refreshTokensUsed: [],
          refreshToken
        },
        options = {
          upsert: true,
          new: true
        };

      const tokens = await keytokenModel.findOneAndUpdate(filters, update, options);

      return tokens.publicKey || null;
    } catch (error) {
      return error;
    }
  }

  static findByUserId = async (userId) => {
    return await keytokenModel.findOne({
      user: userId
    });
  }

  static removeKeyById = async (id) => {
    return await keytokenModel.deleteOne(id);
  }

  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keytokenModel.findOne({
      refreshTokensUsed: refreshToken
    }).lean();
  }

  static findByRefreshToken = async (refreshToken) => {
    return await keytokenModel.findOne({
      refreshToken
    });
  }

  static deleteKeyById = async (userId) => {
    return await keytokenModel.deleteOne({
      user: userId
    });
  }
}

module.exports = {
  KeyTokenService,
}