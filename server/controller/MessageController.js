import Messages from '../models/MessageModel.js';

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
            updatedAt: 1
        });

        const ProjectMessages = messages.map((message) => {
            return {
                fromSelf: message.sender.toString() === from,
                message: message
            }
        })

        res.status(200).json(ProjectMessages);

    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}