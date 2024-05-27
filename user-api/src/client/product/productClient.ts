import axios from 'axios';

export class ProductClient {
  private static instance: ProductClient;
  private url: string;
  private token: string | null = null;

  private constructor() {
    this.url = 'http://localhost:3000/'; 
  }

  public static getInstance() {
    if (!ProductClient.instance) {
      ProductClient.instance = new ProductClient();
    }

    return ProductClient.instance;
  }

  public async authenticate(email: string, password: string) {
    const response = await axios.post(`${this.url}auth/login`, {
      email,
      password,
    });
    this.token = response.data.access_token;
  }

  public async createProduct(product: any) {
    if (!this.token) {
      throw new Error('Token não disponível, por favor atentique primeiro.');
    }

    return await axios.post(`${this.url}products`, product, {
      headers: {
        Authorization: this.token,
      },
    });
  }

  public async getProducts() {
    if (!this.token) {
      throw new Error('Token não disponível, por favor atentique primeiro.');
    }

    return await axios.get(`${this.url}products`, {
      headers: {
        Authorization: this.token,
      },
    });
  }
}
