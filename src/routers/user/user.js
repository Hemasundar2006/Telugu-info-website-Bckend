const express = require('express');
const bcrypt = require('bcrypt');
const userDB = require('../../models/user/user');

const router = express.Router();

const saltRounds = 10;


router.post('/register', async (req, res) => {
    const data = req.body;

    try {
        const user = await userDB.findOne({ email : data.email });
        if (user) {
            return res.status(400).json({ Success : false , message : 'User already exists please log in' });
        }

        // Create new user
        const document = new userDB(data);

        data.password = await bcrypt.hash(data.password, saltRounds);

        // Save user to database
        await document.save();
        return res.status(200).json({ success : true , data : document})

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userDB.findOne({ email : email });
        if (!user) {
            return res.status(400).json({ success: false, message: 'User not Found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        return res.status(200).json({ success: true, data: user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});



module.exports = router;