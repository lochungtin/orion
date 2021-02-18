const router = require('express').Router();
let Device = require('../models/device.model');

router.route('/').get((req, res) => {
    Device.find()
        .then(dev => res.json(dev))
        .catch(err => res.status(400).json('Error: ' + err));
});

// add device
router.route('/add').post((req, res) => {
    const newDevice = new Device({ 
        name: req.body.name,
        rootDir: req.body.rootDir,
        uid: req.body.uid,
    });

    newDevice.save()
        .then(() => res.json('Device Added'))
        .catch(err => res.status(400).json('Error: ' + err));
});

// get report by id
router.route('/:id').get((req, res) => {
    Device.findById(req.params.id)
        .then(dev => res.json(dev))
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;