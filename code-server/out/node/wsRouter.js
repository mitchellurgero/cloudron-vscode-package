"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = exports.WebsocketRouter = exports.handleUpgrade = void 0;
var express = __importStar(require("express"));
var http = __importStar(require("http"));
exports.handleUpgrade = function (app, server) {
    server.on("upgrade", function (req, socket, head) {
        socket.pause();
        req.ws = socket;
        req.head = head;
        req._ws_handled = false;
        app.handle(req, new http.ServerResponse(req), function () {
            if (!req._ws_handled) {
                socket.end("HTTP/1.1 404 Not Found\r\n\r\n");
            }
        });
    });
};
var WebsocketRouter = /** @class */ (function () {
    function WebsocketRouter() {
        this.router = express.Router();
    }
    WebsocketRouter.prototype.ws = function (route) {
        var _a;
        var handlers = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            handlers[_i - 1] = arguments[_i];
        }
        (_a = this.router).get.apply(_a, __spread([route], handlers.map(function (handler) {
            var wrapped = function (req, res, next) {
                ;
                req._ws_handled = true;
                return handler(req, res, next);
            };
            return wrapped;
        })));
    };
    return WebsocketRouter;
}());
exports.WebsocketRouter = WebsocketRouter;
function Router() {
    return new WebsocketRouter();
}
exports.Router = Router;
//# sourceMappingURL=wsRouter.js.map