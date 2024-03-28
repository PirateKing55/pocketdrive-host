import { tokenDb } from "../model/db.js"

export const authMiddleware = async (req, res, next) => {
    const token = req.body.token
    try {
        const user = await tokenDb(token)
        req.body.user = user;
        if (!req.body.user) {
            res.status(500).send("You are not authorized")
            next(new Error("You are not authorized"))
        }
        next()
    } catch (error) {
        res.status(500).send("You are not authorized")
    }
}