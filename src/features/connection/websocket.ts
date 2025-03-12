import { Websocket, WebsocketEvent } from "websocket-ts";

var ws: WebSocket | null;

interface WebsocketOptions {
    onReady?: (event: Event) => void;
    onMessage?: (event: MessageEvent) => void;
    onClose?: (event: CloseEvent) => void;
    onError?: (event: Event) => void;
}

export function connectWebsocket(url: string, options: WebsocketOptions) {
    ws = new WebSocket(url)

    ws.onmessage = options.onMessage || null
    ws.onerror = options.onError || null
    ws.onclose = options.onClose || null
    ws.onopen = options.onReady || null
}

export function disconnectWebsocket() {
    ws = null
}

export function sendMessage(messageType: string, data: any) {
    if(!ws || !isConnected()) {
        throw new Error("Websocket is not open");
    }

    ws.send(JSON.stringify({
        'messageType': messageType,
        'data': data,
    }));
}

export function isConnected() {
    if(!ws) {
        return false
    }

    return ws.readyState === WebSocket.OPEN
}

export function isDisconnected() {
    if(!ws) {
        return true
    }
    
    return ws.readyState === WebSocket.CLOSED
}