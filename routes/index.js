module.exports = (router) => {
    router.get(['/', '/home'], (req, res) => {
        res.render('home');
    });
    
    router.get('/signin', (req, res) => {
        res.render('signin');
    });

    router.get('/signup', (req, res) => {
        res.sender('signup');
    });
    
    router.get('/category', (req, res) => {
        res.render('category');
    });
    
    router.get('/dashboard', (req, res) => {
        res.render('dashboard');
    });
    
    router.get('/editList/:id', (req, res) => {
        res.render('editList');
    });
    
    router.get('/game', (req, res) => {
        res.render('game');
    });
    
    router.get('/lists', (req, res) => {
        res.render('lists');
    });
    
    router.get('/sendlist/:id', (req, res) => {
        res.render('sendlist');
    });

    router.get('/search/:term', (req, res) => {
        res.render('searchresults');
    });
    
    router.get('/word/:word', (req, res) => {
        res.render('wordpage');
    });
    
    router.get('/submitword', (req, res) => {
        res.render('wordsubmission');
    });

    router.get('/library', (req, res) => {
        res.render('library');
    });
};