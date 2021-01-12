import * as express from "express";
import http from "http";
import { DefaultedArgs } from "../cli";
import { Heart } from "../heart";
declare global {
    namespace Express {
        interface Request {
            args: DefaultedArgs;
            heart: Heart;
        }
    }
}
/**
 * Register all routes and middleware.
 */
export declare const register: (app: express.Express, wsApp: express.Express, server: http.Server, args: DefaultedArgs) => Promise<void>;
