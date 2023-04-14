import Sequelize from "sequelize"
import bcrypt from "bcrypt";
import chalk from 'chalk';

const saltRounds = 10;

const sequelize = new Sequelize('itop', 'postgres', 'a182736', {
  host: 'localhost',
  dialect: 'postgres',
});

//============POST BLOCK============

const Post = sequelize.define('Post', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    UserId: {
      type: Sequelize.INTEGER,
    },
    Name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    Text: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    Rating: {
        type: Sequelize.INTEGER,
      },
    Views: {
        type: Sequelize.INTEGER,
      },
    Tags: {
        type: Sequelize.STRING,
      },
    Date: {
        type: Sequelize.STRING,
        allowNull: false,
      },
  });
// Post.sync()
// .then(() => {
//   console.log('Table created successfully.');
// })
// .catch((error) => {
//   console.error('Unable to create table:', error);
// });

export async function DB_GET_ALL_POSTS() {
    try {
        const posts = await Post.findAll({order: [['createdAt', 'DESC']]});
        const id = posts.map(post => post.id);
        const name = posts.map(post => post.Name);
        const Text = posts.map(post => post.Text);
        const Rating = posts.map(post => post.Rating);
        const Views = posts.map(post => post.Views);
        const Tags = posts.map(post => post.Tags);
        const values = {id, name, Text, Rating, Views, Tags}
        return posts;
    } catch (err) {
        console.error('Error retrieving posts:', err);
        return [];
    }
}

export async function DB_FIND_POST_BY_ID(id_, increment){
  const post = await Post.findOne({ where: { id: id_ } })
  const id = post.id
  const Name = post.Name
  const Text = post.Text
  const Rating = post.Rating
  const Views = post.Views
  const Tags = post.Tags
  const Likes = 0
  if(increment == true){
    post.Views += 1
  }
  const values = {id, Name, Text, Rating, Views, Tags, Likes}
  post.save()
  return values
}

export async function DB_CREATE_POST(data){
  await Post.create({
      UserId: data.id,
      Name: data.name,
      Text: data.text,
      Tags: data.tags,
      Views: 0,
      Rating: 0,
      Date: new Date().toString(),
  })
}

// await Post.create({
//     Name: "Puton In Programming",
//     Text: "Python yahoooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo",
//     Tags: "Python Programming",
//     Date: new Date().toString(),
// })
// .then((user) => {
//     return 1
// })
// .catch((error) => {
//     console.log(error);
//     return 0
// });

//============USER BLOCK============

const User = sequelize.define('User', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },  
  Email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  Password: {
    type: Sequelize.STRING,
    allowNull: false,
  },  
  Salt: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  Description: {
    type: Sequelize.STRING,
  },
  Rating: {
      type: Sequelize.FLOAT,
  },
  Reg_Date: {
      type: Sequelize.STRING,
      allowNull: false,
  },
  Vis_Date: {
      type: Sequelize.STRING,
  },
  Img: {
      type: Sequelize.STRING,
  },
});

export async function DB_CREATE_USER(data){
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(data.password, salt);
  try {
    await User.create({
      Name: data.username,
      Email: data.email,
      Password: hash,
      Salt: salt,
      Description: "",
      Rating: 0,
      Reg_Date: new Date().toString(),
      Vis_Date: new Date().toString(),
    });
    return 1;
  } catch (error) {
    return 0;
  }
}

export async function DB_USER_LOGIN(data){
  const user = await User.findOne({ where: { Email: data.email } });
  console.log(user);
  const password_user = user.Password
  const salt = user.Salt
  console.log(data.password, salt);
  const password_hash = await bcrypt.hash(data.password, salt);
  console.log(chalk.bgBlue(password_user, password_hash));
  if(password_user == password_hash){
    return user.id
  }
  else{
    return 0
  }
}

// User.sync()
// .then(() => {
//   console.log('Table created successfully.');
// })
// .catch((error) => {
//   console.error('Unable to create table:', error);
// });

//============LIKES BLOCK============

const Like = sequelize.define('Like', {
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  postId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  }
});

function Create_Like_Table(){
  Like.sync().then(() => {
    console.log('Table created successfully.');
  }).catch((error) => {
    console.error('Unable to create table:', error);
  });
}

export async function DB_FIND_LIKE(ui, pi){
  try{
    const like = await Like.findOne({ where: { userId: ui, postId: pi } });
    if(like){
      return 1
    }
    else{
      return 0
    }
  }
  catch(error){
    return 0
  }
}

export async function DB_CREATE_LIKE(data){
  const result = await DB_FIND_LIKE(data)
  console.log(data);
  console.log(result);
  if(result == 0){
    try {
      await Like.create({
        userId: data.userId,
        postId: data.postId,
      });
      return 1;
    } catch (error) {
      return 0;
    }
  }
}

export async function DB_DELETE_LIKE(data){
  try {
    await Post.destroy({ where: { userId: data.userId, postId: data.postId } })
    return 1;
  } catch (error) {
    return 0;
  }
}

sequelize.sync().then(result=>{
}).catch(err=> console.log(err));



