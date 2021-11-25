"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameObjectInteractions = exports.ToiletInteractions = exports.DeskInteractions = void 0;
var DeskInteractions;
(function (DeskInteractions) {
    DeskInteractions["work_hard"] = "work_hard";
    DeskInteractions["sleep"] = "sleep";
    DeskInteractions["punch_the_display"] = "punch_the_display";
    DeskInteractions["hear_music"] = "hear_music";
})(DeskInteractions = exports.DeskInteractions || (exports.DeskInteractions = {}));
var ToiletInteractions;
(function (ToiletInteractions) {
    ToiletInteractions["take_a_dump"] = "toilet_take_a_dump";
    ToiletInteractions["take_a_pee"] = "toilet_take_a_pee";
    ToiletInteractions["flush"] = "toilet_flush";
})(ToiletInteractions = exports.ToiletInteractions || (exports.ToiletInteractions = {}));
exports.GameObjectInteractions = {
    desk: DeskInteractions,
    toilet: ToiletInteractions,
};
//# sourceMappingURL=gameObjectInteractions.js.map