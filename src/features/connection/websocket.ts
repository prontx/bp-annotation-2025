import { BaseMessage } from "./messages";

class Socket {
    socket: WebSocket | null
    #onReady: ((event: Event) => void) | null;
    #onMessage: ((event: MessageEvent) => void) | null;
    #onClose: ((event: Event) => void) | null;
    #onError: ((event: Event) => void) | null;

    public set onReady(cb: (event: Event) => void) {
        this.#onReady = cb

        if(this.socket) {
            this.socket.onopen = cb
        }
    }

    public set onMessage(cb: (event: MessageEvent) => void) {
        this.#onMessage = cb

        if(this.socket) {
            this.socket.onmessage = cb
        }
    }

    public set onClose(cb: (event: Event) => void) {
        this.#onClose = cb

        if(this.socket) {
            this.socket.onclose = cb
        }
    }

    public set onError(cb: (event: Event) => void) {
        this.#onError = cb

        if(this.socket) {
            this.socket.onerror = cb
        }
    }

    constructor() {
        this.socket = null

        this.#onReady = null
        this.#onMessage = null
        this.#onClose = null
        this.#onError = null
    }

    public connect(url: string) {
        if(!this.socket) {
            this.socket = new WebSocket(url)
            this.socket.onopen = this.#onReady || null
            this.socket.onclose = this.#onClose || null
            this.socket.onerror = this.#onError || null
            this.socket.onmessage = this.#onMessage || null
        }
    }

    public disconnect() {
        if(this.socket) {
            this.socket.close()
            this.socket = null
        }
    }

    public send(message: BaseMessage) {
        if(!this.socket) {
            throw new Error("Websocket is not open");
        }

        this.socket.send(message.toJson());
    }

    public isConnected() {
        if(!this.socket) {
            return false
        }

        return this.socket.readyState === WebSocket.OPEN
    }

    public isDisconnected() {
        if(!this.socket) {
            return true
        }
        
        return this.socket.readyState === WebSocket.CLOSED
    }
}

export var socket = new Socket()