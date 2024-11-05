// This file is auto-generated by @hey-api/openapi-ts

export type Add = {
    '+': Array<(number | string | Var)>;
};

export type All_Input = {
    all: [
        (Array<unknown> | Var | Missing | MissingSome | If | Merge | Filter_Input | Map_Input),
        (boolean | Add | All_Input | And_Input | Cat | Divide | Equals | Filter_Input | GreaterThan | GreaterThanOrEqual | If | In_Input | LessThan | LessThanOrEqual | Log | Map_Input | Max | Merge | Min | Missing | MissingSome | Modulo | Multiply | None__Input | Not | NotEquals | NotNot | Or_Input | Reduce_Input | Some_Input | StrictEquals | StrictNotEquals | Substr | Subtract | Var)
    ];
};

export type All_Output = {
    all: [
        (Array<unknown> | Var | Missing | MissingSome | If | Merge | Filter_Output | Map_Output),
        (boolean | Add | All_Output | And_Output | Cat | Divide | Equals | Filter_Output | GreaterThan | GreaterThanOrEqual | If | In_Output | LessThan | LessThanOrEqual | Log | Map_Output | Max | Merge | Min | Missing | MissingSome | Modulo | Multiply | None__Output | Not | NotEquals | NotNot | Or_Output | Reduce_Output | Some_Output | StrictEquals | StrictNotEquals | Substr | Subtract | Var)
    ];
};

export type And_Input = {
    and: Array<(boolean | number | string | Array<(null)> | Add | All_Input | And_Input | Cat | Divide | Equals | Filter_Input | GreaterThan | GreaterThanOrEqual | If | In_Input | LessThan | LessThanOrEqual | Log | Map_Input | Max | Merge | Min | Missing | MissingSome | Modulo | Multiply | None__Input | Not | NotEquals | NotNot | Or_Input | Reduce_Input | Some_Input | StrictEquals | StrictNotEquals | Substr | Subtract | Var)>;
};

export type And_Output = {
    and: Array<(boolean | number | string | Array<(null)> | Add | All_Output | And_Output | Cat | Divide | Equals | Filter_Output | GreaterThan | GreaterThanOrEqual | If | In_Output | LessThan | LessThanOrEqual | Log | Map_Output | Max | Merge | Min | Missing | MissingSome | Modulo | Multiply | None__Output | Not | NotEquals | NotNot | Or_Output | Reduce_Output | Some_Output | StrictEquals | StrictNotEquals | Substr | Subtract | Var)>;
};

export type AnswerInput = {
    text: string;
};

export type AnswerOutput = {
    id: number;
    created_at: string;
    updated_at: string;
};

export type AttachmentOutput = {
    id: number;
    created_at: string;
    updated_at: string;
    original_filename: string;
};

export type Body_melding_attachment_melding__melding_id__attachment_post = {
    file: (Blob | File);
};

export type Cat = {
    cat: (number | string | Array<(number | string)>);
};

export type ClassificationInput = {
    name: string;
};

export type ClassificationOutput = {
    name: string;
    id: number;
    created_at: string;
    updated_at: string;
    form?: (number | null);
};

export type Divide = {
    '/': [
        (number | string),
        (number | string)
    ];
};

export type Equals = {
    '==': [
        unknown,
        unknown
    ];
};

export type Filter_Input = {
    filter: [
        (Array<unknown> | Var | Missing | MissingSome | If | Merge | Filter_Input | Map_Input),
        (boolean | Add | All_Input | And_Input | Cat | Divide | Equals | Filter_Input | GreaterThan | GreaterThanOrEqual | If | In_Input | LessThan | LessThanOrEqual | Log | Map_Input | Max | Merge | Min | Missing | MissingSome | Modulo | Multiply | None__Input | Not | NotEquals | NotNot | Or_Input | Reduce_Input | Some_Input | StrictEquals | StrictNotEquals | Substr | Subtract | Var)
    ];
};

export type Filter_Output = {
    filter: [
        (Array<unknown> | Var | Missing | MissingSome | If | Merge | Filter_Output | Map_Output),
        (boolean | Add | All_Output | And_Output | Cat | Divide | Equals | Filter_Output | GreaterThan | GreaterThanOrEqual | If | In_Output | LessThan | LessThanOrEqual | Log | Map_Output | Max | Merge | Min | Missing | MissingSome | Modulo | Multiply | None__Output | Not | NotEquals | NotNot | Or_Output | Reduce_Output | Some_Output | StrictEquals | StrictNotEquals | Substr | Subtract | Var)
    ];
};

export type FormCheckboxComponentInput = {
    label: string;
    description: (string | null);
    key: string;
    type?: FormIoComponentTypeEnum;
    input: boolean;
    validate?: (FormComponentInputValidate | null);
    values: Array<FormComponentValueInput>;
};

export type FormCheckboxComponentOutput = {
    label: string;
    description: string;
    key: string;
    type: string;
    input: boolean;
    position: number;
    validate?: (FormComponentOutputValidate | null);
    values: Array<FormComponentValueOutput>;
    question: number;
};

export type FormComponentInputValidate = {
    json?: (Add | All_Input | And_Input | Cat | Divide | Equals | Filter_Input | GreaterThan | GreaterThanOrEqual | If | In_Input | LessThan | LessThanOrEqual | Log | Map_Input | Max | Merge | Min | Missing | MissingSome | Modulo | Multiply | None__Input | Not | NotEquals | NotNot | Or_Input | Reduce_Input | Some_Input | StrictEquals | StrictNotEquals | Substr | Subtract | Var | null);
    required?: boolean;
};

export type FormComponentOutputValidate = {
    json?: (Add | All_Output | And_Output | Cat | Divide | Equals | Filter_Output | GreaterThan | GreaterThanOrEqual | If | In_Output | LessThan | LessThanOrEqual | Log | Map_Output | Max | Merge | Min | Missing | MissingSome | Modulo | Multiply | None__Output | Not | NotEquals | NotNot | Or_Output | Reduce_Output | Some_Output | StrictEquals | StrictNotEquals | Substr | Subtract | Var | null);
    required: boolean;
};

export type FormComponentValueInput = {
    label: string;
    value: string;
};

export type FormComponentValueOutput = {
    label: string;
    value: string;
    position: number;
};

export type FormInput = {
    title: string;
    display: FormIoFormDisplayEnum;
    components: Array<(FormPanelComponentInput | FormTextAreaComponentInput | FormTextFieldComponentInput | FormRadioComponentInput | FormCheckboxComponentInput | FormSelectComponentInput)>;
    classification?: (number | null);
};

/**
 * The value of the type field
 */
export type FormIoComponentTypeEnum = 'panel' | 'textarea' | 'textfield' | 'selectboxes' | 'radio' | 'select';

/**
 * The value of the display field on the form can be one of the following:
 * - form
 * - wizard
 * - pdf
 */
export type FormIoFormDisplayEnum = 'form' | 'wizard' | 'pdf';

export type FormOutput = {
    id: number;
    title: string;
    display: string;
    created_at: string;
    updated_at: string;
    classification?: (number | null);
    components: Array<(FormPanelComponentOutput | FormTextAreaComponentOutput | FormTextFieldInputComponentOutput | FormCheckboxComponentOutput | FormRadioComponentOutput | FormSelectComponentOutput)>;
};

export type FormPanelComponentInput = {
    label: string;
    key: string;
    type?: FormIoComponentTypeEnum;
    input?: boolean;
    components: Array<(FormTextAreaComponentInput | FormTextFieldComponentInput | FormRadioComponentInput | FormCheckboxComponentInput | FormSelectComponentInput)>;
};

export type FormPanelComponentOutput = {
    label: string;
    key: string;
    type: string;
    input: boolean;
    position: number;
    components: Array<(FormTextAreaComponentOutput | FormTextFieldInputComponentOutput | FormCheckboxComponentOutput | FormRadioComponentOutput | FormSelectComponentOutput)>;
};

export type FormRadioComponentInput = {
    label: string;
    description: (string | null);
    key: string;
    type?: FormIoComponentTypeEnum;
    input: boolean;
    validate?: (FormComponentInputValidate | null);
    values: Array<FormComponentValueInput>;
};

export type FormRadioComponentOutput = {
    label: string;
    description: string;
    key: string;
    type: string;
    input: boolean;
    position: number;
    validate?: (FormComponentOutputValidate | null);
    values: Array<FormComponentValueOutput>;
    question: number;
};

export type FormSelectComponentDataInput = {
    values: Array<FormComponentValueInput>;
};

export type FormSelectComponentDataOutput = {
    values: Array<FormComponentValueOutput>;
};

export type FormSelectComponentInput = {
    label: string;
    description: (string | null);
    key: string;
    type?: FormIoComponentTypeEnum;
    input: boolean;
    validate?: (FormComponentInputValidate | null);
    widget: string;
    placeholder: string;
    data: FormSelectComponentDataInput;
};

export type FormSelectComponentOutput = {
    label: string;
    description: string;
    key: string;
    type: string;
    input: boolean;
    position: number;
    validate?: (FormComponentOutputValidate | null);
    widget: string;
    placeholder: string;
    data: FormSelectComponentDataOutput;
    question: number;
};

export type FormTextAreaComponentInput = {
    label: string;
    description: (string | null);
    key: string;
    type?: FormIoComponentTypeEnum;
    input: boolean;
    validate?: (FormComponentInputValidate | null);
    autoExpand: boolean;
    maxCharCount?: (number | null);
};

export type FormTextAreaComponentOutput = {
    label: string;
    description: string;
    key: string;
    type: string;
    input: boolean;
    position: number;
    validate?: (FormComponentOutputValidate | null);
    autoExpand: boolean;
    maxCharCount: (number | null);
    question: number;
};

export type FormTextFieldComponentInput = {
    label: string;
    description: (string | null);
    key: string;
    type?: FormIoComponentTypeEnum;
    input: boolean;
    validate?: (FormComponentInputValidate | null);
};

export type FormTextFieldInputComponentOutput = {
    label: string;
    description: string;
    key: string;
    type: string;
    input: boolean;
    position: number;
    validate?: (FormComponentOutputValidate | null);
    question: number;
};

export type GreaterThan = {
    '>': [
        (number | string | Var),
        (number | string)
    ];
};

export type GreaterThanOrEqual = {
    '>=': [
        (number | string | Var),
        (number | string)
    ];
};

export type HTTPValidationError = {
    detail?: Array<ValidationError>;
};

export type If = {
    if: Array<unknown>;
};

export type In_Input = {
    in: [
        (number | string | Add | All_Input | And_Input | Cat | Divide | Equals | Filter_Input | GreaterThan | GreaterThanOrEqual | If | In_Input | LessThan | LessThanOrEqual | Log | Map_Input | Max | Merge | Min | Missing | MissingSome | Modulo | Multiply | None__Input | Not | NotEquals | NotNot | Or_Input | Reduce_Input | Some_Input | StrictEquals | StrictNotEquals | Substr | Subtract | Var),
        (Array<(number | string)> | string)
    ];
};

export type In_Output = {
    in: [
        (number | string | Add | All_Output | And_Output | Cat | Divide | Equals | Filter_Output | GreaterThan | GreaterThanOrEqual | If | In_Output | LessThan | LessThanOrEqual | Log | Map_Output | Max | Merge | Min | Missing | MissingSome | Modulo | Multiply | None__Output | Not | NotEquals | NotNot | Or_Output | Reduce_Output | Some_Output | StrictEquals | StrictNotEquals | Substr | Subtract | Var),
        (Array<(number | string)> | string)
    ];
};

export type LessThan = {
    '<': ([
    (number | string | Var),
    (number | string)
] | [
    number,
    number,
    number
]);
};

export type LessThanOrEqual = {
    '<=': ([
    (number | string),
    (number | string)
] | [
    number,
    number,
    number
]);
};

export type Log = {
    log: (number | string | boolean | [
    (number | string | boolean)
]);
};

export type Map_Input = {
    map: [
        (Array<unknown> | Var | Missing | MissingSome | If | Merge | Filter_Input | Map_Input),
        (Add | All_Input | And_Input | Cat | Divide | Equals | Filter_Input | GreaterThan | GreaterThanOrEqual | If | In_Input | LessThan | LessThanOrEqual | Log | Map_Input | Max | Merge | Min | Missing | MissingSome | Modulo | Multiply | None__Input | Not | NotEquals | NotNot | Or_Input | Reduce_Input | Some_Input | StrictEquals | StrictNotEquals | Substr | Subtract | Var)
    ];
};

export type Map_Output = {
    map: [
        (Array<unknown> | Var | Missing | MissingSome | If | Merge | Filter_Output | Map_Output),
        (Add | All_Output | And_Output | Cat | Divide | Equals | Filter_Output | GreaterThan | GreaterThanOrEqual | If | In_Output | LessThan | LessThanOrEqual | Log | Map_Output | Max | Merge | Min | Missing | MissingSome | Modulo | Multiply | None__Output | Not | NotEquals | NotNot | Or_Output | Reduce_Output | Some_Output | StrictEquals | StrictNotEquals | Substr | Subtract | Var)
    ];
};

export type Max = {
    max: Array<(number)>;
};

export type MeldingCreateOutput = {
    id: number;
    created_at: string;
    updated_at: string;
    text: string;
    state: string;
    classification?: (number | null);
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
    classification?: (number | null);
};

export type Merge = {
    merge: unknown;
};

export type Min = {
    min: Array<(number)>;
};

export type Missing = {
    missing: (Array<(string)> | string | Merge);
};

export type MissingSome = {
    missing_some: [
        number,
        Array<(string)>
    ];
};

export type Modulo = {
    '%': [
        (number | Var),
        number
    ];
};

export type Multiply = {
    '*': Array<(number | string | Var)>;
};

export type None__Input = {
    none: [
        (Array<unknown> | Var | Missing | MissingSome | If | Merge | Filter_Input | Map_Input),
        (boolean | Add | All_Input | And_Input | Cat | Divide | Equals | Filter_Input | GreaterThan | GreaterThanOrEqual | If | In_Input | LessThan | LessThanOrEqual | Log | Map_Input | Max | Merge | Min | Missing | MissingSome | Modulo | Multiply | None__Input | Not | NotEquals | NotNot | Or_Input | Reduce_Input | Some_Input | StrictEquals | StrictNotEquals | Substr | Subtract | Var)
    ];
};

export type None__Output = {
    none: [
        (Array<unknown> | Var | Missing | MissingSome | If | Merge | Filter_Output | Map_Output),
        (boolean | Add | All_Output | And_Output | Cat | Divide | Equals | Filter_Output | GreaterThan | GreaterThanOrEqual | If | In_Output | LessThan | LessThanOrEqual | Log | Map_Output | Max | Merge | Min | Missing | MissingSome | Modulo | Multiply | None__Output | Not | NotEquals | NotNot | Or_Output | Reduce_Output | Some_Output | StrictEquals | StrictNotEquals | Substr | Subtract | Var)
    ];
};

export type Not = {
    '!': ([
    (boolean | number | string)
] | boolean | number | string | [
    Array<(null)>
]);
};

export type NotEquals = {
    '!=': [
        unknown,
        unknown
    ];
};

export type NotNot = {
    '!!': [
        (number | string | Array<(null)>)
    ];
};

export type Or_Input = {
    or: Array<(boolean | number | string | Array<(null)> | Add | All_Input | And_Input | Cat | Divide | Equals | Filter_Input | GreaterThan | GreaterThanOrEqual | If | In_Input | LessThan | LessThanOrEqual | Log | Map_Input | Max | Merge | Min | Missing | MissingSome | Modulo | Multiply | None__Input | Not | NotEquals | NotNot | Or_Input | Reduce_Input | Some_Input | StrictEquals | StrictNotEquals | Substr | Subtract | Var)>;
};

export type Or_Output = {
    or: Array<(boolean | number | string | Array<(null)> | Add | All_Output | And_Output | Cat | Divide | Equals | Filter_Output | GreaterThan | GreaterThanOrEqual | If | In_Output | LessThan | LessThanOrEqual | Log | Map_Output | Max | Merge | Min | Missing | MissingSome | Modulo | Multiply | None__Output | Not | NotEquals | NotNot | Or_Output | Reduce_Output | Some_Output | StrictEquals | StrictNotEquals | Substr | Subtract | Var)>;
};

export type Reduce_Input = {
    reduce: [
        (Array<unknown> | Var | Missing | MissingSome | If | Merge | Filter_Input | Map_Input),
        (Add | All_Input | And_Input | Cat | Divide | Equals | Filter_Input | GreaterThan | GreaterThanOrEqual | If | In_Input | LessThan | LessThanOrEqual | Log | Map_Input | Max | Merge | Min | Missing | MissingSome | Modulo | Multiply | None__Input | Not | NotEquals | NotNot | Or_Input | Reduce_Input | Some_Input | StrictEquals | StrictNotEquals | Substr | Subtract | Var),
        unknown
    ];
};

export type Reduce_Output = {
    reduce: [
        (Array<unknown> | Var | Missing | MissingSome | If | Merge | Filter_Output | Map_Output),
        (Add | All_Output | And_Output | Cat | Divide | Equals | Filter_Output | GreaterThan | GreaterThanOrEqual | If | In_Output | LessThan | LessThanOrEqual | Log | Map_Output | Max | Merge | Min | Missing | MissingSome | Modulo | Multiply | None__Output | Not | NotEquals | NotNot | Or_Output | Reduce_Output | Some_Output | StrictEquals | StrictNotEquals | Substr | Subtract | Var),
        unknown
    ];
};

export type SimpleFormOutput = {
    id: number;
    title: string;
    display: string;
    created_at: string;
    updated_at: string;
    classification?: (number | null);
};

export type Some_Input = {
    some: [
        (Array<unknown> | Var | Missing | MissingSome | If | Merge | Filter_Input | Map_Input),
        (boolean | Add | All_Input | And_Input | Cat | Divide | Equals | Filter_Input | GreaterThan | GreaterThanOrEqual | If | In_Input | LessThan | LessThanOrEqual | Log | Map_Input | Max | Merge | Min | Missing | MissingSome | Modulo | Multiply | None__Input | Not | NotEquals | NotNot | Or_Input | Reduce_Input | Some_Input | StrictEquals | StrictNotEquals | Substr | Subtract | Var)
    ];
};

export type Some_Output = {
    some: [
        (Array<unknown> | Var | Missing | MissingSome | If | Merge | Filter_Output | Map_Output),
        (boolean | Add | All_Output | And_Output | Cat | Divide | Equals | Filter_Output | GreaterThan | GreaterThanOrEqual | If | In_Output | LessThan | LessThanOrEqual | Log | Map_Output | Max | Merge | Min | Missing | MissingSome | Modulo | Multiply | None__Output | Not | NotEquals | NotNot | Or_Output | Reduce_Output | Some_Output | StrictEquals | StrictNotEquals | Substr | Subtract | Var)
    ];
};

export type StaticFormCheckboxComponentOutput = {
    label: string;
    description: string;
    key: string;
    type: string;
    input: boolean;
    position: number;
    validate?: (FormComponentOutputValidate | null);
    values: Array<FormComponentValueOutput>;
};

export type StaticFormInput = {
    title: string;
    display: FormIoFormDisplayEnum;
    components: Array<(FormPanelComponentInput | FormTextAreaComponentInput | FormTextFieldComponentInput | FormRadioComponentInput | FormCheckboxComponentInput | FormSelectComponentInput)>;
};

export type StaticFormOutput = {
    type: string;
    title: string;
    display: string;
    created_at: string;
    updated_at: string;
    components: Array<(StaticFormPanelComponentOutput | StaticFormTextAreaComponentOutput | StaticFormTextFieldInputComponentOutput | StaticFormCheckboxComponentOutput | StaticFormRadioComponentOutput | StaticFormSelectComponentOutput)>;
};

export type StaticFormPanelComponentOutput = {
    label: string;
    key: string;
    type: string;
    input: boolean;
    position: number;
    components: Array<(StaticFormTextAreaComponentOutput | StaticFormTextFieldInputComponentOutput | StaticFormCheckboxComponentOutput | StaticFormRadioComponentOutput | StaticFormSelectComponentOutput)>;
};

export type StaticFormRadioComponentOutput = {
    label: string;
    description: string;
    key: string;
    type: string;
    input: boolean;
    position: number;
    validate?: (FormComponentOutputValidate | null);
    values: Array<FormComponentValueOutput>;
};

export type StaticFormSelectComponentOutput = {
    label: string;
    description: string;
    key: string;
    type: string;
    input: boolean;
    position: number;
    validate?: (FormComponentOutputValidate | null);
    widget: string;
    placeholder: string;
    data: FormSelectComponentDataOutput;
};

export type StaticFormTextAreaComponentOutput = {
    label: string;
    description: string;
    key: string;
    type: string;
    input: boolean;
    position: number;
    validate?: (FormComponentOutputValidate | null);
    autoExpand: boolean;
    maxCharCount: (number | null);
};

export type StaticFormTextFieldInputComponentOutput = {
    label: string;
    description: string;
    key: string;
    type: string;
    input: boolean;
    position: number;
    validate?: (FormComponentOutputValidate | null);
};

export type StaticFormTypeEnum = 'primary' | 'attachments' | 'location' | 'contact';

export type StrictEquals = {
    '===': [
        unknown,
        unknown
    ];
};

export type StrictNotEquals = {
    '!==': [
        unknown,
        unknown
    ];
};

export type Substr = {
    substr: ([
    string,
    number
] | [
    string,
    number,
    number
]);
};

export type Subtract = {
    '-': ([
    (number | string)
] | [
    (number | string),
    (number | string)
]);
};

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
    username?: (string | null);
    email?: (string | null);
};

export type ValidationError = {
    loc: Array<(string | number)>;
    msg: string;
    type: string;
};

export type Var = {
    var: ([
    string
] | string | [
    string,
    unknown
] | number | Array<(null)> | null);
};

export type PostClassificationData = {
    requestBody: ClassificationInput;
};

export type PostClassificationResponse = (ClassificationOutput);

export type GetClassificationData = {
    limit?: number;
    offset?: (number | null);
    sort?: string;
};

export type GetClassificationResponse = (Array<ClassificationOutput>);

export type GetClassificationByClassificationIdData = {
    /**
     * The classification id.
     */
    classificationId: number;
};

export type GetClassificationByClassificationIdResponse = (ClassificationOutput);

export type PatchClassificationByClassificationIdData = {
    /**
     * The classification id.
     */
    classificationId: number;
    requestBody: ClassificationInput;
};

export type PatchClassificationByClassificationIdResponse = (ClassificationOutput);

export type DeleteClassificationByClassificationIdData = {
    /**
     * The classification id.
     */
    classificationId: number;
};

export type DeleteClassificationByClassificationIdResponse = (void);

export type PostMeldingData = {
    requestBody: MeldingInput;
};

export type PostMeldingResponse = (MeldingCreateOutput);

export type GetMeldingData = {
    limit?: number;
    offset?: (number | null);
    sort?: string;
};

export type GetMeldingResponse = (Array<MeldingOutput>);

export type GetMeldingByMeldingIdData = {
    /**
     * The id of the melding.
     */
    meldingId: number;
};

export type GetMeldingByMeldingIdResponse = (MeldingOutput);

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

export type PatchMeldingByMeldingIdResponse = (MeldingOutput);

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

export type PutMeldingByMeldingIdAnswerQuestionsResponse = (MeldingOutput);

export type PutMeldingByMeldingIdAddAttachmentsData = {
    /**
     * The id of the melding.
     */
    meldingId: number;
    /**
     * The token of the melding.
     */
    token: string;
};

export type PutMeldingByMeldingIdAddAttachmentsResponse = (MeldingOutput);

export type PutMeldingByMeldingIdProcessData = {
    /**
     * The id of the melding.
     */
    meldingId: number;
};

export type PutMeldingByMeldingIdProcessResponse = (MeldingOutput);

export type PutMeldingByMeldingIdCompleteData = {
    /**
     * The id of the melding.
     */
    meldingId: number;
};

export type PutMeldingByMeldingIdCompleteResponse = (MeldingOutput);

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

export type PostMeldingByMeldingIdQuestionByQuestionIdResponse = (AnswerOutput);

export type PostMeldingByMeldingIdAttachmentData = {
    formData: Body_melding_attachment_melding__melding_id__attachment_post;
    /**
     * The id of the melding.
     */
    meldingId: number;
    /**
     * The token of the melding.
     */
    token: string;
};

export type PostMeldingByMeldingIdAttachmentResponse = (AttachmentOutput);

export type GetMeldingByMeldingIdAttachmentByAttachmentIdDownloadData = {
    /**
     * The id of the attachment.
     */
    attachmentId: number;
    /**
     * The id of the melding.
     */
    meldingId: number;
    /**
     * The token of the melding.
     */
    token: string;
};

export type GetMeldingByMeldingIdAttachmentByAttachmentIdDownloadResponse = (unknown);

export type GetMeldingByMeldingIdAttachmentsData = {
    /**
     * The id of the melding.
     */
    meldingId: number;
    /**
     * The token of the melding.
     */
    token: string;
};

export type GetMeldingByMeldingIdAttachmentsResponse = (Array<AttachmentOutput>);

export type DeleteMeldingByMeldingIdAttachmentByAttachmentIdData = {
    /**
     * The id of the attachment.
     */
    attachmentId: number;
    /**
     * The id of the melding.
     */
    meldingId: number;
    /**
     * The token of the melding.
     */
    token: string;
};

export type DeleteMeldingByMeldingIdAttachmentByAttachmentIdResponse = (unknown);

export type PostUserData = {
    requestBody: UserCreateInput;
};

export type PostUserResponse = (UserOutput);

export type GetUserData = {
    limit?: number;
    offset?: (number | null);
    sort?: string;
};

export type GetUserResponse = (Array<UserOutput>);

export type GetUserByUserIdData = {
    /**
     * The id of the user.
     */
    userId: number;
};

export type GetUserByUserIdResponse = (UserOutput);

export type DeleteUserByUserIdData = {
    /**
     * The id of the user.
     */
    userId: number;
};

export type DeleteUserByUserIdResponse = (void);

export type PatchUserByUserIdData = {
    requestBody: UserUpdateInput;
    /**
     * The id of the user.
     */
    userId: number;
};

export type PatchUserByUserIdResponse = (UserOutput);

export type GetFormData = {
    limit?: number;
    offset?: (number | null);
    sort?: string;
};

export type GetFormResponse = (Array<SimpleFormOutput>);

export type PostFormData = {
    requestBody: FormInput;
};

export type PostFormResponse = (FormOutput);

export type GetFormByFormIdData = {
    /**
     * The id of the form.
     */
    formId: number;
};

export type GetFormByFormIdResponse = (FormOutput);

export type PutFormByFormIdData = {
    /**
     * The id of the form.
     */
    formId: number;
    requestBody: FormInput;
};

export type PutFormByFormIdResponse = (FormOutput);

export type DeleteFormByFormIdData = {
    /**
     * The id of the form.
     */
    formId: number;
};

export type DeleteFormByFormIdResponse = (void);

export type GetFormClassificationByClassificationIdData = {
    /**
     * The id of the classification that the form belongs to.
     */
    classificationId: number;
};

export type GetFormClassificationByClassificationIdResponse = (FormOutput);

export type GetStaticFormByFormTypeData = {
    /**
     * The type of the static form.
     */
    formType: StaticFormTypeEnum;
};

export type GetStaticFormByFormTypeResponse = (StaticFormOutput);

export type PutStaticFormByFormTypeData = {
    /**
     * The type of the static form.
     */
    formType: StaticFormTypeEnum;
    requestBody: StaticFormInput;
};

export type PutStaticFormByFormTypeResponse = (StaticFormOutput);

export type GetStaticFormResponse = (Array<StaticFormOutput>);