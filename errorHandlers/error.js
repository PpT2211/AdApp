class AppError extends Error {
    constructor(status, message) {
        super();
        this.status = status
        this.message = message;
    }
}

const errors = {
    AppError: AppError
}

export default errors