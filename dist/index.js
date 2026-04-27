"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//  Application entry point
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get("/", (req, res) => {
    console.log("Hello World!");
    res.json({ message: 'Docker is easy' });
});
const port = parseInt((_a = process.env.PORT) !== null && _a !== void 0 ? _a : "3000", 10);
app.listen(port, "::", () => {
    console.log(`Blog listening at http://localhost:${port}`);
});
