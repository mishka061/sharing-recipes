import { getTokenAndCookie } from "./token.js";
import { ObjectId } from "mongodb";
import { messagesError } from "../messages/messagesError.js";
import { messagesSusses } from "../messages/messagesSusses.js";
import fs from "fs";

export async function getCreateRecipes(req, res, usersdb) {
  try {
    const tokenInfo = await getTokenAndCookie(req, usersdb);
    if (tokenInfo) {
      const { email, tokenIsPresent, userId } = tokenInfo;
      let user = await usersdb.findOne({
        _id: new ObjectId(userId),
        email: email,
      });
      res.render("createRecipes", {
        user: user,
        role: user.role,
        tokenIsPresent: tokenIsPresent,
        email: email,
        title: messagesSusses.success.titleCreateRecipes,
      });
    }
  } catch (error) {
    console.error(error, messagesError.errors.getCreateRecipesError);
  }
}

export async function postCreateRecipes(req, res, usersdb, recipesdb) {
  console.log('postCreateRecipes')
  try {
    const tokenInfo = await getTokenAndCookie(req, usersdb);
    if (tokenInfo) {
      const { userId, email } = tokenInfo;
      let user = await usersdb.findOne({ email: email });
      let {
        title,
        preparation,
        description,
        ingridients,
        servings,
      } = req.body;
      console.log('req.body')
      let image = req.file;
      console.log('image', image)
      if (image) {
        const imagePath = `public/img/${image.originalname}`;
        fs.writeFileSync(imagePath, fs.readFileSync(image.path));
        const filteredIngridients = ingridients.filter(
          (ingridient) => ingridient !== null
        );
        let form = {
          title: title,
          description: description,
          preparation: preparation,
          ingridients: filteredIngridients,
          servings: servings,
          category: req.body.category,
          dush: req.body.dush,
          img: image.originalname,
          userId: userId,
          login: user.login,
        };
        await recipesdb.insertOne(form);
        res.redirect("/");
      } else {
        console.error(messagesError.errors.filedError);
        res.status(400).send(messagesError.errors.filedError);
        return;
      }
    }
  } catch (error) {
    console.error(error, messagesError.errors.postCreateRecipesError);
  }
}
