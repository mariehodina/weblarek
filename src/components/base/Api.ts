export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';
export class Api {
    readonly baseUrl: string;
    protected options: RequestInit;
    constructor(baseUrl: string, options: RequestInit = {}) {
        this.baseUrl = baseUrl;
        this.options = {
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers as object ?? {})
            }
        };
    }
    protected async handleResponse<T>(response: Response): Promise<T> {
        if (response.ok) {
            return await response.json();
        } else {
            const errorData = await response.json();
            throw new Error(errorData.error || response.statusText);
        }
    }
    async get<T extends object>(uri: string): Promise<T> {
        const response = await fetch(this.baseUrl + uri, {
            ...this.options,
            method: 'GET'
        });
        return this.handleResponse<T>(response);
    }
    async post<T extends object>(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<T> {
        const response = await fetch(this.baseUrl + uri, {
            ...this.options,
            method,
            body: JSON.stringify(data)
        });
        return this.handleResponse<T>(response);
    }
}