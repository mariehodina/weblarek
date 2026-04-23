import {
  IApi,
  IProduct,
  IOrder,
  IOrderResult,
  IProductsResponse,
} from "../../types";

export class ApiService {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  async getProducts(): Promise<IProduct[]> {
    const response = await this.api.get<IProductsResponse>("/product");
    return response.items;
  }

  async sendOrder(order: IOrder): Promise<IOrderResult> {
    const result = await this.api.post<IOrderResult>("/order", order);
    return result;
  }
}
