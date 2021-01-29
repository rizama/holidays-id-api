const fs = require('fs');
const request = require('request');
const axios = require('axios');

exports.sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

exports.readfile = async (directory) => new Promise((resolve, reject) => {
  try {
    resolve(fs.readFileSync(directory, 'utf8'));
  } catch (error) {
    reject(error);
  }
});

exports.writefile = async (path, data) => new Promise((resolve, reject) => {
  try {
    resolve(fs.writeFileSync(path, data));
  } catch (error) {
    reject(error);
  }
});

exports.appendfile = async (path, data) => new Promise((resolve, reject) => {
  try {
    resolve(fs.appendFileSync(path, data));
  } catch (error) {
    reject(error);
  }
});

exports.removeEmptyOrNull = (array) => {
  const result = array.filter((el) => el != null);

  return result;
};

exports.requestPost = (url, data) => {
  const options = {
    method: 'POST',
    url,
    timeout: 30000,
    json: true,
    body: data,
    headers: {
      'Content-type': 'application/json',
      Accept: '*/*'
    }
  };

  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if (error) {
        reject(error);
      }
      resolve(body);
    });
  });
};

exports.requestGet = (url) => {
  const options = {
    method: 'GET',
    url,
    timeout: 30000,
    json: true
  };

  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if (error) {
        reject(error);
      }
      resolve(body);
    });
  });
};

exports.axiosGet = async (url) => {
  const options = {
    url,
    method: 'GET',
    timeout: 30000
  };
  try {
    const response = await axios(options);
    const result = {
      status: response.status,
      data: response.data
    };
    return (result);
  } catch (error) {
    return (error);
  }
};

exports.axiosPost = async (url, body) => {
  const options = {
    url,
    method: 'POST',
    timeout: 30000,
    data: body
  };
  try {
    const response = await axios(options);
    const result = {
      status: response.status,
      data: response.data
    };
    return (result);
  } catch (error) {
    return (error);
  }
};
