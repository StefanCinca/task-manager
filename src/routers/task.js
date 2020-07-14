const express = require("express");
const Task = require("../models/task");
const auth = require("../middleware/auth");
const router = new express.Router();

router.post("/tasks", auth, async (req, res) => {
  //const task = new Task(req.body);
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });
  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

//GET /tasks?completed=false
//GET /tasks
//GET /tasks?limit=10&skip=0
//GET /tasks?sortBy=createdAt_desc
router.get("/tasks", auth, async (req, res) => {
  const sort = {};

  const match = {};
  if (req.query.completed) {
    match.completed = req.query.completed === "true";
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split("_");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }
  try {
    //const tasks = await Task.find({ owner: req.user._id });
    await req.user
      .populate({
        path: "tasks",
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort,
        },
      })
      .execPopulate();
    res.send(req.user.tasks);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    //const task = await Task.findById(_id);
    const task = await Task.findOne({ _id, owner: req.user._id });
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const updateParams = Object.keys(req.body);
  const fields = ["description", "completed"];
  var allParamsOk = updateParams.every((param) => {
    return fields.includes(param);
  });
  if (!allParamsOk) {
    return res.status(400).send({ error: "The update params are not valid!" });
  }
  const _id = req.params.id;
  try {
    const task = await Task.findOne({ _id, owner: req.user._id });

    if (!task) {
      res.status(404).send();
    }
    updateParams.forEach((updateParam) => {
      task[updateParam] = req.body[updateParam];
    });
    await task.save();
    res.send(task);
    if (!task) {
    }
  } catch (error) {
    res.status(400).send();
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const taskDeleted = await Task.findOneAndDelete({
      _id,
      owner: req.user._id,
    });
    if (!taskDeleted) {
      res.status(404).send();
    }
    res.send(taskDeleted);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
