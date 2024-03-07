import express from "express";
import { router as movie } from "./api/movie";
import { router as person } from "./api/person";
import { router as stars } from "./api/stars";
import { router as creators } from "./api/creators";
import bodyParser from "body-parser";

export const app = express();

app.use(bodyParser.text());
app.use(bodyParser.json());

app.use("/movie", movie);
app.use("/person", person);
app.use("/stars", stars);
app.use("/creators", creators);