const shopModel = require("../models/shop.model");
const bcrypt = require('bcrypt');
const crypto = require('node:crypto');
const {
  KeyTokenService
} = require("./keyToken.service");
const {
  createTokenPair,
  verifyJWT
} = require("../auth/authUtils");
const {
  getInfoData
} = require("../utils");
const {
  BadRequestError,
  AuthFailureError,
  ForbiddenError
} = require("../core/error.response");
const {
  findByEmail
} = require("./shop.service");
const {
  token
} = require("morgan");
const RoleShop = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN',
}

class AccessService {
  static handleRefreshTokenV2 = async ({
    keyStore,
    user,
    refreshToken
  }) => {
    const {
      userId,
      email
    } = user;

    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      await KeyTokenService.deleteKeyById(userId);
      throw new AuthFailureError('Something went wrong, please try again');
    }

    if (keyStore.refreshToken !== refreshToken) {
      throw new AuthFailureError('Shop not registered');
    }

    const foundShop = await findByEmail({
      email
    });

    if (!foundShop) throw new AuthFailureError('Shop not registered');

    const tokens = await createTokenPair({
      userId,
      email
    }, keyStore.publicKey, keyStore.privateKey);

    await keyStore.updateOne({
      $set: {
        refreshToken: tokens.refreshToken
      },
      $addToSet: {
        refreshTokensUsed: refreshToken
      }
    })

    return {
      user,
      tokens
    }
  }


  static handleRefreshToken = async (refreshToken) => {
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken);

    if (foundToken) {
      const {
        userId,
        email
      } = await verifyJWT(refreshToken, foundToken.privateKey);
      console.log({
        userId,
        email
      });

      await KeyTokenService.deleteKeyById(userId);

      throw new ForbiddenError('Something went wrong, please try login again');
    }

    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);

    if (!holderToken) throw AuthFailureError('Shop not registered');

    const {
      userId,
      email
    } = await verifyJWT(refreshToken, holderToken.privateKey);
    const foundShop = await findByEmail({
      email
    });

    if (!foundShop) throw new AuthFailureError('Shop not registered');

    const tokens = await createTokenPair({
      userId,
      email
    }, holderToken.publicKey, holderToken.privateKey);

    await holderToken.updateOne({
      $set: {
        refreshToken: tokens.refreshToken
      },
      $addToSet: {
        refreshTokensUsed: refreshToken
      }
    })

    return {
      user: {
        userId,
        email
      },
      tokens
    }
  }


  static logout = async (keyStore) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);

    return delKey;
  }

  static login = async ({
    email,
    password,
    refreshToken = null
  }) => {
    const foundShop = await findByEmail({
      email
    });

    if (!foundShop) throw new BadRequestError('Shop not registered');

    const match = bcrypt.compare(password, foundShop.password);

    if (!match) throw new AuthFailureError('Authentication error');

    const {
      _id: userId
    } = foundShop;

    const {
      privateKey,
      publicKey
    } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: 'pkcs1',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs1',
        format: 'pem'
      }
    })
    const tokens = await createTokenPair({
      userId,
      email
    }, publicKey, privateKey);

    await KeyTokenService.createKeyToken({
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
      userId
    });

    return {
      shop: getInfoData({
        fields: ['_id', 'name', 'email'],
        object: foundShop
      }),
      tokens
    }
  }

  static signUp = async ({
    name,
    email,
    password
  }) => {
    const holderShop = await shopModel.findOne({
      email
    }).lean();

    if (holderShop) {
      throw new BadRequestError('Shop already exists');
    }

    const passwordHashed = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHashed
    });

    if (newShop) {
      const {
        privateKey,
        publicKey
      } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: 'pkcs1',
          format: 'pem'
        },
        privateKeyEncoding: {
          type: 'pkcs1',
          format: 'pem'
        }
      })

      const publicKeyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey
      });

      if (!publicKeyStore) {
        return {
          message: 'error'
        }
      }

      const tokens = await createTokenPair({
        userId: newShop._id,
        email
      }, publicKey, privateKey);

      return {
        code: 201,
        metadata: {
          shop: getInfoData({
            fields: ['_id', 'name', 'email'],
            object: newShop
          }),
          ...tokens
        }
      }
    }

  }
}

module.exports = AccessService;