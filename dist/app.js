"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const wsp_1 = __importDefault(require("./wsp"));
let qrTxt = "";
const wsp = wsp_1.default.getInstance();
wsp.iniciarInstancia('0468774995');
const server = http_1.default.createServer((req, res) => {
    console.log(wsp.getSession('0468774995'));
    res.end('hello world ' + wsp.getQr('0468774995'));
});
server.listen(3002, () => { console.log("Funcionando2"); });
