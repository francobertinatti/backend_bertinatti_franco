const passport = require('passport');
const local = require('passport-local');
const GithubStrategy = require('passport-github2')
const Users = require('../dao/models/Users.model');
const {createHash, passwordValidate} = require('../utils/cryptPassword.utils');
const usersCreate = require('../dao/Users.dao');
const logger = require('../utils/logger.utils')

const LocalStrategy = local.Strategy;

const initializePassport = ()=>{
    passport.use('register',
        new LocalStrategy(
            {passReqToCallback:true, usernameField:'email'},
            async (req,username,password,done)=>{
                try {
                    const {first_name, last_name, email, age, password} = req.body;
                    const user = await Users.findOne({email: username});
                    let role;
                    if (user){ //Esta parte se puede obviar poniendo unique:true en el Schema
                        logger.info('Usuario ya existe')
                        /* console.log('Usuario ya existe'); */
                        return done(null,false);
                    }
                    if (email === 'admin@admin.com' && password === 'admin'){
                        role = 'admin'
                    }else{
                        role = 'user'
                    }

                   
                    const newUserInfo = {
                        first_name,
                        last_name,
                        email,
                        age,
                        role,
                        password: createHash(password),
                    };

                    
                    const newUser = await usersCreate(newUserInfo)

                    return done(null, newUser);

                } catch (error) {
                    return done(error)
                }
            }
        )
    );
    passport.use('login',
        new LocalStrategy(
            {usernameField: 'email'},
            async(username,password,done) =>{
                try {
                    const user = await Users.findOne({email: username});

                    if(!user){
                        logger.error('Datos invalidos')
                        /* console.log('Usuario inexistente'); */
                        return done(null,false);
                    }

                    if(!passwordValidate(password, user)){
                        logger.info('Datos invalidos');
                        return done(null,false);
                    }

                    return done(null,user)
                } catch (error) {
                    return done(error);
                }
            }
        )
    );
    
    passport.serializeUser((user,done)=>{
        done(null,user.id)
    })

    passport.deserializeUser(async(id,done)=>{
        const user = await Users.findById(id);
        done(null,user)
    })
};

module.exports = initializePassport;
