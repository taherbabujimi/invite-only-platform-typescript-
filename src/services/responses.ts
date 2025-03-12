import { Response } from "express";

interface ResponseMeta {
  code: number;
  message: string;
  [key: string]: any;
}

interface ResponseData<T> {
  data: T;
  meta: ResponseMeta;
}

export const successResponseData = <T>(
  res: Response,
  data: T,
  code = 1,
  message: string,
  extras?: Record<string, any>
): Response => {
  const response: ResponseData<T> = {
    data,
    meta: {
      code,
      message,
    },
  };
  if (extras) {
    Object.keys(extras).forEach((key) => {
      if ({}.hasOwnProperty.call(extras, key)) {
        response.meta[key] = extras[key];
      }
    });
  }

  return res.send(response);
};

export const successResponseWithoutData = (
  res: Response,
  message: string,
  code = 1
) => {
  const response = {
    data: null,
    meta: {
      code,
      message,
    },
  };
  return res.send(response);
};

export const errorResponseWithoutData = (
  res: Response,
  message: string,
  code = 0,
  metaData = {}
) => {
  const response = {
    data: null,
    meta: {
      code,
      message,
      ...metaData,
    },
  };
  return res.status(code).send(response);
};

export const errorResponseData = (
  res: Response,
  message: string,
  data: object,
  code = 400
) => {
  const response = {
    code,
    message,
    data,
  };
  return res.status(code).send(response);
};

export const validationErrorResponseData = (
  res: Response,
  message: string,
  code = 400
) => {
  const response = {
    code,
    message,
  };
  return res.status(code).send(response);
};
