"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthCheckRouter = void 0;
const express_1 = require("express");
exports.healthCheckRouter = (0, express_1.Router)();
exports.healthCheckRouter.get('/', (req, res) => {
    res.status(200).json({ status: 'UP' });
});
