const User = require('../models/user.model');

exports.getSignIn = (req, res) => {
    if (req.session.isLoggedIn) {
        return res.redirect('/');
    }
    res.render('auth/signin', {
        title: 'Iniciar Sesión',
        error: req.session.error
    });
    delete req.session.error;
};

exports.getSignUp = (req, res) => {
    if (req.session.isLoggedIn) {
        return res.redirect('/');
    }
    res.render('auth/signup', {
        title: 'Registrarse',
        error: req.session.error
    });
    delete req.session.error;
};

exports.postSignIn = (req, res) => {
    const { username, password } = req.body;
    const user = User.validateCredentials(username, password);

    if (user) {
        req.session.isLoggedIn = true;
        req.session.userId = user.id;
        req.session.userName = user.name;

        const redirectTo = req.cookies.redirectTo || '/';
        res.clearCookie('redirectTo');
        return res.redirect(redirectTo);
    }

    req.session.error = 'Usuario o contraseña incorrectos';
    res.redirect('/auth/signin');
};

exports.postSignUp = (req, res) => {
    const { username, password, name, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        req.session.error = 'Las contraseñas no coinciden';
        return res.redirect('/auth/signup');
    }

    if (User.findByUsername(username)) {
        req.session.error = 'El nombre de usuario ya existe';
        return res.redirect('/auth/signup');
    }

    const user = new User(username, password, name);
    user.save();

    res.redirect('/auth/signin');
};

exports.postLogout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};