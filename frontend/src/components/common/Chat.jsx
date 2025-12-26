import { useEffect, useState, useRef } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  TextField,
  Stack,
  Typography,
  Avatar,
  Paper,
  alpha,
  Badge,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';
import { io } from 'socket.io-client';
import api from '../../api/axios';

// Global socket instance to persist across dialog opens/closes
let globalSocket = null;

const MessageBubble = styled(Paper)(({ isOwn }) => ({
  padding: '10px 14px',
  borderRadius: isOwn ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
  maxWidth: '70%',
  backgroundColor: isOwn ? '#10B981' : '#f3f4f6',
  color: isOwn ? '#ffffff' : '#1f2937',
  marginLeft: isOwn ? 'auto' : '0',
  marginRight: isOwn ? '0' : 'auto',
}));

const Chat = ({ open, onClose, recipient }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Helper function to consistently extract recipient user ID
  const getRecipientUserId = (recipientObj) => {
    if (!recipientObj) return null;
    // Try different possible locations where user ID might be
    return recipientObj.user?._id || recipientObj._id || recipientObj.id || null;
  };

  // Get current user ID from token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUserId(payload.id || payload._id);
      } catch (err) {
        console.error('Failed to decode token:', err);
      }
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize global socket connection once
  useEffect(() => {
    if (!globalSocket) {
      const token = localStorage.getItem('token');
      console.log('Token from localStorage:', token ? 'Found' : 'Not found');
      
      globalSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
        autoConnect: true,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: Infinity,
        transports: ['websocket', 'polling'],
        auth: {
          token: token
        }
      });

      globalSocket.on('connect', () => {
        console.log('Socket connected:', globalSocket.id);
        setIsConnected(true);
        // Authenticate after connection
        if (token) {
          console.log('Sending token to server...');
          globalSocket.emit('authenticate', token);
        } else {
          console.error('No token found in localStorage');
        }
      });

      globalSocket.on('authenticated', (data) => {
        console.log('Socket authenticated successfully:', data);
      });

      globalSocket.on('authError', (error) => {
        console.error('Socket authentication error:', error);
      });

      globalSocket.on('disconnect', () => {
        console.log('Socket disconnected');
        setIsConnected(false);
      });

      globalSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        setIsConnected(false);
      });

      globalSocket.on('reconnect', () => {
        console.log('Socket reconnected, re-authenticating...');
        setIsConnected(true);
        // Re-authenticate after reconnection
        const currentToken = localStorage.getItem('token');
        if (currentToken) {
          globalSocket.emit('authenticate', currentToken);
        }
        if (recipient) {
          fetchMessages();
        }
      });

      // Handle unread messages when user comes online
      globalSocket.on('unreadMessages', (unreadMessages) => {
        console.log('Received unread messages:', unreadMessages);
        if (recipient) {
          const recipientId = recipient._id || recipient.user?._id || recipient.id;
          const relevantMessages = unreadMessages.filter(
            msg => msg.sender._id === recipientId || msg.receiver === currentUserId
          );
          
          if (relevantMessages.length > 0) {
            setMessages(prev => {
              const messageIds = new Set(prev.map(m => m._id));
              const newMessages = relevantMessages.filter(m => !messageIds.has(m._id));
              return [...prev, ...newMessages];
            });
          }
        }
      });

      setSocket(globalSocket);
    }
  }, []);

  // Handle receiving messages
  useEffect(() => {
    if (globalSocket && recipient) {
      const recipientId = getRecipientUserId(recipient);
      
      const handleReceiveMessage = (data) => {
        console.log('Received message:', data);
        console.log('Current recipient user ID:', recipientId);
        console.log('Message sender ID:', data.senderId);
        
        // Add message if it's from the current recipient OR if we are the receiver
        if (data.senderId === recipientId || data.receiverId === currentUserId) {
          console.log('Adding message to chat');
          setMessages((prev) => [
            ...prev,
            {
              _id: data._id,
              sender: { _id: data.senderId },
              content: data.content,
              createdAt: data.createdAt || data.timestamp,
            },
          ]);
          // Mark as read if it's from the recipient
          if (data.senderId === recipientId) {
            api.put(`/messages/read/${recipientId}`).catch(err => console.error(err));
          }
        } else {
          console.log('Message not for this chat - ignoring');
        }
      };

      const handleTyping = (data) => {
        if (data.userId === recipientId) {
          setIsTyping(data.isTyping);
        }
      };

      globalSocket.on('receiveMessage', handleReceiveMessage);
      globalSocket.on('userTyping', handleTyping);

      return () => {
        globalSocket.off('receiveMessage', handleReceiveMessage);
        globalSocket.off('userTyping', handleTyping);
      };
    }
  }, [recipient, currentUserId]);

  // Fetch messages when dialog opens or recipient changes
  useEffect(() => {
    if (open && recipient) {
      fetchMessages();
    }
  }, [open, recipient]);

  const fetchMessages = async () => {
    if (!recipient) return;
    
    const recipientId = getRecipientUserId(recipient);
    if (!recipientId) {
      console.error('Could not extract recipient user ID');
      return;
    }
    
    try {
      setIsLoading(true);
      const res = await api.get(`/messages/conversation/${recipientId}`);
      setMessages(res.data || []);
      // Mark messages as read
      await api.put(`/messages/read/${recipientId}`).catch(err => console.error(err));
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !recipient || !isConnected) return;

    try {
      const recipientId = getRecipientUserId(recipient);
      
      if (!recipientId) {
        console.error('Could not extract recipient user ID');
        return;
      }
      
      console.log('Sending message to:', recipientId);
      
      // Send via API
      await api.post('/messages', {
        receiverId: recipientId,
        content: newMessage.trim(),
      });

      // Send via socket for real-time
      if (globalSocket && globalSocket.connected) {
        globalSocket.emit('sendMessage', {
          receiverId: recipientId,
          content: newMessage.trim(),
        });
      }

      // Add to local state
      setMessages((prev) => [
        ...prev,
        {
          sender: { _id: currentUserId },
          content: newMessage.trim(),
          createdAt: new Date(),
        },
      ]);

      setNewMessage('');
      
      // Stop typing indicator
      if (globalSocket && globalSocket.connected) {
        globalSocket.emit('typing', { receiverId: recipientId, isTyping: false });
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    if (!globalSocket || !globalSocket.connected) return;

    // Emit typing event
    globalSocket.emit('typing', { receiverId: recipient._id, isTyping: true });

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      if (globalSocket && globalSocket.connected) {
        globalSocket.emit('typing', { receiverId: recipient._id, isTyping: false });
      }
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleDeleteChat = async () => {
    try {
      setIsDeleting(true);
      const recipientId = getRecipientUserId(recipient);
      
      if (!recipientId) {
        console.error('Could not extract recipient user ID');
        return;
      }
      
      // Delete all messages in the conversation via API
      await api.delete(`/messages/conversation/${recipientId}`);
      
      // Clear messages from UI
      setMessages([]);
      setOpenDeleteConfirm(false);
      console.log('Chat history deleted successfully');
    } catch (error) {
      console.error('Failed to delete chat:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!recipient) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          height: '600px',
          borderRadius: 3,
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          borderBottom: '1px solid',
          borderColor: 'divider',
          p: 2,
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={2} alignItems="center">
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant="dot"
              sx={{
                '& .MuiBadge-badge': {
                  backgroundColor: '#10B981',
                  color: '#10B981',
                  boxShadow: '0 0 0 2px #fff',
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                },
              }}
            >
              <Avatar
                src={recipient.profilePhoto}
                sx={{
                  bgcolor: alpha('#10B981', 0.15),
                  color: '#047857',
                }}
              >
                {recipient.fullName?.charAt(0) || 'A'}
              </Avatar>
            </Badge>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {recipient.fullName || recipient.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {isTyping ? 'Typing...' : isConnected ? 'Online' : 'Connecting...'}
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={1}>
            <IconButton 
              onClick={() => setOpenDeleteConfirm(true)} 
              size="small"
              sx={{ color: '#EF4444' }}
              title="Delete chat"
            >
              <DeleteIcon />
            </IconButton>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Stack>
        </Stack>
      </DialogTitle>

      {/* Messages */}
      <DialogContent
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          overflowY: 'auto',
          bgcolor: '#fafafa',
        }}
      >
        {messages.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Start a conversation with {recipient.fullName || recipient.name}
            </Typography>
          </Box>
        ) : (
          messages.map((msg, idx) => {
            const isOwn = msg.sender._id === currentUserId;
            return (
              <Box key={idx} sx={{ display: 'flex', flexDirection: 'column' }}>
                <MessageBubble isOwn={isOwn} elevation={0}>
                  <Typography variant="body2">{msg.content}</Typography>
                </MessageBubble>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    mt: 0.5,
                    alignSelf: isOwn ? 'flex-end' : 'flex-start',
                  }}
                >
                  {formatTime(msg.createdAt)}
                </Typography>
              </Box>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </DialogContent>

      {/* Input */}
      <Box
        sx={{
          p: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: '#ffffff',
        }}
      >
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
            <CircularProgress size={20} />
          </Box>
        )}
        <Stack direction="row" spacing={1} alignItems="center">
          <TextField
            fullWidth
            placeholder={isConnected ? "Type a message..." : "Connecting..."}
            value={newMessage}
            onChange={handleTyping}
            onKeyPress={handleKeyPress}
            variant="outlined"
            size="small"
            disabled={!isConnected}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '20px',
              },
            }}
          />
          <IconButton
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || !isConnected}
            sx={{
              bgcolor: '#10B981',
              color: '#ffffff',
              '&:hover': {
                bgcolor: '#059669',
              },
              '&:disabled': {
                bgcolor: alpha('#10B981', 0.3),
              },
            }}
          >
            {isLoading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
          </IconButton>
        </Stack>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteConfirm}
        onClose={() => setOpenDeleteConfirm(false)}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Delete Chat History?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete all messages in this conversation? This action cannot be undone.
          </Typography>
        </DialogContent>
        <Box sx={{ p: 2, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
          <button
            onClick={() => setOpenDeleteConfirm(false)}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              backgroundColor: '#ffffff',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteChat}
            disabled={isDeleting}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#EF4444',
              color: '#ffffff',
              cursor: isDeleting ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: 500,
              opacity: isDeleting ? 0.6 : 1,
            }}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </Box>
      </Dialog>
    </Dialog>
  );
};

export default Chat;
