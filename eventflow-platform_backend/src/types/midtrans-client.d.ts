declare module 'midtrans-client' {
    export class Snap {
        constructor(options: { isProduction: boolean, serverKey: string, clientKey: string });
        createTransaction(parameter: any): Promise<{ token: string, redirect_url: string }>;
        transaction: {
            notification(reqBody: any): Promise<any>;
        };
    }
    export class CoreApi {
        constructor(options: { isProduction: boolean, serverKey: string, clientKey: string });
    }
}
