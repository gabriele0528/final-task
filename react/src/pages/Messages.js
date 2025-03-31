import React, { useEffect, useState } from 'react';
import http from '../plugins/https';
import { getAuthHeader, getTokenData } from '../utils/auth';

const Messages = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [replyInputs, setReplyInputs] = useState({});
    const [userMap, setUserMap] = useState({});
    const [conversations, setConversations] = useState({});
    const tokenData = getTokenData();

    useEffect(() => {
        if (!tokenData) {
            setError("You must be logged in to view messages");
            setLoading(false);
            return;
        }
        fetchUsers().then(() => {
            fetchMessages();
        });
    }, []);


    const fetchUsers = async () => {
        try {
            const response = await http.get("/users");
            if (response.success) {
                const map = {};
                response.users.forEach(user => {
                    map[user._id] = user.username;
                });
                console.log("User map:", map);
                setUserMap(map);
                return map;
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        }
        return {};
    };


    const fetchMessages = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await http.get("/messages", { headers: getAuthHeader() });
            console.log("Messages response:", response);
            
            if (response.success && Array.isArray(response.messages)) {

                const formattedMessages = response.messages.map(msg => ({
                    ...msg,
                    createdAt: msg.createdAt || new Date().toISOString(),
                    fromUserId: msg.fromUserId || "unknown",
                    toUserId: msg.toUserId || "unknown",

                    content: msg.content || ""
                }));
                

                formattedMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                
                const conversationMap = {};
                formattedMessages.forEach(msg => {

                    const isFromMe = msg.fromUserId === tokenData._id;
                    const partnerId = isFromMe ? msg.toUserId : msg.fromUserId;
                    

                    const partnerName = getUserName(partnerId);
                    

                    if (!conversationMap[partnerId]) {
                        conversationMap[partnerId] = {
                            partnerId,
                            partnerName,
                            messages: [],
                            lastMessageDate: new Date(0)
                        };
                    }
                    

                    conversationMap[partnerId].messages.push(msg);
                    

                    const msgDate = new Date(msg.createdAt);
                    if (msgDate > conversationMap[partnerId].lastMessageDate) {
                        conversationMap[partnerId].lastMessageDate = msgDate;
                    }
                });
                
                setConversations(conversationMap);
                

                const newReplyInputs = {};
                Object.keys(conversationMap).forEach(partnerId => {
                    newReplyInputs[partnerId] = replyInputs[partnerId] || '';
                });
                setReplyInputs(newReplyInputs);
            } else {
                setError(response.message || "Failed to fetch messages or invalid data format");
                console.error("API error:", response);
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
            setError("Error fetching messages. Please try again later.");
        } finally {
            setLoading(false);
        }
    };
    
    const handleDelete = async (messageId) => {
        try {
            const response = await http.post("/messages/delete",
                { messageId },
                { headers: getAuthHeader() }
            );
            if (response.success) {
              await fetchMessages();
            } else {
                alert(response.message || "Failed to delete message");
            }
        } catch (error) {
            console.error("Error deleting message:", error);
            alert("Error deleting message. Please try again.");
        }
    };


    const handleReplyInputChange = (partnerId, value) => {
        setReplyInputs(prev => ({
            ...prev,
            [partnerId]: value
        }));
    };


    const handleSendReply = async (partnerId) => {
        const replyContent = replyInputs[partnerId];
        
        if (!tokenData) {
            return alert('You must be logged in to send a message');
        }
        if (!replyContent || !replyContent.trim()) {
            return alert("Message cannot be empty");
        }

        try {

            setReplyInputs(prev => ({
                ...prev,
                [partnerId]: ''
            }));
            
            const response = await http.post("/messages/send", {
                toUserId: partnerId,
                content: replyContent.trim()
            }, { headers: getAuthHeader() });

            if (response.success) {
                await fetchMessages();
                

                setReplyInputs(prev => ({
                    ...prev,
                    [partnerId]: ''
                }));
            } else {
                alert(response.message || "Failed to send message");
                setReplyInputs(prev => ({
                    ...prev,
                    [partnerId]: replyContent
                }));
            }
        } catch (error) {
            console.error("Error sending message:", error);
            alert("Error sending message. Please try again.");
            setReplyInputs(prev => ({
                ...prev,
                [partnerId]: replyContent
            }));
        }
    };


    const getUserName = (userId) => {
        if (!userId) return "Unknown User";
        
        const username = userMap[userId];
        if (username) return username;
        

        if (userId === tokenData?._id) return "You";
        

        return `User (${userId.substring(0, 6)}...)`;
    };


    const formatDate = (dateString) => {
        if (!dateString) return "Unknown date";
        
        try {
            return new Date(dateString).toLocaleString();
        } catch (error) {
            console.error("Error formatting date:", error);
            return "Invalid date";
        }
    };

    if (loading) return <div className="p-3">Loading messages...</div>;
    if (error) return <div className="p-3 text-danger">Error: {error}</div>;
    if (!Object.keys(conversations).length) return <div className="p-3">No messages yet</div>;


    const sortedConversations = Object.values(conversations).sort((a, b) => 
        b.lastMessageDate - a.lastMessageDate
    );

    return (
        <div className="p-3">
            <h2>Messages</h2>
            <button 
                onClick={() => {
                    fetchUsers().then(() => {
                        fetchMessages();
                    });
                }} 
                className="btn btn-secondary mb-3"
            >
                Refresh Messages
            </button>
            
            {sortedConversations.map(conversation => {
                const { partnerId,  messages } = conversation;
                

                const displayName = getUserName(partnerId);
                
                return (
                    <div 
                        key={partnerId} 
                        style={{ 
                            border: "1px solid #ccc", 
                            margin: "1rem 0", 
                            padding: "1rem",
                            borderRadius: "8px",
                            backgroundColor: "#fff"
                        }}
                    >
                        <h4>Conversation with {displayName}</h4>
                        

                        <div style={{ 
                            maxHeight: "400px", 
                            overflowY: "auto",
                            padding: "0.5rem",
                            border: "1px solid #eee",
                            borderRadius: "8px",
                            backgroundColor: "#f9f9f9",
                            marginBottom: "1rem"
                        }}>
                            {messages.map((msg, index) => {
                                if (!msg || !msg._id) return null;
                                
                                const isFromMe = msg.fromUserId === tokenData._id;
                                const dateStr = formatDate(msg.createdAt);
                                const senderName = isFromMe ? "You" : displayName;
                                
                                return (
                                    <div 
                                        key={msg._id || index}
                                        style={{
                                            margin: "0.5rem 0",
                                            padding: "0.5rem",
                                            borderRadius: "8px",
                                            backgroundColor: isFromMe ? "#e6f7ff" : "#fff",
                                            border: "1px solid #eee",
                                            maxWidth: "80%",
                                            marginLeft: isFromMe ? "auto" : "0"
                                        }}
                                    >
                                        <div style={{ 
                                            marginBottom: "0.25rem", 
                                            fontSize: "0.8rem",
                                            color: "#666"
                                        }}>
                                            {senderName} • {dateStr}
                                        </div>
                                        
                                        <div style={{ whiteSpace: "pre-wrap" }}>
                                            {msg.content || "No content"}
                                        </div>
                                        
                                        <div style={{ 
                                            marginTop: "0.5rem", 
                                            textAlign: "right",
                                            fontSize: "0.8rem" 
                                        }}>
                                            <button 
                                                onClick={() => handleDelete(msg._id)}
                                                className="btn btn-sm btn-outline-danger"
                                                style={{ padding: "0.1rem 0.3rem", fontSize: "0.7rem" }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        

                        <div style={{ marginTop: "0.5rem" }}>
                            <div className="form-group">
                                <textarea
                                    className="form-control"
                                    value={replyInputs[partnerId] || ''}
                                    onChange={(e) => handleReplyInputChange(partnerId, e.target.value)}
                                    placeholder={`Write a message to ${displayName}...`}
                                    rows="2"
                                />
                            </div>
                            <div className="mt-2">
                                <button 
                                    onClick={() => handleSendReply(partnerId)}
                                    className="btn btn-primary"
                                    disabled={!replyInputs[partnerId] || !replyInputs[partnerId].trim()}
                                >
                                    Send Message
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Messages;
