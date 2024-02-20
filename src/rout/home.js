import { getTokenAndCookie } from "./token.js";
import { ObjectId } from "mongodb";
import { messagesError } from "../messages/messagesError.js";
import { messagesSusses } from "../messages/messagesSusses.js";

export async function getHome(req, res, usersdb, recipesdb) {
  try {
    let tokenInfo = await getTokenAndCookie(req, usersdb);
    if (tokenInfo) {
      let { email, tokenIsPresent, userId } = tokenInfo;
      let user = await usersdb.findOne({
        _id: new ObjectId(userId),
        email: email,
      });
      let arrRecipes = await recipesdb.find().toArray();
      let recipesArray = [...arrRecipes];
      recipesArray.sort((a, b) => b.likes - a.likes);
      res.render("home", {
        arrRecipes: recipesArray,
        tokenIsPresent: tokenIsPresent,
        login: user.login,
        email: email,
        role: user.role,
        title: messagesSusses.success.titleHome,
      });
    } else {
      let arrRecipes = await recipesdb.find().toArray();
      let recipesArray = [...arrRecipes];
      recipesArray.sort((a, b) => b.likes - a.likes);
      res.render("home", {
        arrRecipes: recipesArray,
        title: messagesSusses.success.titleHome,
      });
    }
  } catch (error) {
    console.error(error, messagesError.errors.getHomeError);
  }
}
