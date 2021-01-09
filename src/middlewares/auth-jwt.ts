import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const verifyToken = (request: Request, response: Response, next: NextFunction) => {
    let token = request.headers["x-access-token"];
    if(!token){
        return response.status(403).json({msg: `No token provided`});
    }

    jwt.verify(token as string, process.env.JWT_SECRET, (err, decoded)=>{
        if(err){
            return response.status(401).json({msg: `Unauthorized`});
        }
        else{
            response.locals.userId = (decoded as {id: string}).id;
            request.userId = response.locals.userId;
            next();
        }
    })
}

export default {
    verifyToken,
}