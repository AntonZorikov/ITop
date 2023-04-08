import express from "express";
import path from 'path'
import bodyParser from "body-parser"
import chalk from 'chalk';
import { DB_GET_ALL_POSTS, DB_FIND_POST_BY_ID, DB_CREATE_USER, DB_USER_LOGIN, DB_CREATE_POST } from "./db.js";
import { log } from "console";


const app = express()
const PORT = 3000

const __dir = path.resolve()

app.set('view engine', 'ejs');
app.set('views', path.resolve(__dir, 'html&ejs'))

app.use(express.static(path.resolve(__dir, 'static')))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(express.json());
//============CREATE POST============

app.get('/createpost', (req, res) => {
  res.render('createpost')
})

app.post('/createpost', async (req, res) => {
  const { userid, name, text} = req.body;
  console.log(chalk.bgGreen("Create Post: ", userid, name, text));
  const data = { userid: userid, name: name , text: text, tags: ""};
  await DB_CREATE_POST(data);
});

//============HOME============

app.get('/', (req, res) => {
  res.render('home')
})

app.post('/', async (req, res) => {
  const { name, username, password, email } = req.body;
  console.log(chalk.bgGreen(name, username, password, email));
  if(name == 'updateposts'){
    console.log(chalk.bgGreen('update posts'));
    const result = await DB_GET_ALL_POSTS();
    res.send(result);
  }
});

//============SIGN IN============

app.get('/signin', (req, res) => {
  res.render('signin')
})

app.post('/signin', async(req, res) => {
  const password = req.body.password;
  const email = req.body.email;
  console.log(chalk.bgGreen("Signin In: ", email, password));
  const data = { password: password , email: email};
  const result = await DB_USER_LOGIN(data);
  console.log("Result:", result);
  if(result == 0){
    const response = {
      ok: false,
      id: -1
    }
    res.json(response)
  } 
  else {
    const response = {
      ok: true,
      id: result
    }
    res.json(response)
  }});

//============LOG IN============

app.get('/login', (req, res) => {
  res.render('login')
})

app.post('/login', async(req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  console.log(chalk.bgGreen("Log In: ", username, email, password));
  const data = { username: username, password: password , email: email};
  const result = await DB_CREATE_USER(data);
  if(result == 1){
    res.sendStatus(500);
  } else {
    res.sendStatus(200);
  }});

//============POST============

app.get('/post', async(req, res) => {
  const postId = req.query.id;
  console.log(chalk.bgGreen("Load post with id: " + postId));
  const result = await DB_FIND_POST_BY_ID(postId);
  res.render('post', {postInf: result})
});


//============================


app.listen( PORT, () => {
  console.log(chalk.bgWhite.black(`Server listen on ${PORT}`));
})