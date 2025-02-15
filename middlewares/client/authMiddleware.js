const isAuthorized = (req, res, next) => {
    if (!req.session.user) {
        return res.render('client/pages/home/index', { showLoginModal: true });
    }
    next();
};

const infoUser = (req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
};

export default {
    isAuthorized,
    infoUser,
};
