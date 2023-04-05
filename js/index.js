import express from "express";
import path from 'path'
import bodyParser from "body-parser"
import chalk from 'chalk';
import { DB_GET_ALL_POSTS, DB_FIND_POST_BY_ID } from "./DB.js";
import { log } from "console";


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

app.get('/signin', (req, res) => {
  res.render('signin')
})

app.get('/login', (req, res) => {
  res.render('login')
})

app.get('/post', async(req, res) => {
  const postId = req.query.id;
  console.log(chalk.bgGreen("Load post with id: " + postId));
  const result = await DB_FIND_POST_BY_ID(postId);
  res.render('post', {postInf: result})

});


app.post('/', async (req, res) => {
  const { name, username, password, email } = req.body;
  console.log(chalk.bgGreen(name, username, password, email));
  if(name == 'updateposts'){
    console.log(chalk.bgGreen('update posts'));
    const result = await DB_GET_ALL_POSTS();
    res.send(result);
  }
});

app.listen( PORT, () => {
  console.log(chalk.bgWhite.black(`Server listen on ${PORT}`));
})