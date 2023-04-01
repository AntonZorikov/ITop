import express from "express";
import path from 'path'
import bodyParser from "body-parser"
import chalk from 'chalk';
import { DB_GET_ALL_USERS } from "./DB.js";


const app = express()
const PORT = 3000

const __dir = path.resolve()

app.set('view engine', 'ejs');
app.set('views', path.resolve(__dir, 'html&ejs'))

app.use(express.static(path.resolve(__dir, 'static')))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('home')
})
app.post('/', async (req, res) => {
  const { name, username, password, email } = req.body;
  console.log(chalk.bgGreen(name, username, password, email));
  if(name == 'updateposts'){
    console.log(chalk.bgGreen('update posts'));
    const result = await DB_GET_ALL_USERS();
    res.send(result);
  }
});

app.listen( PORT, () => {
  console.log(chalk.bgWhite.black(`Server listen on ${PORT}`));
})