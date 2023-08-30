"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const wsp_1 = __importDefault(require("./wsp"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
let qrTxt = "";
const app = (0, express_1.default)();
// Configuramos la ruta de archivos estáticos (public)
//app.use(express.static(path.join(__dirname, '../public/frontend/build')));
app.use(express_1.default.json());
const wsp = wsp_1.default.getInstance();
wsp.iniciarInstancia('0468774995');
// Configurar opciones de CORS
const corsOptions = {
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204, // Para preflight
};
// Habilitar CORS con las opciones configuradas
app.use((0, cors_1.default)(corsOptions));
// Middleware para ignorar el favicon
app.get('/favicon.ico', (req, res) => {
    res.status(204);
});
app.get('/inicio', (req, res) => {
    console.log("Data:", req.query);
    wsp.enviarMensaje({ sessionName: '0468774995', number: '5493406460886', message: 'Bambino' });
    //console.log(wsp.getSession('0468774995'));
    return res.json({ "Aa": "as" });
});
app.get('/*', (req, res) => {
    return res.json({ "Aa": "FUNCIONAAA", qr: wsp.getQr('0468774995') });
});
//app.post('/*',(req: Request, res: Response)=>{
//console.log(wsp.getSession('0468774995'))
//return res.json({status:"OK"})
//});
app.listen(3000, () => { console.log("Iniciado en puerto 3000"); });
