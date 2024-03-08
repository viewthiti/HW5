import express from "express";
import { conn } from "../dbconnect";
import { MovieGetResponse } from "../model/movie_get_res";
import mysql from "mysql";

export const router = express.Router();

router.get("/", (req, res) => {
  conn.query("select * from Movie", (err, result, fields) => {
    const prettyResult = JSON.stringify(result);

    // ส่งข้อมูลที่จัดรูปแบบแล้วกลับไปยัง client
    res.json(prettyResult);  });
});

//insert
router.post("/add", (req, res) => {
  let mov: MovieGetResponse = req.body;
  console.log(req.body);

  let sql =
    "INSERT INTO `Movie`(`name`, `rate`, `detail`, `url`, `type`, `year`) VALUES (?,?,?,?,?,?)";
  sql = mysql.format(sql, [
    mov.name,
    mov.rate,
    mov.detail,
    mov.url,
    mov.type,
    mov.year,
  ]);
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
  conn.query("delete from Movie where movid = ?", [id], (err, result) => {
    if (err) throw err;
    res.status(200).json({ affected_row: result.affectedRows });
  });
});

router.get("/search", (req, res) => {
  const name = req.query.name;
  const sql =
    "SELECT Movie.*, " +
    "GROUP_CONCAT(DISTINCT CONCAT_WS(' ', Creators.person_id, CreatorsPerson.name, CreatorsPerson.url, CreatorsPerson.age, CreatorsPerson.detail) SEPARATOR ';') AS creators, " +
    "GROUP_CONCAT(DISTINCT CONCAT_WS(' ', Stars.person_id, StarsPerson.name, StarsPerson.url, StarsPerson.age, StarsPerson.detail) SEPARATOR ';') AS stars " +
    "FROM Movie " +
    "LEFT JOIN Creators ON Movie.movid = Creators.movid " +
    "LEFT JOIN Stars ON Movie.movid = Stars.movid " +
    "LEFT JOIN Person AS CreatorsPerson ON CreatorsPerson.person_id = Creators.person_id " +
    "LEFT JOIN Person AS StarsPerson ON StarsPerson.person_id = Stars.person_id " +
    "WHERE Movie.name LIKE ? " +
    "GROUP BY Movie.movid";
  conn.query(sql, ["%" + name + "%"], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    } else {
      // จัดรูปแบบข้อมูลให้เป็นโครงสร้าง JSON ตามที่ต้องการ
      const movies = result.map(
        (row: {
          stars: string;
          creators: string;
          movid: any;
          name: any;
          rate: any;
          detail: any;
          url: any;
          type: any;
          year: any;
        }) => {
          return {
            movid: row.movid,
            name: row.name,
            rate: row.rate,
            detail: row.detail,
            url: row.url,
            type: row.type,
            year: row.year,
            Creators: row.creators
              ? row.creators.split(";").map((creators) => {
                  const [person_id, name, url, age, detail] =
                    creators.split(" ");
                  return { person_id, name, url, age, detail };
                })
              : [],
            Stars: row.stars
              ? row.stars.split(";").map((stars) => {
                  const [person_id, name, url, age, detail] = stars.split(" ");
                  return { person_id, name, url, age, detail };
                })
              : [],
          };
        }
      );
      res.json(movies);
    }
  });
});
