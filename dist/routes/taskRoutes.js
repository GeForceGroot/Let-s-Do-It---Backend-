"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mongoose_1 = require("mongoose");
const Task_1 = require("../models/Task");
const router = (0, express_1.Router)();
const priorities = ["low", "medium", "high"];
const statuses = ["open", "in_progress", "completed"];
function fail(message, statusCode = 400) {
    return Object.assign(new Error(message), { statusCode });
}
function readTask(input, partial = false) {
    if (!input || typeof input !== "object" || Array.isArray(input))
        throw fail("A valid JSON task is required");
    const body = input;
    const value = {};
    if ("title" in body || !partial) {
        if (typeof body.title !== "string" ||
            !body.title.trim() ||
            body.title.trim().length > 120)
            throw fail("Title must be between 1 and 120 characters");
        value.title = body.title.trim();
    }
    if ("description" in body) {
        if (typeof body.description !== "string" || body.description.length > 1000)
            throw fail("Description must be at most 1000 characters");
        value.description = body.description.trim();
    }
    if ("scheduledFor" in body || !partial) {
        const date = new Date(String(body.scheduledFor));
        if (Number.isNaN(date.getTime()))
            throw fail("A valid scheduled date and time is required");
        value.scheduledFor = date;
    }
    if ("endsAt" in body || !partial) {
        const date = new Date(String(body.endsAt));
        if (Number.isNaN(date.getTime()))
            throw fail("A valid end date and time is required");
        value.endsAt = date;
    }
    if ("priority" in body) {
        if (!priorities.includes(body.priority))
            throw fail("Priority must be low, medium, or high");
        value.priority = body.priority;
    }
    if ("status" in body) {
        if (!statuses.includes(body.status))
            throw fail("Status must be open, in_progress, or completed");
        value.status = body.status;
    }
    if (partial && Object.keys(value).length === 0)
        throw fail("No supported task fields were provided");
    return value;
}
function validateId(id) {
    if (typeof id !== "string" || !(0, mongoose_1.isValidObjectId)(id))
        throw fail("Invalid task identifier");
}
const asyncRoute = (handler) => (req, res, next) => handler(req, res).catch(next);
async function ensureAvailableTimeRange(scheduledFor, endsAt, excludedTaskId) {
    if (endsAt <= scheduledFor)
        throw fail("End time must be after the start time");
    const overlapQuery = {
        // Older records did not have `endsAt`; for those records, use a one-hour
        // fallback so they are still protected from a new overlapping booking.
        $expr: {
            $and: [
                { $lt: ["$scheduledFor", endsAt] },
                {
                    $gt: [
                        {
                            $ifNull: [
                                "$endsAt",
                                {
                                    $dateAdd: {
                                        startDate: "$scheduledFor",
                                        unit: "hour",
                                        amount: 1,
                                    },
                                },
                            ],
                        },
                        scheduledFor,
                    ],
                },
            ],
        },
    };
    if (excludedTaskId)
        overlapQuery._id = { $ne: excludedTaskId };
    const conflict = await Task_1.TaskModel.exists(overlapQuery);
    if (conflict)
        throw fail("This time overlaps an existing task. Choose a different time range.", 409);
}
router.get("/", asyncRoute(async (req, res) => {
    const query = {};
    const { q, status, priority, from, to } = req.query;
    if (typeof q === "string" && q.trim()) {
        const keyword = q
            .trim()
            .slice(0, 120)
            .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        query.$or = [
            { title: { $regex: keyword, $options: "i" } },
            { description: { $regex: keyword, $options: "i" } },
        ];
    }
    if (typeof status === "string" && statuses.includes(status))
        query.status = status;
    if (typeof priority === "string" &&
        priorities.includes(priority))
        query.priority = priority;
    if (typeof from === "string" || typeof to === "string") {
        const dateQuery = {};
        if (typeof from === "string" && !Number.isNaN(new Date(from).getTime()))
            dateQuery.$gte = new Date(from);
        if (typeof to === "string" && !Number.isNaN(new Date(to).getTime()))
            dateQuery.$lte = new Date(to);
        if (Object.keys(dateQuery).length)
            query.scheduledFor = dateQuery;
    }
    const tasks = await Task_1.TaskModel.find(query)
        .sort({ scheduledFor: 1, createdAt: -1 })
        .lean();
    res.json({ success: true, data: tasks });
}));
router.post("/", asyncRoute(async (req, res) => {
    const data = readTask(req.body);
    await ensureAvailableTimeRange(data.scheduledFor, data.endsAt);
    const task = await Task_1.TaskModel.create(data);
    res.status(201).json({ success: true, data: task });
}));
router.patch("/:id", asyncRoute(async (req, res) => {
    var _a, _b, _c;
    validateId(req.params.id);
    const existing = await Task_1.TaskModel.findById(req.params.id);
    if (!existing)
        throw fail("Task not found", 404);
    const updates = readTask(req.body, true);
    if (updates.scheduledFor || updates.endsAt) {
        const scheduledFor = (_a = updates.scheduledFor) !== null && _a !== void 0 ? _a : existing.scheduledFor;
        const endsAt = (_c = (_b = updates.endsAt) !== null && _b !== void 0 ? _b : existing.endsAt) !== null && _c !== void 0 ? _c : new Date(scheduledFor.getTime() + 60 * 60 * 1000);
        updates.endsAt = endsAt;
        await ensureAvailableTimeRange(scheduledFor, endsAt, existing.id);
    }
    const task = await Task_1.TaskModel.findByIdAndUpdate(req.params.id, updates, {
        new: true,
        runValidators: true,
    });
    res.json({ success: true, data: task });
}));
router.delete("/:id", asyncRoute(async (req, res) => {
    validateId(req.params.id);
    const task = await Task_1.TaskModel.findByIdAndDelete(req.params.id);
    if (!task)
        throw fail("Task not found", 404);
    res.status(204).send();
}));
exports.default = router;
//# sourceMappingURL=taskRoutes.js.map