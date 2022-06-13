const { v4: uuidv4 } = require("uuid");
const { User_game, User_biodata } = require("../models");

module.exports = {
  getBios: (req, res) => {
    User_biodata.findAll({ include: "user_game" })
      .then((results) => {
        res.render("list_bio", {
          arr: results,
          resourceName: "Biodata",
          cssFile: "dashboard.css",
          pageTitle: "FSW20 - Admin Dashboard",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  },

  getBio: (req, res) => {
    let bio;
    User_biodata.findByPk(req.params.id)
      .then((result) => {
        bio = result;
        return User_game.findAll();
      })
      .then((users) => {
        res.render("form_bio", {
          editMode: true,
          data: bio,
          users,
          cssFile: "dashboard.css",
          pageTitle: "FSW20 - Admin Dashboard",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  },

  getCreateBio: (req, res) => {
    User_game.findAll()
      .then((users) => {
        res.render("form_bio", {
          editMode: false,
          users,
          cssFile: "dashboard.css",
          pageTitle: "FSW20 - Admin Dashboard",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  },

  postCreateBio: (req, res) => {
    const { fullname, birthdate, address, userId } = req.body;

    User_biodata.create({
      id: uuidv4(),
      fullname,
      birthdate,
      address,
      userId,
    })
      .then((newBio) => {
        res.redirect("/bios");
      })
      .catch((err) => {
        return next(err);
      });
  },

  deleteBio: (req, res) => {
    const { id } = req.params;
    User_biodata.destroy({
      where: {
        id,
      },
    })
      .then((result) => {
        res.redirect("/bios");
      })
      .catch((err) => {
        console.log(err);
      });
  },

  putUpdateBio: (req, res) => {
    const { id } = req.params;
    const { fullname, birthdate, address, userId } = req.body;

    User_biodata.update(
      { fullname, birthdate, address, userId },
      { where: { id } }
    )
      .then((result) => {
        res.redirect("/bios");
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
