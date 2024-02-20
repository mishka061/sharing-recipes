import jwt from "jsonwebtoken";
import { messagesError } from "../messages/messagesError.js";
import { messagesSusses } from "../messages/messagesSusses.js";

let secretKey = "12345";
export default secretKey;

export async function getTokenAndCookie(req) {
  try {
    let tokenIsPresent = req.cookies.token ? true : false;
    let decoded, email, userId, login;
    if (tokenIsPresent) {
      decoded = jwt.verify(req.cookies.token, secretKey);
      login = decoded.login;
      email = decoded.email;
      userId = decoded.userId;
      console.log(messagesSusses.success.successfulToken);
      return { decoded, email, tokenIsPresent, userId };
    } else {
      console.error(messagesError.errors.tokenVerificationError);
    }
  } catch (error) {
    console.log(error, messagesError.errors.tokenAndCookieError);
  }
}
