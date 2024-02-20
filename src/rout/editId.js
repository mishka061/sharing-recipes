import { getTokenAndCookie } from "./token.js";
import { ObjectId } from "mongodb";
import { messagesError } from "../messages/messagesError.js";
import { messagesSusses } from "../messages/messagesSusses.js";
import fs from "fs";

export async function getEdit(req, res, usersdb, recipesdb) {
  try {
    const tokenInfo = await getTokenAndCookie(req, usersdb);
    if (tokenInfo) {
      const { email, tokenIsPresent, userId } = tokenInfo;
      let user = await usersdb.findOne({
        _id: new ObjectId(userId),
        email: email,
      });

      let recipes = await recipesdb.findOne({
        _id: new ObjectId(req.params.id),
      });
      res.render("editId", {
        recipes: recipes,
        tokenIsPresent: tokenIsPresent,
        login: user.login,
        email: email,
        role: user.role,
        title: messagesSusses.success.titleEditBlog,
      });
    } else {
      let recipes = await recipesdb.findOne({
        _id: new ObjectId(req.params.id),
      });
      res.render("editId", {
        recipes: recipes,
        title: messagesSusses.success.titleEditBlog,
      });
    }
  } catch (error) {
    console.error(error, messagesError.errors.getEditError);
  }
}

export async function postEdit(req, res, usersdb, recipesdb) {
  try {
    const tokenInfo = await getTokenAndCookie(req, usersdb);
    if (tokenInfo) {
      const { userId, email } = tokenInfo;
      let user = await usersdb.findOne({ email: email });
      console.log(user);
      let {
        id,
        title,
        preparation,
        description,
        ingridients,
        servings,
        category,
        dush,
      } = req.body;
      let image = req.file;
      const imagePath = `img/${image.originalname}`;
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
        category: category,
        dush: dush,
        img: image.originalname,
        userId: userId,
        login: user.login,
      };
      await recipesdb.updateOne({ _id: new ObjectId(id) }, { $set: form });
      res.redirect("/");
    }
  } catch (error) {
    console.error(error, messagesError.errors.postEditError);
  }
}
