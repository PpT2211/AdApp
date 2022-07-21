class AppError extends Error {
    constructor(status, message) {
        super();
        this.status = status
        this.message = message;
    }
}

const errors = {
    AppError
}

export default errors