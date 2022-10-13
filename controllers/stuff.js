const Sauces = require("../models/Sauces");
const fs = require("fs");
const { Console } = require("console");

exports.createSauces = (request, response, next) => {
  const sauceObject = JSON.parse(request.body.sauce);
  const sauces = new Sauces({
    userId: request.body.userId,
    //On recupere les champs saisient 
    ...sauceObject,
    //Source de la nouvelle image
    imageUrl: `${request.protocol}://${request.get("host")}/images/${
      request.file.filename
    }`,
    //On ajoute dans champs a la bd 
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  sauces
    .save()
    .then(() =>
      response.status(201).json({ message: "Sauce créee avec succés" })
    )
    .catch((error) => response.status(400).json({ error }));
};

exports.displaySauces = (request, response, next) => {
  //Afficher une sauce
  Sauces.find()
    .then((Sauces) => response.status(200).json(Sauces))
    .catch((error) => response.status(400).json({ error }));
};

exports.getOneSauces = (request, response, next) => {
  //Ajout d'une sauce
  Sauces.findOne({ _id: request.params.id })
    .then((Sauces) => response.status(200).json(Sauces))
    .catch((error) => response.status(404).json({ error }));
};

exports.modifySauces = (request, response, next) => {
  const sauceId = request.params.id;
  Sauces.findOne({ _id: sauceId })
    .then((sauce) => {
      // récuperation de l'URL de l'ancienne image
      oldSauceImageUrl = sauce.imageUrl;

      // si changement de l'image
      const sauceObject = request.file
        ? {
            ...JSON.parse(request.body.sauce),
            // source de la nouvelle image
            imageUrl: `${request.protocol}://${request.get("host")}/images/${
              request.file.filename
            }`,
          }
        : { ...request.body };

      Sauces.updateOne({ _id: sauceId }, { ...sauceObject, _id: sauceId })
        .then((sauce) => response.status(200).json(sauce))
        .catch(() =>
          response.status(403).json({ message: "Unahthorized request" })
        );

      // suppression de l'ancienne image
      const filename = oldSauceImageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        response.end;
      });
    })
    .catch(() =>
      response
        .status(500)
        .json({ message: "erreur lors de la modification du post" })
    );
};

exports.deleteSauces = (request, response, next) => {
  Sauces.findOne({ _id: request.params.id })
    .then((Sauces) => {
      //Verification de l'utilisateur
      if (Sauces.userId != request.auth.userId) {
        response.status(401).json({ message: "Not authorized" });
      } else {
        //Suppression de l'image dans le dossier images
        const filename = Sauces.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          //Suppression des champs de la sauce
          Sauces.deleteOne({ _id: request.params.id })
            .then(() => {
              response.status(200).json({ message: "Objet supprimé !" });
            })
            .catch((error) => response.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.likeSauces = (request, response, next) => {
  let like = request.body.like;
  let userId = request.body.userId;
  let sauceId = request.params.id;

  //like sauce
  if (like == 1) {
    Sauces.updateOne(
      {
        _id: sauceId,
      },
      { $push: { usersLiked: userId }, $inc: { likes: +1 } }
    )
      .then(() => {
        response.status(200).json({ message: "like ajouté !" });
      })
      .catch((error) => response.status(400).json({ error }));
  }

  // modifier like
  if (like == 0) {
    Sauces.findOne({ _id: sauceId })
      .then((sauce) => {
        if (sauce.usersLiked.includes(userId)) {
          Sauces.updateOne(
            { _id: sauceId },
            { $pull: { usersLiked: userId }, $inc: { likes: -1 } }
          )
            .then(() =>
              response.status(200).json({ message: "like modifié !" })
            )
            .catch((error) => response.status(400).json({ error }));
        }
        if (sauce.usersDisliked.includes(userId)) {
          Sauces.updateOne(
            { _id: sauceId },
            { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 } }
          )
            .then(() =>
              response.status(200).json({ message: "disliked modifié !" })
            )
            .catch((error) => response.status(400).json({ error }));
        }
      })
      .catch((error) => response.status(404).json({ error }));
  }

  //dislike sauce
  if (like == -1){
    Sauces.updateOne({_id: sauceId},
      {$push: {usersDisliked : userId}, $inc: {dislikes: +1}})
      .then(() => response.status(200).json({message: "disliked ajouté!"}))
      .catch((error) => response.status(400).json({error}));
  }
 
};
