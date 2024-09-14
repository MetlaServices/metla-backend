class ErrorHandler extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;

        // Ensure the name of the error is the same as the class name
        this.name = this.constructor.name;

        // Captures the stack trace, excluding the constructor call
        Error.captureStackTrace(this, this.constructor);
    }
}

export default ErrorHandler;
