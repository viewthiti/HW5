import express from "express";
import { conn } from "../dbconnect";
import mysql from "mysql";
import { PersonGetResponse } from "../model/person_get_res";

export const router = express.Router();
router.get("/", (req, res) => {
  conn.query("select * from Person", (err, result, fields) => {
    res.json(result);
  });
});

//insert
router.post("/add", (req, res) => {
  let ps: PersonGetResponse = req.body;
  let sql =
    "INSERT INTO `Person`(`name`, `age`, `detail`, `url`) VALUES (?,?,?,?)";
  sql = mysql.format(sql, [ps.name, ps.age, ps.detail, ps.url]);
  conn.query(sql, (err, result) => {
    if (err) throw err;
    res
      .status(201)
      .json({ affected_row: result.affectedRows, last_idx: result.insertId });
  });
});

//delete
router.delete("/:id", (req, res) => {
  let id = +req.params.id;
  conn.query("delete from Person where person_id = ?", [id], (err, result) => {
    if (err) throw err;
    res.status(200).json({ affected_row: result.affectedRows });
  });
});
