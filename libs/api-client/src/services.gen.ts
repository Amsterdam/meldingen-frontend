// This file is auto-generated by @hey-api/openapi-ts

import type { CancelablePromise } from './core/CancelablePromise'
import { OpenAPI } from './core/OpenAPI'
import { request as __request } from './core/request'
import type {
  PostClassificationData,
  PostClassificationResponse,
  GetClassificationData,
  GetClassificationResponse,
  GetClassificationByClassificationIdData,
  GetClassificationByClassificationIdResponse,
  PatchClassificationByClassificationIdData,
  PatchClassificationByClassificationIdResponse,
  DeleteClassificationByClassificationIdData,
  DeleteClassificationByClassificationIdResponse,
  PostMeldingData,
  PostMeldingResponse,
  GetMeldingData,
  GetMeldingResponse,
  GetMeldingByMeldingIdData,
  GetMeldingByMeldingIdResponse,
  PatchMeldingByMeldingIdData,
  PatchMeldingByMeldingIdResponse,
  PutMeldingByMeldingIdAnswerQuestionsData,
  PutMeldingByMeldingIdAnswerQuestionsResponse,
  PutMeldingByMeldingIdProcessData,
  PutMeldingByMeldingIdProcessResponse,
  PutMeldingByMeldingIdCompleteData,
  PutMeldingByMeldingIdCompleteResponse,
  PostMeldingByMeldingIdQuestionByQuestionIdData,
  PostMeldingByMeldingIdQuestionByQuestionIdResponse,
  PostUserData,
  PostUserResponse,
  GetUserData,
  GetUserResponse,
  GetUserByUserIdData,
  GetUserByUserIdResponse,
  DeleteUserByUserIdData,
  DeleteUserByUserIdResponse,
  PatchUserByUserIdData,
  PatchUserByUserIdResponse,
  GetFormPrimaryResponse,
  PutFormPrimaryData,
  PutFormPrimaryResponse,
  GetFormData,
  GetFormResponse,
  PostFormData,
  PostFormResponse,
  GetFormByFormIdData,
  GetFormByFormIdResponse,
  PutFormByFormIdData,
  PutFormByFormIdResponse,
  DeleteFormByFormIdData,
  DeleteFormByFormIdResponse,
  GetFormClassificationByClassificationIdData,
  GetFormClassificationByClassificationIdResponse,
} from './types.gen'

/**
 * Classification:Create
 * @param data The data for the request.
 * @param data.requestBody
 * @returns ClassificationOutput Successful Response
 * @throws ApiError
 */
export const postClassification = (data: PostClassificationData): CancelablePromise<PostClassificationResponse> => __request(OpenAPI, {
    method: 'POST',
    url: '/classification/',
    body: data.requestBody,
    mediaType: 'application/json',
    errors: {
      401: 'Unauthorized, perhaps the token was invalid or expired, or the user could not be found.',
      409: 'Conflict, a uniqueness error occurred',
      422: 'Validation Error',
    },
  })

/**
 * Classification:List
 * @param data The data for the request.
 * @param data.limit
 * @param data.offset
 * @param data.sort
 * @returns ClassificationOutput Successful Response
 * @throws ApiError
 */
export const getClassification = (data: GetClassificationData = {}): CancelablePromise<GetClassificationResponse> => __request(OpenAPI, {
    method: 'GET',
    url: '/classification/',
    query: {
      limit: data.limit,
      offset: data.offset,
      sort: data.sort,
    },
    errors: {
      401: 'Unauthorized, perhaps the token was invalid or expired, or the user could not be found.',
      422: 'Validation Error',
    },
  })

/**
 * Classification:Retrieve
 * @param data The data for the request.
 * @param data.classificationId The classification id.
 * @returns ClassificationOutput Successful Response
 * @throws ApiError
 */
export const getClassificationByClassificationId = (
  data: GetClassificationByClassificationIdData,
): CancelablePromise<GetClassificationByClassificationIdResponse> => __request(OpenAPI, {
    method: 'GET',
    url: '/classification/{classification_id}',
    path: {
      classification_id: data.classificationId,
    },
    errors: {
      401: 'Unauthorized, perhaps the token was invalid or expired, or the user could not be found.',
      404: 'Not Found',
      422: 'Validation Error',
    },
  })

/**
 * Classification:Update
 * @param data The data for the request.
 * @param data.classificationId The classification id.
 * @param data.requestBody
 * @returns ClassificationOutput Successful Response
 * @throws ApiError
 */
export const patchClassificationByClassificationId = (
  data: PatchClassificationByClassificationIdData,
): CancelablePromise<PatchClassificationByClassificationIdResponse> => __request(OpenAPI, {
    method: 'PATCH',
    url: '/classification/{classification_id}',
    path: {
      classification_id: data.classificationId,
    },
    body: data.requestBody,
    mediaType: 'application/json',
    errors: {
      401: 'Unauthorized, perhaps the token was invalid or expired, or the user could not be found.',
      404: 'Not Found',
      409: 'Conflict, a uniqueness error occurred',
      422: 'Validation Error',
    },
  })

/**
 * Classification:Delete
 * @param data The data for the request.
 * @param data.classificationId The classification id.
 * @returns void Successful Response
 * @throws ApiError
 */
export const deleteClassificationByClassificationId = (
  data: DeleteClassificationByClassificationIdData,
): CancelablePromise<DeleteClassificationByClassificationIdResponse> => __request(OpenAPI, {
    method: 'DELETE',
    url: '/classification/{classification_id}',
    path: {
      classification_id: data.classificationId,
    },
    errors: {
      401: 'Unauthorized, perhaps the token was invalid or expired, or the user could not be found.',
      404: 'Not Found',
      422: 'Validation Error',
    },
  })

/**
 * Melding:Create
 * @param data The data for the request.
 * @param data.requestBody
 * @returns MeldingCreateOutput Successful Response
 * @throws ApiError
 */
export const postMelding = (data: PostMeldingData): CancelablePromise<PostMeldingResponse> => __request(OpenAPI, {
    method: 'POST',
    url: '/melding/',
    body: data.requestBody,
    mediaType: 'application/json',
    errors: {
      422: 'Validation Error',
    },
  })

/**
 * Melding:List
 * @param data The data for the request.
 * @param data.limit
 * @param data.offset
 * @param data.sort
 * @returns MeldingOutput Successful Response
 * @throws ApiError
 */
export const getMelding = (data: GetMeldingData = {}): CancelablePromise<GetMeldingResponse> => __request(OpenAPI, {
    method: 'GET',
    url: '/melding/',
    query: {
      limit: data.limit,
      offset: data.offset,
      sort: data.sort,
    },
    errors: {
      401: 'Unauthorized, perhaps the token was invalid or expired, or the user could not be found.',
      422: 'Validation Error',
    },
  })

/**
 * Melding:Retrieve
 * @param data The data for the request.
 * @param data.meldingId The id of the melding.
 * @returns MeldingOutput Successful Response
 * @throws ApiError
 */
export const getMeldingByMeldingId = (
  data: GetMeldingByMeldingIdData,
): CancelablePromise<GetMeldingByMeldingIdResponse> => __request(OpenAPI, {
    method: 'GET',
    url: '/melding/{melding_id}',
    path: {
      melding_id: data.meldingId,
    },
    errors: {
      401: 'Unauthorized, perhaps the token was invalid or expired, or the user could not be found.',
      404: 'Not Found',
      422: 'Validation Error',
    },
  })

/**
 * Melding:Update
 * @param data The data for the request.
 * @param data.meldingId The id of the melding.
 * @param data.token The token of the melding.
 * @param data.requestBody
 * @returns MeldingOutput Successful Response
 * @throws ApiError
 */
export const patchMeldingByMeldingId = (
  data: PatchMeldingByMeldingIdData,
): CancelablePromise<PatchMeldingByMeldingIdResponse> => __request(OpenAPI, {
    method: 'PATCH',
    url: '/melding/{melding_id}',
    path: {
      melding_id: data.meldingId,
    },
    query: {
      token: data.token,
    },
    body: data.requestBody,
    mediaType: 'application/json',
    errors: {
      401: 'Unauthorized, perhaps the token was invalid or expired, or the user could not be found.',
      404: 'Not Found',
      422: 'Validation Error',
    },
  })

/**
 * Melding:Answer Questions
 * @param data The data for the request.
 * @param data.meldingId The id of the melding.
 * @param data.token The token of the melding.
 * @returns MeldingOutput Successful Response
 * @throws ApiError
 */
export const putMeldingByMeldingIdAnswerQuestions = (
  data: PutMeldingByMeldingIdAnswerQuestionsData,
): CancelablePromise<PutMeldingByMeldingIdAnswerQuestionsResponse> => __request(OpenAPI, {
    method: 'PUT',
    url: '/melding/{melding_id}/answer_questions',
    path: {
      melding_id: data.meldingId,
    },
    query: {
      token: data.token,
    },
    errors: {
      400: 'Transition not allowed from current state',
      401: 'Unauthorized, perhaps the token was invalid or expired, or the user could not be found.',
      404: 'Not Found',
      default: 'Unexpected error',
    },
  })

/**
 * Melding:Process
 * @param data The data for the request.
 * @param data.meldingId The id of the melding.
 * @returns MeldingOutput Successful Response
 * @throws ApiError
 */
export const putMeldingByMeldingIdProcess = (
  data: PutMeldingByMeldingIdProcessData,
): CancelablePromise<PutMeldingByMeldingIdProcessResponse> => __request(OpenAPI, {
    method: 'PUT',
    url: '/melding/{melding_id}/process',
    path: {
      melding_id: data.meldingId,
    },
    errors: {
      400: 'Transition not allowed from current state',
      401: 'Unauthorized, perhaps the token was invalid or expired, or the user could not be found.',
      404: 'Not Found',
      default: 'Unexpected error',
    },
  })

/**
 * Melding:Complete
 * @param data The data for the request.
 * @param data.meldingId The id of the melding.
 * @returns MeldingOutput Successful Response
 * @throws ApiError
 */
export const putMeldingByMeldingIdComplete = (
  data: PutMeldingByMeldingIdCompleteData,
): CancelablePromise<PutMeldingByMeldingIdCompleteResponse> => __request(OpenAPI, {
    method: 'PUT',
    url: '/melding/{melding_id}/complete',
    path: {
      melding_id: data.meldingId,
    },
    errors: {
      400: 'Transition not allowed from current state',
      401: 'Unauthorized, perhaps the token was invalid or expired, or the user could not be found.',
      404: 'Not Found',
      default: 'Unexpected error',
    },
  })

/**
 * Melding:Answer-Question
 * @param data The data for the request.
 * @param data.meldingId The id of the melding.
 * @param data.questionId The id of the question.
 * @param data.token The token of the melding.
 * @param data.requestBody
 * @returns AnswerOutput Successful Response
 * @throws ApiError
 */
export const postMeldingByMeldingIdQuestionByQuestionId = (
  data: PostMeldingByMeldingIdQuestionByQuestionIdData,
): CancelablePromise<PostMeldingByMeldingIdQuestionByQuestionIdResponse> => __request(OpenAPI, {
    method: 'POST',
    url: '/melding/{melding_id}/question/{question_id}',
    path: {
      melding_id: data.meldingId,
      question_id: data.questionId,
    },
    query: {
      token: data.token,
    },
    body: data.requestBody,
    mediaType: 'application/json',
    errors: {
      400: 'Bad Request',
      401: 'Unauthorized, perhaps the token was invalid or expired, or the user could not be found.',
      404: 'Not Found',
      default: 'Unexpected error',
    },
  })

/**
 * User:Create
 * @param data The data for the request.
 * @param data.requestBody
 * @returns UserOutput Successful Response
 * @throws ApiError
 */
export const postUser = (data: PostUserData): CancelablePromise<PostUserResponse> => __request(OpenAPI, {
    method: 'POST',
    url: '/user/',
    body: data.requestBody,
    mediaType: 'application/json',
    errors: {
      401: 'Unauthorized, perhaps the token was invalid or expired, or the user could not be found.',
      409: 'Conflict, a uniqueness error occurred',
      422: 'Validation Error',
    },
  })

/**
 * User:List
 * @param data The data for the request.
 * @param data.limit
 * @param data.offset
 * @param data.sort
 * @returns UserOutput Successful Response
 * @throws ApiError
 */
export const getUser = (data: GetUserData = {}): CancelablePromise<GetUserResponse> => __request(OpenAPI, {
    method: 'GET',
    url: '/user/',
    query: {
      limit: data.limit,
      offset: data.offset,
      sort: data.sort,
    },
    errors: {
      401: 'Unauthorized, perhaps the token was invalid or expired, or the user could not be found.',
      422: 'Validation Error',
    },
  })

/**
 * User:Retrieve
 * @param data The data for the request.
 * @param data.userId The id of the user.
 * @returns UserOutput Successful Response
 * @throws ApiError
 */
export const getUserByUserId = (data: GetUserByUserIdData): CancelablePromise<GetUserByUserIdResponse> => __request(OpenAPI, {
    method: 'GET',
    url: '/user/{user_id}',
    path: {
      user_id: data.userId,
    },
    errors: {
      401: 'Unauthorized, perhaps the token was invalid or expired, or the user could not be found.',
      404: 'Not Found',
      422: 'Validation Error',
    },
  })

/**
 * User:Delete
 * @param data The data for the request.
 * @param data.userId The id of the user.
 * @returns void Successful Response
 * @throws ApiError
 */
export const deleteUserByUserId = (data: DeleteUserByUserIdData): CancelablePromise<DeleteUserByUserIdResponse> => __request(OpenAPI, {
    method: 'DELETE',
    url: '/user/{user_id}',
    path: {
      user_id: data.userId,
    },
    errors: {
      400: 'Delete own account',
      401: 'Unauthorized, perhaps the token was invalid or expired, or the user could not be found.',
      404: 'Not Found',
      422: 'Validation Error',
    },
  })

/**
 * User:Update
 * @param data The data for the request.
 * @param data.userId The id of the user.
 * @param data.requestBody
 * @returns UserOutput Successful Response
 * @throws ApiError
 */
export const patchUserByUserId = (data: PatchUserByUserIdData): CancelablePromise<PatchUserByUserIdResponse> => __request(OpenAPI, {
    method: 'PATCH',
    url: '/user/{user_id}',
    path: {
      user_id: data.userId,
    },
    body: data.requestBody,
    mediaType: 'application/json',
    errors: {
      401: 'Unauthorized, perhaps the token was invalid or expired, or the user could not be found.',
      404: 'Not Found',
      409: 'Conflict, a uniqueness error occurred',
      422: 'Validation Error',
    },
  })

/**
 * Primary-Form:Retrieve
 * The primary form that is used to initiate the creation of a "Melding".
 * @returns PrimaryFormOutput Successful Response
 * @throws ApiError
 */
export const getFormPrimary = (): CancelablePromise<GetFormPrimaryResponse> => __request(OpenAPI, {
    method: 'GET',
    url: '/form/primary/',
    errors: {
      404: 'Not Found',
    },
  })

/**
 * Primary-Form:Update
 * Update the primary form that is used to initiate the creation of a "Melding".
 * @param data The data for the request.
 * @param data.requestBody
 * @returns PrimaryFormOutput Successful Response
 * @throws ApiError
 */
export const putFormPrimary = (data: PutFormPrimaryData): CancelablePromise<PutFormPrimaryResponse> => __request(OpenAPI, {
    method: 'PUT',
    url: '/form/primary/',
    body: data.requestBody,
    mediaType: 'application/json',
    errors: {
      401: 'Unauthorized, perhaps the token was invalid or expired, or the user could not be found.',
      404: 'Not Found',
      422: 'Validation Error',
    },
  })

/**
 * Form:List
 * @param data The data for the request.
 * @param data.limit
 * @param data.offset
 * @param data.sort
 * @returns FormOnlyOutput Successful Response
 * @throws ApiError
 */
export const getForm = (data: GetFormData = {}): CancelablePromise<GetFormResponse> => __request(OpenAPI, {
    method: 'GET',
    url: '/form/',
    query: {
      limit: data.limit,
      offset: data.offset,
      sort: data.sort,
    },
    errors: {
      401: 'Unauthorized, perhaps the token was invalid or expired, or the user could not be found.',
      422: 'Validation Error',
    },
  })

/**
 * Form:Create
 * @param data The data for the request.
 * @param data.requestBody
 * @returns FormOutput Successful Response
 * @throws ApiError
 */
export const postForm = (data: PostFormData): CancelablePromise<PostFormResponse> => __request(OpenAPI, {
    method: 'POST',
    url: '/form/',
    body: data.requestBody,
    mediaType: 'application/json',
    errors: {
      400: 'Providing a classification id that does not exist',
      401: 'Unauthorized, perhaps the token was invalid or expired, or the user could not be found.',
      422: 'Validation Error',
    },
  })

/**
 * Form:Retrieve
 * @param data The data for the request.
 * @param data.formId The id of the form.
 * @returns FormOutput Successful Response
 * @throws ApiError
 */
export const getFormByFormId = (data: GetFormByFormIdData): CancelablePromise<GetFormByFormIdResponse> => __request(OpenAPI, {
    method: 'GET',
    url: '/form/{form_id}',
    path: {
      form_id: data.formId,
    },
    errors: {
      404: 'Not Found',
      422: 'Validation Error',
    },
  })

/**
 * Form:Update
 * @param data The data for the request.
 * @param data.formId The id of the form.
 * @param data.requestBody
 * @returns FormOutput Successful Response
 * @throws ApiError
 */
export const putFormByFormId = (data: PutFormByFormIdData): CancelablePromise<PutFormByFormIdResponse> => __request(OpenAPI, {
    method: 'PUT',
    url: '/form/{form_id}',
    path: {
      form_id: data.formId,
    },
    body: data.requestBody,
    mediaType: 'application/json',
    errors: {
      400: 'Providing a classification id that does not exist',
      401: 'Unauthorized, perhaps the token was invalid or expired, or the user could not be found.',
      404: 'Not Found',
      422: 'Validation Error',
    },
  })

/**
 * Form:Delete
 * @param data The data for the request.
 * @param data.formId The id of the form.
 * @returns void Successful Response
 * @throws ApiError
 */
export const deleteFormByFormId = (data: DeleteFormByFormIdData): CancelablePromise<DeleteFormByFormIdResponse> => __request(OpenAPI, {
    method: 'DELETE',
    url: '/form/{form_id}',
    path: {
      form_id: data.formId,
    },
    errors: {
      401: 'Unauthorized, perhaps the token was invalid or expired, or the user could not be found.',
      404: 'Not Found',
      422: 'Validation Error',
    },
  })

/**
 * Form:Classification
 * @param data The data for the request.
 * @param data.classificationId The id of the classification that the form belongs to.
 * @returns FormOutput Successful Response
 * @throws ApiError
 */
export const getFormClassificationByClassificationId = (
  data: GetFormClassificationByClassificationIdData,
): CancelablePromise<GetFormClassificationByClassificationIdResponse> => __request(OpenAPI, {
    method: 'GET',
    url: '/form/classification/{classification_id}',
    path: {
      classification_id: data.classificationId,
    },
    errors: {
      404: 'Not Found',
      422: 'Validation Error',
    },
  })