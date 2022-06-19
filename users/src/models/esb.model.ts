export interface IErrorCallback {
    code: string;
    [key: string]: any;
}

export interface IPayload {
    id: string;
    action: string;
    body: {
        [key: string]: any;
    }
}