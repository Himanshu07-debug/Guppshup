import express from 'express';
import { registerUser, loginUser, setUserAvatar, searchUser, addContact, getAllContacts } from '../controller/UserController.js';

const router = express.Router();


router.post('/register', registerUser);
router.post('/login', loginUser);

router.put('/avatar/:id', setUserAvatar);
router.put('/contact/:userId/:contactId', addContact);
router.get('/search/:userName', searchUser);
router.get('/contact/:id', getAllContacts);


export default router;