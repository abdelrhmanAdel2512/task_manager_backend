'use strict';

/**
 * Standard API success response.
 * Wraps data in the { success, data, message } envelope.
 */
class ApiResponse {
  /**
   * @param {import('express').Response} res
   * @param {number} statusCode  HTTP status code
   * @param {any}    data        Payload
   * @param {string} [message]  Human-readable message
   */
  static send(res, statusCode, data, message = 'Success') {
    return res.status(statusCode).json({
      success: true,
      data,
      message,
    });
  }

  static ok(res, data, message = 'Success') {
    return ApiResponse.send(res, 200, data, message);
  }

  static created(res, data, message = 'Created') {
    return ApiResponse.send(res, 201, data, message);
  }

  static noContent(res) {
    return res.status(204).send();
  }
}

module.exports = ApiResponse;
