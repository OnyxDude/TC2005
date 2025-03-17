const User = require('../models/user.model');

exports.getSignIn = (req, res) => {
    if (req.session.isLoggedIn) {
        return res.redirect('/');
    }
    res.render('auth/signin', {
        title: 'Iniciar Sesión',
        error: req.session.error,
        csrfToken: req.csrfToken(),
    });
    delete req.session.error;
};

exports.getSignUp = (req, res) => {
    if (req.session.isLoggedIn) {
        return res.redirect('/');
    }
    res.render('auth/signup', {
        title: 'Registrarse',
        error: req.session.error,
        csrfToken: req.csrfToken(),
    });
    delete req.session.error;
};

exports.postSignIn = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.validateCredentials(username, password);
        
        if (user) {
            req.session.isLoggedIn = true;
            req.session.userId = user.id;
            req.session.userName = user.name;
            return req.session.save(err => {
                if (err) {
                    console.error(err);
                    req.session.error = 'Error al iniciar sesión';
                    return res.redirect('/auth/signin');
                }
                const redirectTo = req.cookies.redirectTo || '/';
                res.clearCookie('redirectTo');
                res.redirect(redirectTo);
            });
        }
        
        req.session.error = 'Usuario o contraseña incorrectos';
        res.redirect('/auth/signin');
    } catch (error) {
        console.error(error);
        req.session.error = 'Error al iniciar sesión';
        res.redirect('/auth/signin');
    }
};

exports.postSignUp = async (req, res) => {
    try {
        const { username, password, name, confirmPassword } = req.body;
        
        if (password !== confirmPassword) {
            req.session.error = 'Las contraseñas no coinciden';
            return res.redirect('/auth/signup');
        }

        const user = new User(username, password, name);
        await user.save();
        req.session.success = 'Usuario registrado exitosamente';
        res.redirect('/auth/signin');
    } catch (error) {
        console.error(error);
        req.session.error = error.message === 'Username already exists' ? 
            'El nombre de usuario ya existe' : 
            'Error al registrar usuario';
        res.redirect('/auth/signup');
    }
};

exports.postLogout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};