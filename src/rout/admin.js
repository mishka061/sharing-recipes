import { getTokenAndCookie } from "./token.js";
import { ObjectId } from "mongodb";
import { messagesError } from "../messages/messagesError.js";
import { messagesSusses } from "../messages/messagesSusses.js";

export async function getAdmin(req, res, usersdb, recipesdb) {
  try {
    const tokenInfo = await getTokenAndCookie(req, usersdb);
    if (tokenInfo) {
      const { email, tokenIsPresent, userId } = tokenInfo;
      let user = await usersdb.findOne({
        _id: new ObjectId(userId),
        email: email,
      });
      let arrRecipes = await recipesdb.find().toArray();
      const recipesArray = [...arrRecipes];
      recipesArray.sort((a, b) => b.likes - a.likes);
      res.render("admin", {
        arrRecipes: recipesArray,
        tokenIsPresent: tokenIsPresent,
        login: user.login,
        email: email,
        role: user.role,
        title: messagesSusses.success.titleProfileAdministrator,
      });
    } else {
      let arrRecipes = await recipesdb.find().toArray();
      const recipesArray = [...arrRecipes];
      recipesArray.sort((a, b) => b.likes - a.likes);
      res.render("admin", {
        arrRecipes: recipesArray,
        title: messagesSusses.success.titleProfileAdministrator,
      });
    }
  } catch (error) {
    console.error(error, messagesError.errors.getAdminError);
  }
}
