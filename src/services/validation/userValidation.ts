"use strict";

const Joi = require("joi");
const { errorResponseData } = require("../responses");
const { messages } = require("../messages");
import { Response } from "express";

export const userLoginSchema = (body: Object, res: Response) => {
  const Schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(3).max(30),
  });

  const validationResult = Schema.validate(body);

  if (validationResult.error) {
    return errorResponseData(
      res,
      messages.errorValidatingValues,
      validationResult.error.details
    );
  } else {
    return false;
  }
};

export const sendInviteSchema = (body: Object, res: Response) => {
  const Schema = Joi.object({
    recieverEmail: Joi.string().required().email(),
  });

  const validationResult = Schema.validate(body);

  if (validationResult.error) {
    return errorResponseData(
      res,
      messages.errorValidatingValues,
      validationResult.error.details
    );
  } else {
    return false;
  }
};

export const addUserSchema = (body: Object, res: Response) => {
  const Schema = Joi.object({
    username: Joi.string().required().max(30).min(3),
    password: Joi.string().required().max(30).min(3),
  });

  const validationResult = Schema.validate(body);

  if (validationResult.error) {
    return errorResponseData(
      res,
      messages.errorValidatingValues,
      validationResult.error.details
    );
  } else {
    return false;
  }
};

export const changePasswordSchema = (body: Object, res: Response) => {
  const Schema = Joi.object({
    oldPassword: Joi.string().required().max(30).min(3),
    newPassword: Joi.string().required().max(30).min(3),
  });

  const validationResult = Schema.validate(body);

  if (validationResult.error) {
    return errorResponseData(
      res,
      messages.errorValidatingValues,
      validationResult.error.details
    );
  } else {
    return false;
  }
};

export const forgotPasswordSchema = (body: Object, res: Response) => {
  const Schema = Joi.object({
    email: Joi.string().required().email(),
  });

  const validationResult = Schema.validate(body);

  if (validationResult.error) {
    return errorResponseData(
      res,
      messages.errorValidatingValues,
      validationResult.error.details
    );
  } else {
    return false;
  }
};

export const resetPasswordSchema = (body: Object, res: Response) => {
  const Schema = Joi.object({
    newPassword: Joi.string().required().max(30).min(3),
  });

  const validationResult = Schema.validate(body);

  if (validationResult.error) {
    return errorResponseData(
      res,
      messages.errorValidatingValues,
      validationResult.error.details
    );
  } else {
    return false;
  }
};
