import { Api } from "../base/Api";

export class LarekApi extends Api {
  constructor(baseUrl: string) {
    super(baseUrl);
  }
  getProducts() {
    return this.get("/product");
  }
  sendOrder(order: {
    items: string[];
    total: number;
    payment: string;
    email: string;
    phone: string;
    address: string;
  }) {
    return this.post("/order", order);
  }
}
