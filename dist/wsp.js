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
Object.defineProperty(exports, "__esModule", { value: true });
const whatsapp_web_js_1 = require("whatsapp-web.js");
class WhatsAppService {
    constructor() {
        this.sessions = new Map();
    }
    static getInstance() {
        if (!WhatsAppService.instance) {
            WhatsAppService.instance = new WhatsAppService();
        }
        return WhatsAppService.instance;
    }
    createSession(sessionName) {
        console.log(`Se ha iniciado la sesion de : ${sessionName}`);
        const client = new whatsapp_web_js_1.Client({
            authStrategy: new whatsapp_web_js_1.LocalAuth({ clientId: sessionName }),
            puppeteer: { headless: true, args: ['--no-sandbox'] },
        });
        client.on('qr', (qr) => {
            if (!this.getQr(sessionName)) {
                //io.emit('newQr',{message:"new",qr,sessionName});
                console.log(`Se ha generado un qr para la sesion "${sessionName}".`);
            }
            this.sessions.set(sessionName, { client, qr, estado: 'no_vinculado' });
        });
        client.on('ready', () => {
            const currentSession = this.sessions.get(sessionName);
            if (currentSession && currentSession.estado !== 'vinculado') {
                currentSession.estado = 'vinculado';
                currentSession.qr = '';
            }
            console.log(`WhatsApp sesión "${sessionName}" lista.`);
        });
        client.on('close', (reason) => {
            const currentSession = this.sessions.get(sessionName);
            if (currentSession && currentSession.estado !== 'no_vinculado') {
                currentSession.estado = 'no_vinculado';
                currentSession.qr = '';
            }
            console.log(`La sesión ${sessionName} fue cerrada debido a una sesión inválida.`);
        });
        client.on('auth_failure', (m) => { console.log('auth_fail', m); });
        client.on('disconnected', (m) => { console.log('disco', m); });
        client.on('change_state', (m) => { console.log('change', m); });
        client.on('message', (m) => {
            //io.emit('newChat',{message:m.from});
            console.log(m);
        });
        client.initialize();
        this.sessions.set(sessionName, { client, qr: '', estado: 'no_vinculado' });
        return client;
    }
    iniciarInstancia(sessionName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.sessions.has(sessionName)) {
                const sessionClient = this.createSession(sessionName);
                if (sessionClient) {
                    this.sessions.set(sessionName, { client: sessionClient, qr: '', estado: 'Incializando' });
                }
            }
        });
    }
    getLatestChats(sessionName) {
        return __awaiter(this, void 0, void 0, function* () {
            const sessionData = this.sessions.get(sessionName);
            if (!sessionData || sessionData.estado !== 'vinculado') {
                return undefined;
            }
            const client = sessionData.client;
            // Obtener y devolver los últimos chats
            const chats = yield client.getChats();
            return chats;
        });
    }
    getMsg(sessionName, chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sessionData = this.sessions.get(sessionName);
            if (!sessionData || sessionData.estado !== 'vinculado') {
                return undefined;
            }
            const client = sessionData.client;
            // Obtén el chat por su ID
            const chat = yield client.getChatById(chatId);
            if (!chat) {
                return undefined;
            }
            // Obtén los mensajes del chat
            const messages = yield chat.fetchMessages({ limit: 50 });
            return messages;
        });
    }
    enviarMensaje(inputs) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { sessionName, chatId, number, message } = inputs;
                const sessionData = this.sessions.get(sessionName);
                if (sessionData && sessionData.estado === 'vinculado') {
                    const { client } = sessionData;
                    client.sendMessage(!chatId ? number + "@c.us" : chatId, message);
                }
                else {
                    return undefined;
                }
            }
            catch (error) {
                return undefined;
            }
        });
    }
    getSession(sessionName) {
        const sessionData = this.sessions.get(sessionName);
        return sessionData;
    }
    getQr(sessionName) {
        const sessionData = this.sessions.get(sessionName);
        return sessionData === null || sessionData === void 0 ? void 0 : sessionData.qr;
    }
}
exports.default = WhatsAppService;
