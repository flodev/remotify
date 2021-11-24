"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSettingsByType = exports.ToiletContent = void 0;
const placeObjectType_1 = require("./placeObjectType");
var ToiletContent;
(function (ToiletContent) {
    ToiletContent["pee"] = "pee";
    ToiletContent["dump"] = "dump";
})(ToiletContent = exports.ToiletContent || (exports.ToiletContent = {}));
const getSettingsByType = (type, settings) => {
    switch (type) {
        case placeObjectType_1.PlaceObjectsTypes.Toilet:
            return Object.assign({}, settings);
        default:
            return settings;
    }
};
exports.getSettingsByType = getSettingsByType;
//# sourceMappingURL=gameObject.js.map