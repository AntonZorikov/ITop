import Sequelize from "sequelize"
import chalk from 'chalk';

const sequelize = new Sequelize('itop', 'postgres', 'a182736', {
  host: 'localhost',
  dialect: 'postgres',
});

const Post = sequelize.define('Post', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
//   Post.sync()
//   .then(() => {
//     console.log('Table created successfully.');
//   })
//   .catch((error) => {
//     console.error('Unable to create table:', error);
//   });
sequelize.sync().then(result=>{
    // console.log(result);
}).catch(err=> console.log(err));

export async function DB_GET_ALL_POSTS() {
    try {
        const posts = await Post.findAll();
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




