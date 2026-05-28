class ApiError extends Error {
    status: number;
    statusText: string;
    data: any;

    constructor(message: string, status: number, statusText: string, data: any) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.statusText = statusText;
        this.data = data;
    }
}
export default ApiError
