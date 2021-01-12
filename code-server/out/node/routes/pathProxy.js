"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wsRouter = exports.router = void 0;
var express_1 = require("express");
var qs_1 = __importDefault(require("qs"));
var http_1 = require("../../common/http");
var util_1 = require("../../common/util");
var http_2 = require("../http");
var proxy_1 = require("../proxy");
var wsRouter_1 = require("../wsRouter");
exports.router = express_1.Router();
var getProxyTarget = function (req, rewrite) {
    if (rewrite) {
        var query = qs_1.default.stringify(req.query);
        return "http://0.0.0.0:" + req.params.port + "/" + (req.params[0] || "") + (query ? "?" + query : "");
    }
    return "http://0.0.0.0:" + req.params.port + "/" + req.originalUrl;
};
exports.router.all("/(:port)(/*)?", function (req, res) {
    if (!http_2.authenticated(req)) {
        // If visiting the root (/:port only) redirect to the login page.
        if (!req.params[0] || req.params[0] === "/") {
            var to = util_1.normalize("" + req.baseUrl + req.path);
            return http_2.redirect(req, res, "login", {
                to: to !== "/" ? to : undefined,
            });
        }
        throw new http_1.HttpError("Unauthorized", http_1.HttpCode.Unauthorized);
    }
    // Absolute redirects need to be based on the subpath when rewriting.
    ;
    req.base = req.baseUrl + "/" + req.params.port;
    proxy_1.proxy.web(req, res, {
        ignorePath: true,
        target: getProxyTarget(req, true),
    });
});
exports.wsRouter = wsRouter_1.Router();
exports.wsRouter.ws("/(:port)(/*)?", http_2.ensureAuthenticated, function (req) {
    proxy_1.proxy.ws(req, req.ws, req.head, {
        ignorePath: true,
        target: getProxyTarget(req, true),
    });
});
//# sourceMappingURL=pathProxy.js.map