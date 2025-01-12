"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const phaser_1 = __importDefault(require("phaser"));
const config_1 = require("./game/config");
require("./App.css");
function App() {
    (0, react_1.useEffect)(() => {
        const game = new phaser_1.default.Game(config_1.gameConfig);
        return () => {
            game.destroy(true);
        };
    }, []);
    return (<div id="game"></div>);
}
exports.default = App;
