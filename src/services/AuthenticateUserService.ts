
import { getCustomRepository } from "typeorm";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

import { UsersRepositories } from "../repositories/UsersRepositories";

interface IAuthenticateRequest {
  email: string;
  password: string;
}

class AuthenticateUserService {
  async execute({ email, password }: IAuthenticateRequest) {
    const usersRepositories = getCustomRepository(UsersRepositories);

    // Verificar se email existe
    const user = await usersRepositories.findOne({
      email,
    });

    if (!user) {
      throw new Error("Email/Password incorrect");
    }

    // verificar se senha está correta

    // 123456 / 783645734-sdhfhsdf7762374234234
    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new Error("Email/Password incorrect");
    }

    // Gerar token
    const token = sign(
      {
        email: user.email,
      },
      "25728f4b3540186b3b9f488688180016",
      {
        subject: user.id,
        expiresIn: "1d",
      }
    );

    return token;
  }
}

export { AuthenticateUserService };