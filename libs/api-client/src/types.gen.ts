// This file is auto-generated by @hey-api/openapi-ts

export type AnswerInput = {
    text: string;
};

export type AnswerOutput = {
    id: number;
    created_at: string;
    updated_at: string;
};

export type ClassificationInput = {
    name: string;
};

export type ClassificationOutput = {
    name: string;
    id: number;
    created_at: string;
    updated_at: string;
    form?: number | null;
};

export type FormComponentInput = {
    label: string;
    description: string | null;
    key: string;
    type?: FormIoComponentTypeEnum;
    input: boolean;
    autoExpand: boolean;
    showCharCount: boolean;
};

export type FormComponentOutput = {
    label: string;
    description: string;
    key: string;
    type: string;
    input: boolean;
    autoExpand: boolean;
    showCharCount: boolean;
    position: number;
    question?: number | null;
};

export type FormInput = {
    title: string;
    display: FormIoFormDisplayEnum;
    components: Array<(FormPanelComponentInput | FormComponentInput)>;
    classification?: number | null;
};

/**
 * The value of the type field
 */
export type FormIoComponentTypeEnum = 'panel' | 'textarea';

/**
 * The value of the display field on the form can be one of the following:
 * - form
 * - wizard
 * - pdf
 */
export type FormIoFormDisplayEnum = 'form' | 'wizard' | 'pdf';

export type FormOnlyOutput = {
    title: string;
    display: string;
    created_at: string;
    updated_at: string;
    id: number;
    classification?: number | null;
};

export type FormOutput = {
    title: string;
    display: string;
    created_at: string;
    updated_at: string;
    id: number;
    classification?: number | null;
    components: Array<(FormComponentOutput | FormPanelComponentOutput)>;
};

export type FormPanelComponentInput = {
    label: string;
    key: string;
    type?: FormIoComponentTypeEnum;
    input?: boolean;
    components: Array<FormComponentInput>;
};

export type FormPanelComponentOutput = {
    label: string;
    key: string;
    type: string;
    input: boolean;
    position: number;
    components: Array<FormComponentOutput>;
};

export type HTTPValidationError = {
    detail?: Array<ValidationError>;
};

export type MeldingCreateOutput = {
    id: number;
    created_at: string;
    updated_at: string;
    text: string;
    state: string;
    classification?: number | null;
    token: string;
};

export type MeldingInput = {
    text: string;
};

export type MeldingOutput = {
    id: number;
    created_at: string;
    updated_at: string;
    text: string;
    state: string;
    classification?: number | null;
};

export type StaticFormInput = {
    title: string;
    display: FormIoFormDisplayEnum;
    components: Array<(FormPanelComponentInput | FormComponentInput)>;
};

export type StaticFormOutput = {
    title: string;
    display: string;
    created_at: string;
    updated_at: string;
    type: string;
    components: Array<(FormComponentOutput | FormPanelComponentOutput)>;
};

export type StaticFormTypeEnum = 'primary';

export type UserCreateInput = {
    username: string;
    email: string;
};

export type UserOutput = {
    id: number;
    created_at: string;
    updated_at: string;
    email: string;
    username: string;
};

export type UserUpdateInput = {
    username?: string | null;
    email?: string | null;
};

export type ValidationError = {
    loc: Array<(string | number)>;
    msg: string;
    type: string;
};

export type PostClassificationData = {
    requestBody: ClassificationInput;
};

export type PostClassificationResponse = ClassificationOutput;

export type GetClassificationData = {
    limit?: number;
    offset?: number | null;
    sort?: string;
};

export type GetClassificationResponse = Array<ClassificationOutput>;

export type GetClassificationByClassificationIdData = {
    /**
     * The classification id.
     */
    classificationId: number;
};

export type GetClassificationByClassificationIdResponse = ClassificationOutput;

export type PatchClassificationByClassificationIdData = {
    /**
     * The classification id.
     */
    classificationId: number;
    requestBody: ClassificationInput;
};

export type PatchClassificationByClassificationIdResponse = ClassificationOutput;

export type DeleteClassificationByClassificationIdData = {
    /**
     * The classification id.
     */
    classificationId: number;
};

export type DeleteClassificationByClassificationIdResponse = void;

export type PostMeldingData = {
    requestBody: MeldingInput;
};

export type PostMeldingResponse = MeldingCreateOutput;

export type GetMeldingData = {
    limit?: number;
    offset?: number | null;
    sort?: string;
};

export type GetMeldingResponse = Array<MeldingOutput>;

export type GetMeldingByMeldingIdData = {
    /**
     * The id of the melding.
     */
    meldingId: number;
};

export type GetMeldingByMeldingIdResponse = MeldingOutput;

export type PatchMeldingByMeldingIdData = {
    /**
     * The id of the melding.
     */
    meldingId: number;
    requestBody: MeldingInput;
    /**
     * The token of the melding.
     */
    token: string;
};

export type PatchMeldingByMeldingIdResponse = MeldingOutput;

export type PutMeldingByMeldingIdAnswerQuestionsData = {
    /**
     * The id of the melding.
     */
    meldingId: number;
    /**
     * The token of the melding.
     */
    token: string;
};

export type PutMeldingByMeldingIdAnswerQuestionsResponse = MeldingOutput;

export type PutMeldingByMeldingIdProcessData = {
    /**
     * The id of the melding.
     */
    meldingId: number;
};

export type PutMeldingByMeldingIdProcessResponse = MeldingOutput;

export type PutMeldingByMeldingIdCompleteData = {
    /**
     * The id of the melding.
     */
    meldingId: number;
};

export type PutMeldingByMeldingIdCompleteResponse = MeldingOutput;

export type PostMeldingByMeldingIdQuestionByQuestionIdData = {
    /**
     * The id of the melding.
     */
    meldingId: number;
    /**
     * The id of the question.
     */
    questionId: number;
    requestBody: AnswerInput;
    /**
     * The token of the melding.
     */
    token: string;
};

export type PostMeldingByMeldingIdQuestionByQuestionIdResponse = AnswerOutput;

export type PostUserData = {
    requestBody: UserCreateInput;
};

export type PostUserResponse = UserOutput;

export type GetUserData = {
    limit?: number;
    offset?: number | null;
    sort?: string;
};

export type GetUserResponse = Array<UserOutput>;

export type GetUserByUserIdData = {
    /**
     * The id of the user.
     */
    userId: number;
};

export type GetUserByUserIdResponse = UserOutput;

export type DeleteUserByUserIdData = {
    /**
     * The id of the user.
     */
    userId: number;
};

export type DeleteUserByUserIdResponse = void;

export type PatchUserByUserIdData = {
    requestBody: UserUpdateInput;
    /**
     * The id of the user.
     */
    userId: number;
};

export type PatchUserByUserIdResponse = UserOutput;

export type GetFormData = {
    limit?: number;
    offset?: number | null;
    sort?: string;
};

export type GetFormResponse = Array<FormOnlyOutput>;

export type PostFormData = {
    requestBody: FormInput;
};

export type PostFormResponse = FormOutput;

export type GetFormByFormIdData = {
    /**
     * The id of the form.
     */
    formId: number;
};

export type GetFormByFormIdResponse = FormOutput;

export type PutFormByFormIdData = {
    /**
     * The id of the form.
     */
    formId: number;
    requestBody: FormInput;
};

export type PutFormByFormIdResponse = FormOutput;

export type DeleteFormByFormIdData = {
    /**
     * The id of the form.
     */
    formId: number;
};

export type DeleteFormByFormIdResponse = void;

export type GetFormClassificationByClassificationIdData = {
    /**
     * The id of the classification that the form belongs to.
     */
    classificationId: number;
};

export type GetFormClassificationByClassificationIdResponse = FormOutput;

export type GetStaticFormByFormTypeData = {
    /**
     * The type of the static form.
     */
    formType: StaticFormTypeEnum;
};

export type GetStaticFormByFormTypeResponse = StaticFormOutput;

export type PutStaticFormByFormTypeData = {
    /**
     * The type of the static form.
     */
    formType: StaticFormTypeEnum;
    requestBody: StaticFormInput;
};

export type PutStaticFormByFormTypeResponse = StaticFormOutput;

export type $OpenApiTs = {
    '/classification/': {
        post: {
            req: PostClassificationData;
            res: {
                /**
                 * Successful Response
                 */
                201: ClassificationOutput;
                /**
                 * Unauthorized, perhaps the token was invalid or expired, or the user could not be found.
                 */
                401: unknown;
                /**
                 * Conflict, a uniqueness error occurred
                 */
                409: unknown;
                /**
                 * Validation Error
                 */
                422: HTTPValidationError;
            };
        };
        get: {
            req: GetClassificationData;
            res: {
                /**
                 * Successful Response
                 */
                200: Array<ClassificationOutput>;
                /**
                 * Unauthorized, perhaps the token was invalid or expired, or the user could not be found.
                 */
                401: unknown;
                /**
                 * Validation Error
                 */
                422: HTTPValidationError;
            };
        };
    };
    '/classification/{classification_id}': {
        get: {
            req: GetClassificationByClassificationIdData;
            res: {
                /**
                 * Successful Response
                 */
                200: ClassificationOutput;
                /**
                 * Unauthorized, perhaps the token was invalid or expired, or the user could not be found.
                 */
                401: unknown;
                /**
                 * Not Found
                 */
                404: unknown;
                /**
                 * Validation Error
                 */
                422: HTTPValidationError;
            };
        };
        patch: {
            req: PatchClassificationByClassificationIdData;
            res: {
                /**
                 * Successful Response
                 */
                200: ClassificationOutput;
                /**
                 * Unauthorized, perhaps the token was invalid or expired, or the user could not be found.
                 */
                401: unknown;
                /**
                 * Not Found
                 */
                404: unknown;
                /**
                 * Conflict, a uniqueness error occurred
                 */
                409: unknown;
                /**
                 * Validation Error
                 */
                422: HTTPValidationError;
            };
        };
        delete: {
            req: DeleteClassificationByClassificationIdData;
            res: {
                /**
                 * Successful Response
                 */
                204: void;
                /**
                 * Unauthorized, perhaps the token was invalid or expired, or the user could not be found.
                 */
                401: unknown;
                /**
                 * Not Found
                 */
                404: unknown;
                /**
                 * Validation Error
                 */
                422: HTTPValidationError;
            };
        };
    };
    '/melding/': {
        post: {
            req: PostMeldingData;
            res: {
                /**
                 * Successful Response
                 */
                201: MeldingCreateOutput;
                /**
                 * Validation Error
                 */
                422: HTTPValidationError;
            };
        };
        get: {
            req: GetMeldingData;
            res: {
                /**
                 * Successful Response
                 */
                200: Array<MeldingOutput>;
                /**
                 * Unauthorized, perhaps the token was invalid or expired, or the user could not be found.
                 */
                401: unknown;
                /**
                 * Validation Error
                 */
                422: HTTPValidationError;
            };
        };
    };
    '/melding/{melding_id}': {
        get: {
            req: GetMeldingByMeldingIdData;
            res: {
                /**
                 * Successful Response
                 */
                200: MeldingOutput;
                /**
                 * Unauthorized, perhaps the token was invalid or expired, or the user could not be found.
                 */
                401: unknown;
                /**
                 * Not Found
                 */
                404: unknown;
                /**
                 * Validation Error
                 */
                422: HTTPValidationError;
            };
        };
        patch: {
            req: PatchMeldingByMeldingIdData;
            res: {
                /**
                 * Successful Response
                 */
                200: MeldingOutput;
                /**
                 * Unauthorized, perhaps the token was invalid or expired, or the user could not be found.
                 */
                401: unknown;
                /**
                 * Not Found
                 */
                404: unknown;
                /**
                 * Validation Error
                 */
                422: HTTPValidationError;
            };
        };
    };
    '/melding/{melding_id}/answer_questions': {
        put: {
            req: PutMeldingByMeldingIdAnswerQuestionsData;
            res: {
                /**
                 * Successful Response
                 */
                200: MeldingOutput;
                /**
                 * Transition not allowed from current state
                 */
                400: unknown;
                /**
                 * Unauthorized, perhaps the token was invalid or expired, or the user could not be found.
                 */
                401: unknown;
                /**
                 * Not Found
                 */
                404: unknown;
                /**
                 * Unexpected error
                 */
                default: unknown;
            };
        };
    };
    '/melding/{melding_id}/process': {
        put: {
            req: PutMeldingByMeldingIdProcessData;
            res: {
                /**
                 * Successful Response
                 */
                200: MeldingOutput;
                /**
                 * Transition not allowed from current state
                 */
                400: unknown;
                /**
                 * Unauthorized, perhaps the token was invalid or expired, or the user could not be found.
                 */
                401: unknown;
                /**
                 * Not Found
                 */
                404: unknown;
                /**
                 * Unexpected error
                 */
                default: unknown;
            };
        };
    };
    '/melding/{melding_id}/complete': {
        put: {
            req: PutMeldingByMeldingIdCompleteData;
            res: {
                /**
                 * Successful Response
                 */
                200: MeldingOutput;
                /**
                 * Transition not allowed from current state
                 */
                400: unknown;
                /**
                 * Unauthorized, perhaps the token was invalid or expired, or the user could not be found.
                 */
                401: unknown;
                /**
                 * Not Found
                 */
                404: unknown;
                /**
                 * Unexpected error
                 */
                default: unknown;
            };
        };
    };
    '/melding/{melding_id}/question/{question_id}': {
        post: {
            req: PostMeldingByMeldingIdQuestionByQuestionIdData;
            res: {
                /**
                 * Successful Response
                 */
                201: AnswerOutput;
                /**
                 * Bad Request
                 */
                400: unknown;
                /**
                 * Unauthorized, perhaps the token was invalid or expired, or the user could not be found.
                 */
                401: unknown;
                /**
                 * Not Found
                 */
                404: unknown;
                /**
                 * Unexpected error
                 */
                default: unknown;
            };
        };
    };
    '/user/': {
        post: {
            req: PostUserData;
            res: {
                /**
                 * Successful Response
                 */
                201: UserOutput;
                /**
                 * Unauthorized, perhaps the token was invalid or expired, or the user could not be found.
                 */
                401: unknown;
                /**
                 * Conflict, a uniqueness error occurred
                 */
                409: unknown;
                /**
                 * Validation Error
                 */
                422: HTTPValidationError;
            };
        };
        get: {
            req: GetUserData;
            res: {
                /**
                 * Successful Response
                 */
                200: Array<UserOutput>;
                /**
                 * Unauthorized, perhaps the token was invalid or expired, or the user could not be found.
                 */
                401: unknown;
                /**
                 * Validation Error
                 */
                422: HTTPValidationError;
            };
        };
    };
    '/user/{user_id}': {
        get: {
            req: GetUserByUserIdData;
            res: {
                /**
                 * Successful Response
                 */
                200: UserOutput;
                /**
                 * Unauthorized, perhaps the token was invalid or expired, or the user could not be found.
                 */
                401: unknown;
                /**
                 * Not Found
                 */
                404: unknown;
                /**
                 * Validation Error
                 */
                422: HTTPValidationError;
            };
        };
        delete: {
            req: DeleteUserByUserIdData;
            res: {
                /**
                 * Successful Response
                 */
                204: void;
                /**
                 * Delete own account
                 */
                400: unknown;
                /**
                 * Unauthorized, perhaps the token was invalid or expired, or the user could not be found.
                 */
                401: unknown;
                /**
                 * Not Found
                 */
                404: unknown;
                /**
                 * Validation Error
                 */
                422: HTTPValidationError;
            };
        };
        patch: {
            req: PatchUserByUserIdData;
            res: {
                /**
                 * Successful Response
                 */
                200: UserOutput;
                /**
                 * Unauthorized, perhaps the token was invalid or expired, or the user could not be found.
                 */
                401: unknown;
                /**
                 * Not Found
                 */
                404: unknown;
                /**
                 * Conflict, a uniqueness error occurred
                 */
                409: unknown;
                /**
                 * Validation Error
                 */
                422: HTTPValidationError;
            };
        };
    };
    '/form/': {
        get: {
            req: GetFormData;
            res: {
                /**
                 * Successful Response
                 */
                200: Array<FormOnlyOutput>;
                /**
                 * Unauthorized, perhaps the token was invalid or expired, or the user could not be found.
                 */
                401: unknown;
                /**
                 * Validation Error
                 */
                422: HTTPValidationError;
            };
        };
        post: {
            req: PostFormData;
            res: {
                /**
                 * Successful Response
                 */
                201: FormOutput;
                /**
                 * Providing a classification id that does not exist
                 */
                400: unknown;
                /**
                 * Unauthorized, perhaps the token was invalid or expired, or the user could not be found.
                 */
                401: unknown;
                /**
                 * Validation Error
                 */
                422: HTTPValidationError;
            };
        };
    };
    '/form/{form_id}': {
        get: {
            req: GetFormByFormIdData;
            res: {
                /**
                 * Successful Response
                 */
                200: FormOutput;
                /**
                 * Not Found
                 */
                404: unknown;
                /**
                 * Validation Error
                 */
                422: HTTPValidationError;
            };
        };
        put: {
            req: PutFormByFormIdData;
            res: {
                /**
                 * Successful Response
                 */
                200: FormOutput;
                /**
                 * Providing a classification id that does not exist
                 */
                400: unknown;
                /**
                 * Unauthorized, perhaps the token was invalid or expired, or the user could not be found.
                 */
                401: unknown;
                /**
                 * Not Found
                 */
                404: unknown;
                /**
                 * Validation Error
                 */
                422: HTTPValidationError;
            };
        };
        delete: {
            req: DeleteFormByFormIdData;
            res: {
                /**
                 * Successful Response
                 */
                204: void;
                /**
                 * Unauthorized, perhaps the token was invalid or expired, or the user could not be found.
                 */
                401: unknown;
                /**
                 * Not Found
                 */
                404: unknown;
                /**
                 * Validation Error
                 */
                422: HTTPValidationError;
            };
        };
    };
    '/form/classification/{classification_id}': {
        get: {
            req: GetFormClassificationByClassificationIdData;
            res: {
                /**
                 * Successful Response
                 */
                200: FormOutput;
                /**
                 * Not Found
                 */
                404: unknown;
                /**
                 * Validation Error
                 */
                422: HTTPValidationError;
            };
        };
    };
    '/static-form/{form_type}': {
        get: {
            req: GetStaticFormByFormTypeData;
            res: {
                /**
                 * Successful Response
                 */
                200: StaticFormOutput;
                /**
                 * Not Found
                 */
                404: unknown;
                /**
                 * Validation Error
                 */
                422: HTTPValidationError;
            };
        };
        put: {
            req: PutStaticFormByFormTypeData;
            res: {
                /**
                 * Successful Response
                 */
                200: StaticFormOutput;
                /**
                 * Unauthorized, perhaps the token was invalid or expired, or the user could not be found.
                 */
                401: unknown;
                /**
                 * Not Found
                 */
                404: unknown;
                /**
                 * Validation Error
                 */
                422: HTTPValidationError;
            };
        };
    };
};