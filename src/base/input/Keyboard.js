import hotkeys from 'hotkeys-js';

const DEFAULT_OPTIONS = {
    keyup: true,
    keydown: true
};

export default class Keyboard {

    constructor() {
        this.keys = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'l', 'k', 'j', 'h', 'g', 'f', 'd', 's', 'a', 'z', 'x', 'c', 'v', 'b', 'n', 'm'];
        this.specials = ['esc', 'escape', 'enter', 'space'];
        this.symbols = [];

        this.combos = [
            ...this.keys,
            ...this.specials,
            ...this.symbols
        ];

        this.enabled = false;
        this.listener = undefined;
    }

    static get KEYDOWN() { return 'keydown'; }
    static get KEYUP() { return 'keyup'; }

    register(combo) {
        if (this.enabled) {
            if (this.combos.includes(combo)) {
                console.warn('[Mage] Combo already registered');
                return;
            }
            this.combos.push(combo);
            hotkeys(combo, DEFAULT_OPTIONS, this.handler);
        }
    }

    handler = (event, handler) => {
        if (!this.enabled) return;
        this.listener(event, handler);
    }

    enable(cb = f => f) {
        this.enabled = true;
        this.listener = cb;
        this.combos.forEach(combo => {
            hotkeys(combo, DEFAULT_OPTIONS, this.handler);
        });
    }

    disable() {
        this.enabled = false;
        this.listener = undefined;
        this.combos.forEach(combo => {
            hotkeys.unbind(combo);
        });
    }

    isPressed(key) {
        return hotkeys.isPressed(key);
    }
}
