import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import jwt from "passport-jwt";
import { createHash, isValidPassword } from "../utils/bcrypt.mjs";
import envConfig from "./env.config.mjs";
import userRepository from "../persistences/mongo/repositories/users.repository.mjs";
import cartsRepository from "../persistences/mongo/repositories/carts.repository.mjs";

const JWT_PRIVATE_KEY = envConfig.JWT_PRIVATE_KEY;
const COOKIE_TOKEN = envConfig.COOKIE_TOKEN;
const GITHUB_CLIENT_ID = envConfig.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = envConfig.GITHUB_CLIENT_SECRET;

const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies[COOKIE_TOKEN];
  }
  return token;
};

const initializePassport = () => {
  // Esta función inicializa las estrategias que configuremos
  // Para passport solo existen estas dos propiedades que puede recibir username y password
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      /* 
      "register" es el nombre de la estrategia que estamos creando.
      passReqToCallback: true, nos permite acceder a la request en la función de autenticación.
      usernameField: "email", nos permite definir el campo que usaremos como username de passport.
      done es una función que debemos llamar cuando terminamos de procesar la autenticación.
      Nota: passport recibe dos datos el username y el password, en caso de que no tengamos un campo username en nuestro formulario, podemos usar usernameField para definir el campo que usaremos como username.
      */
      async (req, username, password, done) => {
        try {
          const { first_name, last_name, email, age, role } = req.body;

          const user = await userRepository.getByEmail(username);
          if (user)
            return done(null, false, { message: "El usuario ya existe" });

          const cart = await cartsRepository.create();

          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            role,
            cart: cart._id,
          };

          const createUser = await userRepository.create(newUser);
          return done(null, createUser);
        } catch (error) {
          return done(error);
        }
      },
    ),
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email", passReqToCallback: true },
      async (req, email, password, done) => {
        try {
          const user = await userRepository.getByEmail(email);
          if (!user || !isValidPassword(user, password)) {
            return done(null, false, { message: "Invalid email or password" });
          }
          return done(null, user); // User found and authenticated
        } catch (error) {
          return done(error); // Pass the error to Passport
        }
      },
    ),
  );

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/api/session/githubCallback",
        scope: ["user:email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email =
            profile.emails && profile.emails.length > 0
              ? profile.emails[0].value
              : null;

          if (!email) {
            return done(
              new Error(
                "El correo electrónico no está disponible desde GitHub.",
              ),
            );
          }

          const user = await userRepository.getByEmail(email);
          if (!user) {
            const newUser = {
              first_name: profile._json.name,
              last_name: "",
              email: email,
              age: "",
              password: "",
            };
            const result = await userRepository.create(newUser);
            return done(null, result);
          } else {
            return done(null, user); // User found and authenticated
          }
        } catch (error) {
          return done(error); // Pass the error to Passport
        }
      },
    ),
  );

  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: JWT_PRIVATE_KEY,
        passReqToCallback: true,
      },
      async (req, jwt_payload, done) => {
        try {
          // Optionally check token expiration here
          if (!jwt_payload) {
            return done(new Error("JWT expired or invalid"), false);
          }
          return done(null, jwt_payload);
        } catch (error) {
          return done(error);
        }
      },
    ),
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser(async (id, done) => {
    const user = await userRepository.getById(id);
    done(null, user);
  });
};

export default initializePassport;
