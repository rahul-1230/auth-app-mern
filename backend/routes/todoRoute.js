import express from "express";
import Todo from "../models/userTodo";
import {isAuth } from "../util";


const router = express.Router();




// @route    GET api/todos
// @desc     Get all todos
// @access   Private
router.get("/", isAuth, async (req, res) => {
    try {
        const todos = await Todo.find({
            user: req.user.id,
        }).sort({ date: -1 });
        res.json(todos);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route    POST api/todos
// @desc     Create a todo
// @access   Private
router.post("/", isAuth, async (req, res) => {

    if (!title && !description) {
        return res.status(400).json("Enter All Details");
    }

    try {
        const user = await User.findById(req.user.id).select("-password");

        const newTodo = new Todo({
            title: req.body.title,
            description: req.body.description,
            user: req.user.id,
            completed: req.user.completed,

        });

        const todo = await newTodo.save();

        res.json(todo);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
}
);

// @route    PUT api/todos/:id
// @desc     Update a todo
// @access   Private
router.put(
    "/:id", isAuth, async (req, res) => {

        if (!title && !description) {
            return res.status(400).json("Enter All Details");
        }
        try {
            const todo = await Todo.findById(req.params.id);




            // Check for ObjectId format and todo
            if (!req.params.id.match(/^[0-9a-fA-F]{24}$/) || !todo) {
                return res.status(404).json({ msg: "Todo not found" });
            }

            // Check user if the todo belongs to authenticated user
            if (todo.user.toString() !== req.user.id) {
                return res.status(401).json({ msg: "User not authorized" });
            }

            // Update the todo
            if (todo) {
                title: req.body.title
                description: req.body.description
                user: req.user.id
                completed: req.user.completed

            };

            await todo.save();

            res.json(todo);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server Error");
        }
    }
);

// @route    GET api/todos/:id
// @desc     Get todo by ID
// @access   Private
router.get("/:id", isAuth, async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        // Check for ObjectId format and todo besides if the todo belongs to authenticated user
        if (
            !req.params.id.match(/^[0-9a-fA-F]{24}$/) ||
            !todo ||
            todo.user.toString() !== req.user.id
        ) {
            return res.status(404).json({ msg: "Todo not found" });
        }
        res.json(todo);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route    DELETE api/todos/:id
// @desc     Delete a todo
// @access   Private
router.delete("/:id", isAuth, async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);

        // Check for ObjectId format and todo
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/) || !todo) {
            return res.status(404).json({ msg: "Todo not found" });
        }

        // Check user if the todo belongs to authenticated user
        if (todo.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: "User not authorized" });
        }

        await todo.remove();

        res.json({ msg: "Todo removed" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route    PUT api/todos/complete/:id
// @desc     Complete a todo
// @access   Private
router.put("/complete/:id", isAuth, async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);

        // Check for ObjectId format and todo
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/) || !todo) {
            return res.status(404).json({ msg: "Todo not found" });
        }

        // Check user if the todo belongs to authenticated user
        if (todo.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: "User not authorized" });
        }

        // Check if the todo has already been completed
        if (todo) {
            todo.completed = !todo.completed;
        }

        await todo.save();

        res.json(todo.completed);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});