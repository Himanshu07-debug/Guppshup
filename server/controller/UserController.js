import User from '../models/UserModel.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

// Register route Controller
export const registerUser = async(req, res) => {

    try {

        const { userName, email, password } = req.body;

        const user = await User.findOne({ email: email });

        if (user) {
            res.status(400).json({ error: "User Already Exist, Please Sign In!!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            userName,
            email,
            password: hashedPassword
        }

        const result = await new User(newUser);

        const savedUser = await result.save();

        res.status(201).json(savedUser);

    }
    catch (err) {

        res.status(500).json({ error: err.message });

    }

}

// Login user route
export const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email: email });
        // console.log(user.toJSON());

        if (!user) {
            res.status(400).json({ error: "User not exist!!, please register." });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            res.status(400).json({ error: "Invalid credentials. Please check your password!!" });
        }
        else {
            // Generating accessToken as well as the refreshToken
            const accessToken = jwt.sign(user.toJSON(), process.env.ACCESS_SECRET_KEY, { expiresIn: "20d"});
            const refreshToken = jwt.sign(user.toJSON(), process.env.REFRESH_SECRET_KEY);
            
            // deleting the field before sending response, becz wo local storage pe nhi dikhna chahiye
            delete user.password;


            res.status(200).json({ accessToken: accessToken, refreshToken: refreshToken, user:user});
        
        }
    }
    catch (err) {

        res.status(500).json({ error: err.message });

    }
}

// user avatar setting route.. Login/ register ke time user ban gya tha.. usko sirf update krna hai
export const setUserAvatar = async (req, res) => {

    try {
        const { id } = req.params;  // user ki id bheje ho
        const { avatarPath } = req.body;

        const user = await User.findByIdAndUpdate(id, { isAvatarSet: true, avatarPath: avatarPath }, { new: true });

        res.status(200).json(user);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }

}

export const searchUser = async (req, res) => {

    try {
        const { userName } = req.params;

        const result = await User.find({

            // If you had multiple conditions(e.g., searching by userName or email), $or would return results that match any of those conditions.
            // Here we have only 1 condition. so we can skip the $or

            // If you plan to add more search criteria later, it would be more useful.

            $or: [
                { userName: { $regex: userName, $options: 'i' } }   
                // $regex --> allowed to do pattern matching meaning it can find any user whose username contains the search string.
                // $options --> The i option makes the search case-insensitive, so it matches userName regardless of 
                //              whether it's in uppercase or lowercase.
            ]
        });

        res.status(200).json(result);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }

}

export const addContact = async (req, res) => {
    try {
        const { userId, contactId } = req.params;

        const user = await User.findById(userId);

        let contacts = [...user.contacts];


        if (!contacts.includes(contactId)) {
            contacts = [...contacts, contactId];

            const result = await User.findByIdAndUpdate(userId, { contacts: contacts }, { new: true });

            res.status(200).json(result);
        }
        else {
            res.status(400).json({ error: "User already in contact list!!" });
        }
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const getAllContacts = async(req, res) => {
    try{
        const { id } = req.params;
        
        const responseArr = [];

        const user = await User.findById(id);

        const contacts = user.contacts;

        for(let i=0; i<contacts.length; i++){
            
            // 0 means excluding the particular fields from the object
            const contactUser = await User.findById(contacts[i]).select({password : 0, isAvatarSet : 0, contacts : 0, __V : 0});

            responseArr.push(contactUser);
        }

        res.status(200).json(responseArr);
    }
    catch(err){
        res.status(500).json({ error: err.message });
    }
}



