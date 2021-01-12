/// <reference types="node" />
import * as express from "express";
import * as expressCore from "express-serve-static-core";
import * as http from "http";
import * as net from "net";
export declare const handleUpgrade: (app: express.Express, server: http.Server) => void;
export interface WebsocketRequest extends express.Request {
    ws: net.Socket;
    head: Buffer;
}
export declare type WebSocketHandler = (req: WebsocketRequest, res: express.Response, next: express.NextFunction) => void | Promise<void>;
export declare class WebsocketRouter {
    readonly router: expressCore.Router;
    ws(route: expressCore.PathParams, ...handlers: WebSocketHandler[]): void;
}
export declare function Router(): WebsocketRouter;
