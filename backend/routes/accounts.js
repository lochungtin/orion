const router = require('express').Router();
let Account = require('../models/account.model');

router.route('/').get((req, res) => {
    Account.find()
        .then(acc => res.json(acc))
        .catch(err => res.status(400).json('Error: ' + err));
});

// add account
router.route('/add').post((req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const newAcc = new Account({ username, password });

    newAcc.save()
        .then(() => res.json('Account Created'))
        .catch(err => res.status(400).json('Error: ' + err));
});

// get account by id
router.route('/:id').get((req, res) => {
    Account.findById(req.params.id)
        .then(acc => res.json(acc))
        .catch(err => res.status(400).json('Error: ' + err));
});

// update password
router.route('/update/pswd/:id').post((req, res) => {
    Account.findById(req.params.id)
        .then(acc => {
            acc.password = req.body.password;

            acc.save()
                .then(() => res.json('Password Updated'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

// update rootDir
router.route('/update/rtdir/:id').post((req, res) => {
    Account.findById(req.params.id)
        .then(acc => {
            acc.rootDir = req.body.rootDir;

            acc.save()
                .then(() => res.json('Root Directory Updated'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;