import { NextFunction, Request, Response } from "express";
import { UUID } from "mongodb";

interface UserInfo {
    id: UUID;
}

export async function setupUserBasicInfo(req: Request, res: Response, next: NextFunction) {
    const info: UserInfo = {id: new UUID('15cf51e8-2d08-447a-bfdd-98418dd833a3')}
    next();
}