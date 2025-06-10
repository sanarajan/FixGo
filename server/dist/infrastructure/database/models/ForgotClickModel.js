"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgotClickModel = void 0;
const mongoose_1 = require("mongoose");
const ForgotClicksSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "User" },
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    clicked: { type: Boolean, default: false },
    linkCreatedAt: { type: Date, default: Date.now },
});
// TTL index to auto-remove expired tokens
ForgotClicksSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
const ForgotClickModel = (0, mongoose_1.model)("ForgotClick", ForgotClicksSchema);
exports.ForgotClickModel = ForgotClickModel;
//# sourceMappingURL=ForgotClickModel.js.map