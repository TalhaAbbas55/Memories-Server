import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const isCustomAuth = token.length < 500; // Google OAuth token is longer than 500 characters

    let decodedData;
    if (token && isCustomAuth) {
      decodedData = jwt.verify(token, "test");
      req.userId = decodedData?.id;
    } else {
      decodedData = jwt.decode(token);
      req.userId = decodedData?.sub; // Google OAuth token has a sub property
    }
    next(); // If the user is authenticated, the next middleware will be executed
  } catch (error) {}
};

export default auth;
