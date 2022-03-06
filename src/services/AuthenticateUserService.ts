import { getCustomRepository } from "typeorm";
import { UsersRepositories } from "../repositories/UsersRepositories";
import {compare} from "bcryptjs";
import { sign } from "jsonwebtoken";

interface IAuthenticateRequest {
    email: string;
    password: string;
}

class AuthenticateUserService {

    async execute({email, password} : IAuthenticateRequest) {

        const usersRepositories = getCustomRepository(UsersRepositories);

        //Verificar se email existe
        const user = await usersRepositories.findOne({
            email,
        });

        if (!user)
        {
            throw new Error("Email/Senha incorreta.")
        }

        //Verificar se senha está correta
        const passwordMatch = await compare(password, user.password)

        if (!passwordMatch) 
        {
            throw new Error("Email/Senha incorreta.")
        }

        //Gerar token
        const token = sign(
            {
                email: user.email
            },
            "059bb7fb47f6aff0201395803c976787", 
            {
                subject: user.id,
                expiresIn: "1d"
            }
        );
            return token;

    }

}

export {AuthenticateUserService};