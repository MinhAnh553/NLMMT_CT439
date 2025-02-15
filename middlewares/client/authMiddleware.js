const isAuthorized = (req, res, next) => {
    if (!req.session.user) {
        return res.render('client/pages/home/index', { showLoginModal: true });
    }
    next();
};

export default {
    isAuthorized,
};
