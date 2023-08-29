"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
let qrTxt = "";
const server = http_1.default.createServer((req, res) => {
    res.end('hello world ' + qrTxt);
});
server.listen(3000, () => { console.log("Funcionando2"); });
// Agregar manejo de errores usando try-catch
(() => __awaiter(void 0, void 0, void 0, function* () {
    const { Client, LocalAuth } = require('whatsapp-web.js');
    const client = new Client({
        authStrategy: new LocalAuth({ clientId: "BASE" }),
        puppeteer: {
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--disable-gpu',
            ],
        },
    });
    client.on('qr', (qr) => {
        qrTxt = qr;
        console.log('QR RECEIVED', qr);
    });
    client.on('ready', () => {
        console.log('Client is ready!');
    });
    client.on('message', (m) => { console.log(m); });
    try {
        yield client.initialize();
    }
    catch (error) {
        console.error('Error during initialization:', error);
    }
}))();
