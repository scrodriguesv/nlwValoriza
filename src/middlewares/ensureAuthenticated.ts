import {Request, Response, NextFunction} from "express"
import { verify } from "jsonwebtoken";

interface IPayload {
    sub: string;
}

export function ensureAuthenticated(request: Request, response: Response, next: NextFunction)
{

    const authToken = request.headers.authorization;

    if(!authToken)
    {
        return response.status(401).end();
    }

    const [, token] = authToken.split(" ");

    try 
    {
        //Validar se token é válido
       const {sub} = verify(token, "059bb7fb47f6aff0201395803c976787") as IPayload;
       
       //Recuperar informações do usuário
       request.user_id= sub;

       return next();

    }
    catch(err)
    {
        return response.status(401).end();
    }
    

}