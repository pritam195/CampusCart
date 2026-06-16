const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const Product = require('../models/Products');


exports.createConversation = async (req, res) => {
    try {
        const { productId } = req.body;
        const buyerId = req.user.id;

        
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        const sellerId = product.seller.toString();

        
        let conversation = await Conversation.findOne({
            participants: { $all: [buyerId, sellerId] },
            productId: productId,
        });

        if (conversation) {
            return res.status(200).json({ success: true, conversation });
        }

        
        conversation = await Conversation.create({
            participants: [buyerId, sellerId],
            productId: productId,
            unreadCount: {
                [buyerId]: 0,
                [sellerId]: 0,
            }
        });

        res.status(201).json({ success: true, conversation });
    } catch (error) {
        console.error('Error creating conversation:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


exports.getConversations = async (req, res) => {
    try {
        const userId = req.user.id;

        const conversations = await Conversation.find({
            participants: { $in: [userId] },
        })
        .populate('participants', 'name email avatar')
        .populate('productId', 'title price images')
        .sort({ updatedAt: -1 });

        res.status(200).json({ success: true, conversations });
    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


exports.getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const userId = req.user.id;

        const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });
        
        
        const conversation = await Conversation.findById(conversationId);
        if (conversation) {
            conversation.unreadCount.set(userId, 0);
            await conversation.save();
        }

        res.status(200).json({ success: true, messages });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


exports.sendMessage = async (req, res) => {
    try {
        const { conversationId, text } = req.body;
        const senderId = req.user.id;

        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ success: false, message: 'Conversation not found' });
        }

        const newMessage = await Message.create({
            conversationId,
            senderId,
            text,
        });

        
        const receiverId = conversation.participants.find(
            (p) => p.toString() !== senderId
        ).toString();

        const currentUnread = conversation.unreadCount.get(receiverId) || 0;
        conversation.unreadCount.set(receiverId, currentUnread + 1);
        conversation.lastMessage = text;
        await conversation.save();

        res.status(201).json({ success: true, message: newMessage });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
