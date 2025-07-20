const localStrategy = require('passport-local').Strategy;
const { authenticate } = require('passport');
const { pool } = require('./dbConfig');
const bcrypt = require("bcrypt");
const { Result } = require('pg');

function initialize(passport) {

  const authenticateUser = (req, email, password, done) => {
    const name = req.body.name;

    pool.query(`SELECT * FROM users WHERE email=$1`, [email], (err, results) => { //Recherche une correspondance avec l'email renseigner
      if(err) {
        throw err;
      }

      if (results.rows.length > 0 ) { // Si l'email a bien été retrouver dans la BDD
        const user = results.rows[0];

        if (user.name !== name) { // compare le nom de la BDD avec celui renseignée
          return done(null, false, { message: "Name is incorrect" }); // si nom incorrect, renvoie un message d'erruer
        }

        bcrypt.compare(password, user.password, (err, isMatch)=>{ // compare le password de la BDD avec celui renseigné
          if(err){
            throw err;
          }

          if(isMatch){  // Si correct, connexion !
            return done(null, user);
          }
          else {  // Si password incorrect, renvoie un message d'erreur
            return done(null, false, {message: "Password is incorrect"});
          }
        });
      }
      else {  // Si email incorrect, renvoie un message d'erreur
        return done(null, false, {message: "Email not registered"});
      }  
    });
  }

  passport.use('local-custom', new localStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
      },authenticateUser)
  );

  passport.serializeUser((user, done) => done(null, user.id)); // Sauvegarde l'id de l'utilisateur connecter dans la session

  passport.deserializeUser((id,done) => {
    pool.query(
      `SELECT * FROM users WHERE id = $1`, [id], (err, results) => { // Recuperer toutes les infos de l'utilisateur connecter une fois et les stocks dans la session
        if (err) {
          throw err;
        }
        return done(null, results.rows[0]);
      }
    );
  });
}

module.exports = initialize;