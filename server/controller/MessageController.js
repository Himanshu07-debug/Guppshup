import Messages from '../models/MessageModel.js';

// add Message :
// Whenever a new message is done by the user, ek new message document create krnge ..
// Array me each document ke liye sirf 2 entity honge, from and to
// User A ne User B ko 2 baar msg kiya .. dono ke alag alag documents with same from to and Sender

// Look out this :

// "message": {
//     "text": "U2FsdGVkX18y9ECc4FPcd2XAVbITUyB7+CZlbAbarfg="  // encrypted at frontend
// },
// "users": [
//     "668be0183ba4bebecda869fa",
//     "668bdedc3ba4bebecda731e2"
// ],
// "sender": {
//     "$oid": "668be0183ba4bebecda869fa"
// },


// getAllMessages :
// Searching all the message document with [from, to]
// then we will display this message on the container

export const addMessage = async (req, res) => {

    try {

        const { from, to, message } = req.body;

        const data = await Messages.create({
            message: { text: message },
            users: [from, to],
            sender: from,
        });

        if (data) {
            res.status(200).json(data);
        }

        else {
            res.status(400).json({ error: "Failed to add message to the database !!" });
        }

    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }

}

export const getAllMessages = async (req, res) => {
    try {

        const { from, to } = req.body;
    
        const messages = await Messages.find({
            users: {
                $all: [from, to]
            }
        }).sort({
            updatedAt: 1    // sorted messages in ascending order of their updatedAt

            // change 1 to -1 to sort in descending order
        });


        // Map is used to convert the array of messages to new array of objects
        // fromSelf is an boolean one indicating the message sender is from and message is the entire msg
        const ProjectMessages = messages.map((message) => {
            return {
                fromSelf: message.sender.toString() === from,  // message.sender is an id .. convert to string
                message: message
            }
        })

        res.status(200).json(ProjectMessages);

    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}