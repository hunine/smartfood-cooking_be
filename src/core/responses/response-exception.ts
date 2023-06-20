// success: true => message, data
// success: false => errorMessage, error

import { Response } from 'express';
import { IResponse } from './response.interface';
import { HttpStatus } from '@nestjs/common';

export class ResponseError implements IResponse {
  message: string;
  data: any[];
  success: boolean;
  status: number;

  constructor(infoMessage: string, data?: any) {
    this.success = false;
    this.message = `${infoMessage}. ${data.message}`;
    this.data = data;
    this.status = data.status;

    console.warn(
      new Date().toString() +
        ' - [Response]: ' +
        infoMessage +
        (data ? ' - ' + JSON.stringify(data) : ''),
    );
  }

  public sendResponse(response: Response) {
    return response.status(this.status).json({
      success: this.success,
      status: this.status,
      message: this.message,
    });
  }
}

export class ResponseSuccess implements IResponse {
  success: boolean;
  message: string;
  data: any[];
  status: number;

  constructor(infoMessage: string, data?: any, notLog = false) {
    this.success = true;
    this.message = infoMessage;

    if (data) {
      this.data = data;
    }

    if (!notLog) {
      try {
        const offuscateRequest = JSON.parse(JSON.stringify(data));
        if (offuscateRequest && offuscateRequest.accessToken)
          offuscateRequest.accessToken = '*******';
        console.log(
          new Date().toString() +
            ' - [Response]: ' +
            JSON.stringify(offuscateRequest),
        );
      } catch (error) {}
    }
  }

  public toOkResponse(response: Response) {
    this.status = HttpStatus.OK;
    return this.sendResponse(response, this.data);
  }

  public toNoContentResponse(response: Response) {
    this.status = HttpStatus.NO_CONTENT;
    return this.sendResponse(response);
  }

  public toCreatedResponse(response: Response) {
    this.status = HttpStatus.CREATED;
    return this.sendResponse(response);
  }

  public sendResponse(response: Response, data?: any) {
    return response.status(this.status).json({
      success: this.success,
      status: this.status,
      message: this.message,
      data: this.data,
    });
  }
}
