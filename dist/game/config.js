"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameConfig = void 0;
const phaser_1 = __importDefault(require("phaser"));
const PreloadScene_1 = __importDefault(require("./scenes/PreloadScene"));
const MainScene_1 = __importDefault(require("./scenes/MainScene"));
exports.gameConfig = {
    type: phaser_1.default.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: '#000000',
    scale: {
        mode: phaser_1.default.Scale.RESIZE,
        autoCenter: phaser_1.default.Scale.CENTER_BOTH,
    },
    scene: [PreloadScene_1.default, MainScene_1.default],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: false
        }
    }
};
