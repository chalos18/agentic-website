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
exports.POST = POST;
function POST(request) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const body = yield request.json().catch(() => ({}));
            // TODO: replace stub with real AI integration
            return new Response(JSON.stringify({ reply: 'This is a stubbed AI response', received: body }), { status: 200 });
        }
        catch (err) {
            return new Response(JSON.stringify({ error: 'Failed' }), { status: 500 });
        }
    });
}
