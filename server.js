//Liste des differents require
const express = require('express');
const app = express();
const { pool } = require("./dbConfig");
const bcrypt = require("bcrypt");
const session = require("express-session");
const flash = require("express-flash");
const passport = require("passport");
const initializePassport = require("./passportConfig");

initializePassport(passport);

//variable pour le port utilisé
const port = process.env.PORT || 4000;

//Setup de ejs
app.set('view engine', "ejs");

//Setup de express
app.use(express.urlencoded({extended: false}));

app.use(session({
  secret:'secret',
  resave: false, // ré-enregistre dans la session meme si l'information n'a pas été update (désactivé en false)
  saveUninitialized: false, //met dans la session meme si aucune information n'a été enregistrer dans le paramètre (désactivé en false)
}));

//Setup de passport
app.use(passport.initialize());
app.use(passport.session());

//Setup de flash
app.use(flash());

//Affichage des pages utilisateurs présent dans le dossier views
app.get('/', (req,res)=>{
  res.render("login");
});

app.get('/users/register', (req,res)=>{
  res.render("register");
});

app.get('/users/login', (req,res)=>{
  res.render("login");
});

app.get('/users/dashboard', (req, res) => {
  const { name, email, id } = req.user;
  res.render("dashboard", { name, email, id });
});

app.get('/users/logout', (req,res,next)=>{
  req.logOut(function(err) {
    if (err) { 
      return next(err); 
    } 
  req.flash("success_msg", "You have been logged out");
  res.redirect('/users/login');
  });
});

//Recupere les informations POST de notre formulaire
app.post('/users/register', async (req,res)=>{
  let {name, email, password, password2 } = req.body;

  //Regroupe tous les message d'erreur lors du remplissage du formulaire
  let errors = [];

  //Vérifie que tous les champs sont bien remplis
  if (!name || !email || !password || !password2){
    errors.push({message: "Please enter all fields"});
  }

  //Verifie que le password fait au minimum 6 lettres.
  if(password.length<6){
    errors.push({message: "The password should be at least 6 characters"});
  }

  //Verifie que le mot de passe est identique entre les deux champs
  if(password != password2){
    errors.push({message: "Password do not match"});
  }

  //Si au moins une erreur à été detecter, renvoie le message correspondant
  if(errors.length > 0){
    res.render('register', { errors });
  } 
  else { //Verification du formulaire ok
    let hashedPassword = await bcrypt.hash(password, 10);

    //Recuperation de la base de donnée pour comparaison email avec les informations POST
    pool.query(`SELECT * FROM users WHERE email = $1`, [email], (err, results) => {
      if(err){
        throw err;
      }

      if(results.rows.length > 0) { // Si l'email est déja enregistrer dans la BDD, renvoie une erreur
        errors.push({message : "Email already registered"});
        res.render('register', {errors});
      } 
      else { // Incrémentation des informations dans la BDD
        pool.query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, password;`, [name, email, hashedPassword], (err, results) => {
          if(err){
            throw err;
          }
          req.flash('success_msg', "You are now registered. Please log in"); // Setup d'un message de confirmation sur la page login
          res.redirect("/users/login"); // Redirection vers la page login après creation d'un compte
        })
      };
    })
  }
});

app.post("/users/login", passport.authenticate('local', {
  successRedirect: '/users/dashboard',
  failureRedirect: "/users/login",
  failureFlash: true
}))

//log dans le terminal si la connexion a réussi
app.listen(port, ()=>{
  console.log(`Server running on port : ${port}`);
});