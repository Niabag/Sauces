const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.signup = (request, response, next) => {
    //On crypte le mdp
    bcrypt.hash(request.body.password, 10)
    //On recupere le hash de mdp et on enregistre les donnés dans la base de donné
      .then(hash => {
        const user = new User({
          email: request.body.email,
          password: hash
        });
        user.save()
          .then(() => response.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => response.status(400).json({ error }));
      })
      .catch(error => response.status(500).json({ error }));
  };

exports.login = (request, response ,next) => {
    //On filtre pour recuperer l'email 
    User.findOne({ email: request.body.email })
        // On verifie si l'utilisateur existe
       .then(user => {
           if (!user) {
               return response.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
           }
           //On compare le mdp recuperer a ceux stocké dans la base de donné
           bcrypt.compare(request.body.password, user.password)
               .then(valid => {
                   if (!valid) {
                       return response.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                   }
                   //On verifie que c'est le bon utilisteur avec une verification par token
                   response.status(200).json({
                    userId: user._id,
                    token: jwt.sign(
                        { userId: user._id },
                        'RANDOM_TOKEN_SECRET',
                        { expiresIn: '24h' }
                    )
                   });
               })
               .catch(error => response.status(500).json({ error }));
       })
       .catch(error => response.status(500).json({ error }));

}

