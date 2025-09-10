



export class BaseError extends Error{
    public readonly status: number;

    constructor(message:string, status:number){
        super(message);
        this.status = status;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class NotFoundError extends BaseError{
    constructor(message:string = "Resource not found"){
        super(message,404);
    }
}

export class ValidationError extends BaseError{
    constructor(message:string = "Validation Faild"){
        super(message,400);
    }
}

export class AuthorizationError extends BaseError{
    constructor(message:string = "User not authorized"){
        super(message,403);
    }
}