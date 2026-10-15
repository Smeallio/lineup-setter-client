export interface ConfirmRequest {
    message: string;
    resolve: (result: boolean) => void;
}