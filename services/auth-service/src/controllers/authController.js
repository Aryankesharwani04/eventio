import User from '../models/User.js';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = new User({ email, password });
        await user.save();
        res.status(201).send({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).send({ error: 'Error registering user' });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).send({ error: 'Invalid email or password' });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });
        res.send({ token, userId: user._id, message: 'User logged in successfully' });
    } catch (error) {
        res.status(400).send({ error: 'Error logging in' });
    }
};
