const jwt = require("jsonwebtoken");

module.exports = (request, response, next) => {
  try {
    //On recupere le token
    const token = request.headers.authorization.split(" ")[1];
    //On decode le token
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    //On recupere id utilisateur et on le decode
    const userId = decodedToken.userId;
    //On transmet l'userId avec l'objet auth 
    request.auth = {
      userId: userId,
    };
    next();
  } catch (error) {
    response.status(401).json({ error });
  }
};
