"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = notFoundHandler;
exports.errorHandler = errorHandler;
function notFoundHandler(_req, res) {
    res.status(404).json({ success: false, message: "Route not found" });
}
function errorHandler(error, _req, res, _next) {
    var _a;
    void _next;
    console.error(error);
    if (error.name === "CastError") {
        res
            .status(400)
            .json({ success: false, message: "Invalid resource identifier" });
        return;
    }
    res.status((_a = error.statusCode) !== null && _a !== void 0 ? _a : 500).json({
        success: false,
        message: error.statusCode ? error.message : "Internal server error",
    });
}
//# sourceMappingURL=errorHandler.js.map