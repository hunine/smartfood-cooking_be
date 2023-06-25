import _ from 'lodash';
import axios from 'axios';
import { RECOMMENDER_SERVICE } from '@config/env';

export class HttpHelper {
  static async get(url, headers, options) {
    const res = await send(url, 'GET', headers, undefined, options);
    return res;
  }

  static async post(url, body, headers, options) {
    const res = await send(url, 'POST', headers, body, options);
    return res;
  }

  static async put(url, body, headers, options) {
    const res = await send(url, 'PUT', headers, body, options);
    return res;
  }

  static async delete(url, headers, options) {
    const res = await send(url, 'DELETE', headers, undefined, options);
    return res;
  }

  static async send(url, method, headers, body, options) {
    const res = await send(url, method, headers, body, options);
    return res;
  }

  static async options(options) {
    const res = await send(undefined, undefined, undefined, undefined, options);
    return res;
  }
}

function send(url, method, headers, body, options) {
  return new Promise((resolve, reject) => {
    headers = initAuthorizationHeaders(headers);
    let newOption = {
      url,
      method,
      headers,
      data: body,
    };
    if (options) newOption = Object.assign({}, newOption, options);

    axios(newOption)
      .then((response) => {
        return resolve(response);
      })
      .catch((err) => {
        return reject(err);
      });
  });
}

function initAuthorizationHeaders(headers) {
  if (headers) {
    headers.authorization = RECOMMENDER_SERVICE.API_KEY;
  } else {
    headers = {
      authorization: RECOMMENDER_SERVICE.API_KEY,
    };
  }
  return headers;
}
