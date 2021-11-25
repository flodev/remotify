"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimationTypes = exports.PlayerAnimations = exports.ToiletAnimations = exports.DeskAnimations = void 0;
var DeskAnimations;
(function (DeskAnimations) {
    DeskAnimations["idle"] = "desk_idle";
})(DeskAnimations = exports.DeskAnimations || (exports.DeskAnimations = {}));
var ToiletAnimations;
(function (ToiletAnimations) {
    ToiletAnimations["idle"] = "toilet_idle";
    ToiletAnimations["dump"] = "toilet_dump";
    ToiletAnimations["pee"] = "toilet_pee";
})(ToiletAnimations = exports.ToiletAnimations || (exports.ToiletAnimations = {}));
var PlayerAnimations;
(function (PlayerAnimations) {
    PlayerAnimations["idle"] = "player_idle";
    PlayerAnimations["walk"] = "player_walk";
})(PlayerAnimations = exports.PlayerAnimations || (exports.PlayerAnimations = {}));
var AnimationTypes;
(function (AnimationTypes) {
    AnimationTypes["deskAnimation"] = "desk_animation";
    AnimationTypes["deskInteraction"] = "desk_interaction";
    AnimationTypes["toiletAnimation"] = "toilet_animation";
    AnimationTypes["toiletInteraction"] = "toilet_interaction";
})(AnimationTypes = exports.AnimationTypes || (exports.AnimationTypes = {}));
//# sourceMappingURL=animation.js.map