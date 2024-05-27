import axios from 'axios';

export default class UserClient {
  private static instance: UserClient;
  private client: any;

  private constructor() {
    this.client = axios.create({
      baseURL: 'http://localhost:3004',
      timeout: 5000,
    });
  }

  public static getInstance() {
    if (!UserClient.instance) {
      UserClient.instance = new UserClient();
    }

    return UserClient.instance;
  }

  public async findUser(name: string) {
    const response = await this.client.get(`/users?name=${name}`);
    return response.data.length === 0 
      ? { msg: 'Usuário não encontrado' }
      : {
          msg: 'Usuário encontrado',
          users: response.data.map((user: any) => {
            delete user.createdAt;
            delete user.updatedAt;
            return user;
          }),
      };
  }
}
