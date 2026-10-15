import { Injectable, signal } from "@angular/core"; 
import { ConfirmRequest } from "../models/confirm.interface";

@Injectable({ providedIn: 'root' })
export class ConfirmService {
    request = signal<ConfirmRequest | null>(null);

    ask(message: string): Promise<boolean> {
        this.request()?.resolve(false); 
        return new Promise<boolean>((resolve) => {
            this.request.set({ message, resolve });
        });
    }

    respond(result: boolean): void {
        this.request()?.resolve(result);
        this.request.set(null);
    }
}