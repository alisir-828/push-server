import businessError from './businessError';

class ApiResponse<T> {
    public code: number;
    public data?: T;
    public message: number | null;

    constructor(code: number, data: T, message: number | null = null) {
        this.code = code;
        this.data = data || ({} as T);
        this.message = message;
    }

    static success<T>(code: number, data: T = {} as T): ApiResponse<T> {
        return new ApiResponse<T>(code, data ?? ({} as T));
    }

    static error(message?: string, errorCode?: number) {
        businessError(message, errorCode);
    }
}

export default ApiResponse;
