import { Controller, Post, Body } from '@nestjs/common';
import { ProductClient } from './client/product/productClient';
import UserClient from './client/user/userClient';

@Controller()
export class AppUserController {
  private productClient: ProductClient;
  private userClient: UserClient;

  constructor() {
    this.productClient = ProductClient.getInstance();
    this.userClient = UserClient.getInstance();
  }

  @Post('add_products')
  public async addProducts(@Body() body: any) {
    const { user, password, products } = body;
    const userInfo = await this.getUserInformation(user);

    if (userInfo.msg === 'Usuário não encontrado') {
      return userInfo;
    }

    const { email, password: userPassword } = userInfo;

    await this.productClient.authenticate(email, userPassword);

    const productResponses = [];
    for (const product of products) {
      const response = await this.productClient.createProduct(product);
      productResponses.push(response.data);
    }

    const allProducts = await this.productClient.getProducts();

    return {
      addedProducts: productResponses,
      allProducts: allProducts.data,
    };
  }

  private async getUserInformation(name: string) {
    const resultOfUserClient = await this.userClient.findUser(name);

    const conditionToStattThisProces = resultOfUserClient && 
                                        resultOfUserClient.users && 
                                        resultOfUserClient.users.length > 0;

    if (!conditionToStattThisProces) {
      return {
        msg: 'Usuário não encontrado'
      }
    }
    
    const email = resultOfUserClient.users[0].email;
    const password = resultOfUserClient.users[0].password;

    return { email, password };
  }
}
