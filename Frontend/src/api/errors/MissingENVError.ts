export class MissingENVError extends Error {
    constructor(message:string) {
        super(message)
    }
}