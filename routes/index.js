module.exports = (router) => {
    router.get(['/', '/home'], (req, res) => {
        res.render('home');
    });
    
    router.get('/signin', (req, res) => {
        res.render('signin');
    });

    router.get('/signup', (req, res) => {
        res.render('signup');
    });
    
    router.get('/editList', (req, res) => {
        res.render('editList');
    });
    
    router.get('/lists', (req, res) => {
        res.render('lists');
    });
    
    router.get('/sendlist', (req, res) => {
        res.render('sendlist');
    });

    router.get('/search', (req, res) => {
        res.render('searchresults');
    });
    
    router.get('/word', (req, res) => {
        res.render('wordpage');
    });
    
    router.get('/wordSubmission', (req, res) => {
        res.render('wordsubmission');
    });

    router.get('/library', (req, res) => {
        res.render('library');
    });

    router.get('/admin', (req, res) => {
        res.render('admin');
    });

    router.get('/FAQ', (req, res) => {
        res.render('FAQ');
    });
    
    router.get('/profile', (req, res) => {
        res.render('profile')
    })

    router.get('/sendList', (req, res) => {
        res.render('sendList')
    })

    router.get('/viewList', (req, res) => {
        res.render('viewList')
    })
};