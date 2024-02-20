import { getTokenAndCookie } from "./token.js";
import { ObjectId } from "mongodb";
import { messagesError } from "../messages/messagesError.js";
import { messagesSusses } from "../messages/messagesSusses.js";
import fs from "fs";

let arrCategory = {
  meat: "Мясо",
  bird: "Птица",
  fish: "Рыба",
  soups: "Супы",
  porridge: "Каши",
  salads: "Салаты",
  vegetables: "Овощи",
  bakery: "Выпечка",
};
let arrLunch = {
  breakfast: "Завтрак",
  lunch: "Обед",
  supper: "Ужин",
  snack: "Перекус",
};

export async function postCategory(req, res, usersdb, recipesdb) {
  try {
    let tokenInfo = await getTokenAndCookie(req, usersdb);
    let {elemId,lunch, category, id, comments, imagePath, recipeId } = req.body;
    let recipes = await recipesdb.findOne({ _id: new ObjectId(id) });
    let arrRecipes;
    if (category) {
      let cond = { $or: [{ dush: category }, { category: category }] };
      arrRecipes = await recipesdb.find(cond).toArray();
    }
    else if (lunch) {
      let cond = { $or: [{ dush: lunch }, { category: lunch}] };
      arrRecipes = await recipesdb.find(cond).toArray();
    }else if(elemId) {
      let recipesOneId = await recipesdb.findOne({ _id: new ObjectId(elemId) });
      let tokenIsPresent = tokenInfo;
      res.render("recipesId", {
        layout: false,
        tokenIsPresent:tokenIsPresent,
        recipesOneId: recipesOneId,
      });
      return;
    }
    else if (id) {
      if (!recipes.comments) {
        recipes.comments = [];
      }
      let commentNumber = recipes.comments.length + 1;
      let newComment = {
        textComment: comments,
        commentNumber: commentNumber,
        imgComment: imagePath,
      };
      recipes.comments.push(newComment);
      await recipesdb.updateOne(
        { _id: new ObjectId(id) },
        { $set: { comments: recipes.comments } }
      );
      res.render("commentAdd", {
        layout: false,
        newComment: newComment,
      });
      return;
    } 
    else if (comments) {
      let images = `img/${imagePath}`;
      fs.copyFile(imagePath, images, (err) => {
        if (err) {
          console.error(messagesError.errors.copyingError, err);
          return;
        }
        console.log(messagesSusses.success.successfulCopied);
      });
    } 
    else if (recipeId) {
      recipes = await recipesdb.findOne({ _id: new ObjectId(recipeId) });
      let updatedLikes = recipes.likes ? recipes.likes + 1 : 1;
      await recipesdb.updateOne(
        { _id: new ObjectId(recipeId) },
        { $set: { likes: updatedLikes } }
      );
      res.render("likes", {
        layout: false,
        updatedLikes: updatedLikes,
      });
      return; 
    } else {
      console.error(messagesError.errors.receivingDataError);
    }
    if (tokenInfo) {
      let { email, tokenIsPresent, userId } = tokenInfo;
      let user = await usersdb.findOne({
        _id: new ObjectId(userId),
        email: email,
      });
      res.render("category", {
        layout: false,
        category: arrCategory[category],
        lunch: arrLunch[lunch],
        arrRecipes: arrRecipes,
        tokenIsPresent: tokenIsPresent,
        login: user.login,
        email: email,
        role: user.role,
        title: messagesSusses.success.titleCategory + category,
      });
    } else {
      res.render("category", {
        layout: false,
        category: arrCategory[category],
        lunch: arrLunch[lunch],
        arrRecipes: arrRecipes,
        title: messagesSusses.success.titleCategory + category,
      });
    }
  } catch (error) {
    console.error(error, messagesError.errors.postCategoryError);
  }
}


















// export async function postCategory(req, res, usersdb, recipesdb) {
//   console.log("postCategory");

//   try {
//     let tokenInfo = await getTokenAndCookie(req, usersdb);
//     let {lunch, category, id, comments, imagePath, recipeId } = req.body;
//     console.log("req.body", req.body);
//     console.log("category", category);
//     console.log("imagePath", imagePath);
//     let recipes;
//     let arrRecipes;

//     if (category) {
//       let cond = { $or: [{ dush: category }, { category: category }] };
//       arrRecipes = await recipesdb.find(cond).toArray();
//     }
//     if (lunch) {
//       let cond = { $or: [{ dush: lunch }, { category: lunch}] };
//       arrRecipes = await recipesdb.find(cond).toArray();
//     }
//     if (comments) {
//       let images = `img/${imagePath}`;
//       fs.copyFile(imagePath, images, (err) => {
//         if (err) {
//           console.error("Ошибка при копировании файла:", err);
//           return;
//         }
//         console.log("Файл успешно скопирован в папку img.");
//       });
//       recipes = await recipesdb.findOne({ _id: new ObjectId(id) });


//       console.log('recipes', recipes)
//       if (id) {
//         if (!recipes.comments) {
//           recipes.comments = [];
//         }
//         let commentNumber = recipes.comments.length + 1;
//         let newComment = {
//           textComment: comments,
//           commentNumber: commentNumber,
//           imgComment: imagePath,
//         };
//         recipes.comments.push(newComment);
//         await recipesdb.updateOne(
//           { _id: new ObjectId(id) },
//           { $set: { comments: recipes.comments } }
//         );
//         res.render("commentAdd", {
//           layout: false,
//           newComment: newComment,
//         });
//         return;
//       } else {
//         console.log("no recipes.comments");
//       }
//     } else if (recipeId) {
//       recipes = await recipesdb.findOne({ _id: new ObjectId(recipeId) });
//       let updatedLikes = recipes.likes ? recipes.likes + 1 : 1;
//       await recipesdb.updateOne(
//         { _id: new ObjectId(recipeId) },
//         { $set: { likes: updatedLikes } }
//       );
//       res.render("likes", {
//         layout: false,
//         updatedLikes: updatedLikes,
//       });
//       return; 
//     } else {
//       console.log("no recipeId");
//     }

//     if (tokenInfo) {
//       let { email, tokenIsPresent, userId } = tokenInfo;
//       let user = await usersdb.findOne({
//         _id: new ObjectId(userId),
//         email: email,
//       });

//       res.render("category", {
//         layout: false,
//         category: arrCategory[category],
//         lunch: arrLunch[lunch],
//         recipes: recipes,
//         arrRecipes: arrRecipes,
//         tokenIsPresent: tokenIsPresent,
//         login: user.login,
//         email: email,
//         role: user.role,
//         title: messagesSusses.success.titleCategory + category,
//       });
//     } else {
//       res.render("category", {
//         category: arrCategory[category],
//         lunch: arrLunch[lunch],
//         layout: false,
//         recipes: recipes,
//         arrRecipes: arrRecipes,
//         title: messagesSusses.success.titleCategory + category,
//       });
//     }
//   } catch (error) {
//     console.error(error, messagesError.errors.postCategoryError);
//   }
// }
