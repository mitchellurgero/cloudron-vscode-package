"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
var express_1 = require("express");
exports.router = express_1.Router();
exports.router.get("/", function (req, res) {
    res.json({
        status: req.heart.alive() ? "alive" : "expired",
        lastHeartbeat: req.heart.lastHeartbeat,
    });
});
//# sourceMappingURL=health.js.map