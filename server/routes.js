const router = require('express').Router();

router.get('/users', (req, res) => {
    res.send('Users');
});
router.get('/events', (req, res) => {
    res.send('Events');
});

module.exports = router;