# Gupshup Server 🚀

Welcome to the backend repository of **Gupshup** - a real-time chat application built with Node.js, React.js, MongoDB, Redux, JWT, and Socket.io. This server handles user authentication, message management, and real-time communication, ensuring a seamless chat experience.

🔗 **Client Repository**: [Gupshup Client](https://github.com/Himanshu07-debug/Gupshup-client)  
🌐 **Live Website**: [Gupshup Live](https://guppshupp.netlify.app/)

## Features ✨

- **Secure Authentication**: Implemented robust authentication using JWT for secure login and refresh tokens to maintain session integrity.
- **User Account Management**: Designed user account management with customizable avatars, contact lists, and friend search functionality.
- **Real-Time Communication**: Enabled real-time chat, emoji sharing, and online status visibility in the contact list.

### Getting Started 🚀

To set up the server for this project, follow these steps:

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Himanshu07-debug/Gupshup-server.git
   cd Gupshup-server
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Create a `.env` File**
   Create a `.env` file in the root directory of the project and add the following environment variables:

   ```env
   ACCESS_SECRET_KEY=your_access_secret_key
   REFRESH_SECRET_KEY=your_refresh_secret_key
   DATABASE=mongodb://127.0.0.1:27017/your_database_name
   ```

   Replace `your_access_secret_key`, `your_refresh_secret_key`, and `your_database_name` with your actual values.

4. **Start the Server**
   ```bash
   npm run dev
   ```

   The server will start and connect to your MongoDB database using the credentials provided in the `.env` file.

5. **Testing the API**
   You can use tools like Postman to test the API endpoints.

Make sure MongoDB is running locally or configure the `DATABASE` variable to point to your MongoDB instance if it's hosted elsewhere.

## Models 📄

### Message Model

| Field    | Type   | Description                                      |
|----------|--------|--------------------------------------------------|
| text     | String | The text content of the message, encrypted at frontend |
| users    | Array  | Array of users involved in the conversation       |
| sender   | ObjectId | Reference to the sender (User model)            |
| timestamps | Date | Automatically records creation and update times   |

```javascript
import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
    message : {
        text : {
            type : String,
            required:true,
        },
    },
    users: Array,
    sender : {
        type: mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
    }
}, {timestamps : true});

const MessageModel = mongoose.model('messages', MessageSchema);

export default MessageModel;
```

### Token Model

| Field    | Type   | Description              |
|----------|--------|--------------------------|
| token    | String | JWT refresh token stored  |

```javascript
import mongoose from 'mongoose';

const TokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    }
});

const TokenModel = mongoose.model('token', TokenSchema);

export default TokenModel;
```

---

### User Model

| Field       | Type    | Description                              |
|-------------|---------|------------------------------------------|
| userName    | String  | The user's display name                  |
| email       | String  | The user's email address                 |
| password    | String  | Hashed password for secure authentication|
| isAvatarSet | Boolean | Whether the user has set an avatar image |
| avatarPath  | String  | URL or path to the user's avatar image   |
| contacts    | Array   | List of contacts added by the user       |

```javascript
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        min: 3,
        max: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        min: 5,
        max: 20
    },
    password: {
        type: String,
        required: true
    },
    isAvatarSet: {
        type: Boolean,
        default: false
    },
    avatarPath: {
        type: String,
        default: ""
    },
    contacts: {
        type: Array,
        default: []
    }
});

const UserModel = mongoose.model('user', UserSchema);

export default UserModel;
```

### API Routes

#### Message Routes

| Method | Route         | Description                        |
|--------|---------------|------------------------------------|
| POST   | `/add`        | Add a new message (requires authentication) |
| POST   | `/`           | Get all messages between users     |

```javascript
import express from 'express';
import { addMessage, getAllMessages } from '../controller/MessageController.js';
import { authenticateToken } from '../controller/jwt_controller.js';

const router = express.Router();

// Add a new message
router.post('/add', authenticateToken, addMessage);

// Get all messages between users
router.post('/', getAllMessages);

export default router;
```

---

#### User Routes

| Method | Route                        | Description                                     |
|--------|------------------------------|-------------------------------------------------|
| POST   | `/register`                  | Register a new user                            |
| POST   | `/login`                     | Login an existing user                         |
| PUT    | `/avatar/:id`                | Set or update the user's avatar                |
| PUT    | `/contact/:userId/:contactId`| Add a contact to the user's contact list       |
| GET    | `/search/:userName`          | Search for users by username                   |
| GET    | `/contact/:id`               | Get all contacts for the user                  |

```javascript
import express from 'express';
import { registerUser, loginUser, setUserAvatar, searchUser, addContact, getAllContacts } from '../controller/UserController.js';

const router = express.Router();

// Register a new user
router.post('/register', registerUser);

// Login an existing user
router.post('/login', loginUser);

// Set or update the user's avatar
router.put('/avatar/:id', setUserAvatar);

// Add a contact to the user's contact list
router.put('/contact/:userId/:contactId', addContact);

// Search for users by username
router.get('/search/:userName', searchUser);

// Get all contacts for the user
router.get('/contact/:id', getAllContacts);

export default router;
```

## 📬 Contact

Feel free to reach out to me at [himanshusharma2002.2000@gmail.com](mailto:himanshusharma2002.2000@gmail.com) or connect with me on [LinkedIn](https://www.linkedin.com/in/himanshu-sharma-dev).

Thank you for checking out Twitify! If you have any feedback or suggestions, feel free to open an issue or make a pull request.

Happy coding! 😊
