import express from "express";
import { conn } from "../dbconnect";
import mysql from "mysql";
import { PersonGetResponse } from "../model/person_get_res";
import { MovieGetResponse } from "../model/movie_get_res";

export const router = express.Router();
router.get("/", (req, res) => {
  conn.query("select * from Stars", (err, result, fields) => {
    res.json(result);
  });
});

//insert
router.post("/add", (req, res) => {
  let ps: PersonGetResponse = req.body;
  let mov: MovieGetResponse = req.body;
  let sql = "INSERT INTO `Stars`(`movid`, `person_id`) VALUES (?,?)";
  sql = mysql.format(sql, [mov.movid, ps.person_id]);
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
  conn.query("delete from Stars where starid = ?", [id], (err, result) => {
    if (err) throw err;
    res.status(200).json({ affected_row: result.affectedRows });
  });
});
