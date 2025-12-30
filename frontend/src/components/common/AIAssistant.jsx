import { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Paper, Typography, Button, IconButton, TextField, Chip, Avatar, Stack, Fade, LinearProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import RefreshIcon from '@mui/icons-material/Refresh';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SendIcon from '@mui/icons-material/Send';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import botIcon from '../../assets/networking.svg';
import logo from '../../assets/community.svg';

const questionnaire = [
  { question: 'What do you want to do today?', options: ['Find alumni', 'Request mentorship', 'Post or search jobs', 'Events & meetups', 'Something else'] },
  { question: 'Share a quick detail (batch, department, role, or location).', isFreeText: true },
  { question: 'Leave anything else we should know (optional).', isFreeText: true },
  { question: 'Send your request to our team.', isSubmit: true },
];

const whatsappNumber = '918618877807';

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [userPreferences, setUserPreferences] = useState({});
  const [isWaitingForOther, setIsWaitingForOther] = useState(false);
  const [whatsappPayload, setWhatsappPayload] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const otherInputRef = useRef(null);

  const totalSteps = questionnaire.length;
  const answeredSteps = useMemo(() => Object.keys(userPreferences).length, [userPreferences]);
  const progressPercent = Math.min(100, Math.round((answeredSteps / totalSteps) * 100));
  const currentStepLabel = answeredSteps >= totalSteps ? 'Completed' : `Step ${Math.min(answeredSteps + 1, totalSteps)} of ${totalSteps}`;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isWaitingForOther && otherInputRef.current) {
      otherInputRef.current.focus();
    }
  }, [isWaitingForOther]);

  const buildWhatsAppMessage = (preferences = {}, allMessages = []) => {
    const lines = [];
    lines.push('Interior Assistant Inquiry');
    lines.push(`Date: ${new Date().toLocaleString()}`);
    lines.push('');
    lines.push('Selections:');
    questionnaire.forEach((q) => {
      const answer = preferences[q.question];
      if (answer) {
        const display = typeof answer === 'string' ? answer : JSON.stringify(answer);
        lines.push(`- ${q.question}: ${display}`);
      }
    });
    const userMsgs = (allMessages || []).filter((m) => m.sender === 'user').map((m) => m.text).filter(Boolean);
    if (userMsgs.length) {
      lines.push('');
      lines.push('User messages:');
      userMsgs.forEach((m, i) => lines.push(`${i + 1}. ${m}`));
    }
    lines.push('');
    lines.push('Please contact the user for next steps.');
    const plain = lines.join('\n');
    return { plain, encoded: encodeURIComponent(plain) };
  };

  const handleOptionSelect = (option) => {
    const currentQuestion = questionnaire[currentStep];
    setMessages((prev) => [...prev, { text: option, sender: 'user', id: Date.now() + 1 }]);

    if (option === 'Something else' && currentQuestion?.question === 'What do you want to do today?') {
      setIsWaitingForOther(true);
      setTimeout(() => {
        setMessages((prev) => [...prev, { text: 'Please describe what you need help with.', sender: 'assistant', id: Date.now() }]);
        setTimeout(() => {
          otherInputRef.current?.focus();
          scrollToBottom();
        }, 80);
      }, 300);
      return;
    }

    setUserPreferences((prev) => ({ ...prev, [currentQuestion.question]: option }));

    if (currentStep < questionnaire.length - 1) {
      setIsTyping(true);
      setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
        setMessages((prev) => [...prev, { text: questionnaire[currentStep + 1].question, sender: 'assistant', id: Date.now() }]);
        setIsTyping(false);
      }, 450);
    } else {
      setCurrentStep(totalSteps);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = inputMessage.trim();
    if (!text) return;

    setMessages((prev) => [...prev, { text, sender: 'user', id: Date.now() }]);
    setInputMessage('');

    if (isWaitingForOther) {
      const currentQuestion = questionnaire[currentStep];
      setUserPreferences((prev) => ({ ...prev, [currentQuestion.question]: text }));
      setIsWaitingForOther(false);
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      if (nextStep < questionnaire.length) {
        setIsTyping(true);
        setTimeout(() => {
          setMessages((prev) => [...prev, { text: questionnaire[nextStep].question, sender: 'assistant', id: Date.now() }]);
          setIsTyping(false);
        }, 350);
      }
    } else {
      const currentQuestion = questionnaire[currentStep];
      setUserPreferences((prev) => ({ ...prev, [currentQuestion.question]: text }));
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);

      if (nextStep < questionnaire.length) {
        setIsTyping(true);
        setTimeout(() => {
          setMessages((prev) => [...prev, { text: questionnaire[nextStep].question, sender: 'assistant', id: Date.now() }]);
          setIsTyping(false);
        }, 350);
      } else {
        const built = buildWhatsAppMessage({ ...userPreferences, [currentQuestion.question]: text }, [...messages, { text, sender: 'user', id: Date.now() }]);
        setWhatsappPayload(built);
        setIsTyping(true);
        setTimeout(() => {
          const lastMsg = questionnaire[questionnaire.length - 1]?.question || 'Thanks! We will follow up.';
          setMessages((prev) => [...prev, { text: lastMsg, sender: 'assistant', id: Date.now() }]);
          setIsTyping(false);
        }, 350);
      }
    }
  };

  const handleSendToTeam = () => {
    const built = whatsappPayload || buildWhatsAppMessage(userPreferences, messages);
    const encoded = built.encoded;
    if (navigator?.clipboard && built.plain) {
      try { navigator.clipboard.writeText(built.plain); } catch (e) { /* ignore */ }
    }
    const isMobile = /Mobi|Android/i.test(navigator.userAgent) || window.innerWidth < 768;
    const baseUrl = isMobile ? 'https://api.whatsapp.com/send' : 'https://web.whatsapp.com/send';
    const url = `${baseUrl}?phone=${whatsappNumber}&text=${encoded}`;
    window.open(url, '_blank');
  };

  const handleWhatsAppChat = () => {
    const text = encodeURIComponent('Hi! I would like to chat about interior design.');
    const url = `https://wa.me/${whatsappNumber}?text=${text}`;
    window.open(url, '_blank');
  };

  const handleShowMore = () => {
    setCurrentStep(0);
    setMessages([{ text: questionnaire[0].question, sender: 'assistant', id: Date.now() }]);
    setUserPreferences({});
  };

  const handleNewChat = () => {
    setCurrentStep(0);
    setMessages([]);
    setUserPreferences({});
    setIsWaitingForOther(false);
  };

  const resetAndClose = () => {
    setIsOpen(false);
    setIsMaximized(false);
    setCurrentStep(0);
    setMessages([]);
    setUserPreferences({});
    setIsWaitingForOther(false);
  };

  const containerStyle = isOpen && isMaximized
    ? { position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center' }
    : { position: 'fixed', bottom: 80, left: 16, zIndex: 1200 };

  const panelStyle = {
    width: isMaximized ? 'min(900px, 96vw)' : 380,
    height: isMaximized ? '80vh' : 560,
    maxWidth: '96vw',
    borderRadius: isMaximized ? 18 : 16,
    boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
    background: 'white',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid rgba(0,0,0,0.05)',
  };

  return (
    <Box sx={containerStyle}>
      {isOpen ? (
        <Paper elevation={10} sx={panelStyle}>
          <Box sx={{ px: 3, pt: 2.5, pb: 2, borderBottom: '1px solid rgba(0,0,0,0.05)', position: 'sticky', top: 0, bgcolor: 'white', zIndex: 2 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar src={logo} alt="DDG" sx={{ width: 48, height: 48, border: '1px solid rgba(0,0,0,0.06)' }} />
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Alumni Assistant</Typography>
                  <Typography variant="caption" color="text.secondary">{currentStepLabel}</Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={1}>
                <IconButton size="small" onClick={handleNewChat} title="Clear chat">
                  <RefreshIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => setIsMaximized((p) => !p)} title={isMaximized ? 'Exit full screen' : 'Full screen'}>
                  {isMaximized ? <CloseFullscreenIcon fontSize="small" /> : <OpenInFullIcon fontSize="small" />}
                </IconButton>
                <IconButton size="small" onClick={resetAndClose} title="Close">
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Stack>
            <Box sx={{ mt: 2 }}>
              <Box sx={{ height: 8, width: '100%', borderRadius: 999, bgcolor: 'rgba(16,185,129,0.12)', overflow: 'hidden' }}>
                <Box sx={{ height: '100%', width: `${progressPercent}%`, background: 'linear-gradient(135deg,#10B981,#059669)', transition: 'width 0.3s ease' }} />
              </Box>
            </Box>
          </Box>

          <Box sx={{ flex: 1, overflowY: 'auto', p: 3, bgcolor: 'white' }}>
            {messages.length === 0 ? (
              <Fade in timeout={300}>
                <Box sx={{ textAlign: 'center', pt: 2 }}>
                  <Avatar src={botIcon} alt="bot" sx={{ width: 56, height: 56, mx: 'auto', mb: 2, bgcolor: '#ECFDF3' }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#065F46' }}>Welcome to Alumni Assistant</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
                    We will ask a few quick questions and route you to the right alumni, mentorship, jobs, or events.
                  </Typography>
                  <Stack spacing={1.5} sx={{ maxWidth: 320, mx: 'auto' }}>
                    {['Find alumni mentors', 'Post or find jobs'].map((label) => (
                      <Button key={label} variant="outlined" onClick={handleShowMore} startIcon={<PlayArrowIcon />} sx={{ borderColor: 'rgba(16,185,129,0.4)', color: '#065F46', textTransform: 'none' }}>
                        {label}
                      </Button>
                    ))}
                  </Stack>
                  <Button onClick={handleWhatsAppChat} startIcon={<WhatsAppIcon />} variant="contained" sx={{ mt: 2, backgroundColor: '#10B981', textTransform: 'none', fontWeight: 700, '&:hover': { backgroundColor: '#059669' } }}>
                    Chat with us
                  </Button>
                </Box>
              </Fade>
            ) : (
              <Stack spacing={2}>
                {messages.map((message) => (
                  <Stack key={message.id} direction={message.sender === 'user' ? 'row-reverse' : 'row'} spacing={1} alignItems="flex-end">
                    {message.sender === 'assistant' ? <Avatar src={botIcon} alt="AI" sx={{ width: 32, height: 32, bgcolor: '#ECFDF3' }} /> : <Avatar sx={{ width: 32, height: 32, bgcolor: '#E0F2FE', color: '#0F172A', fontSize: 14 }}>You</Avatar>}
                    <Paper elevation={0} sx={{ px: 2, py: 1.5, borderRadius: 3, maxWidth: '75%', bgcolor: message.sender === 'user' ? '#0F172A' : '#F8FAFC', color: message.sender === 'user' ? 'white' : '#0F172A', border: message.sender === 'user' ? '1px solid transparent' : '1px solid rgba(0,0,0,0.06)' }}>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{message.text}</Typography>
                    </Paper>
                  </Stack>
                ))}

                {isTyping && (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar src={botIcon} alt="AI" sx={{ width: 28, height: 28, bgcolor: '#ECFDF3' }} />
                    <Paper elevation={0} sx={{ px: 1.5, py: 1, borderRadius: 3, bgcolor: '#F8FAFC', border: '1px solid rgba(0,0,0,0.05)' }}>
                      <LinearProgress sx={{ width: 80, height: 6, borderRadius: 999, backgroundColor: 'rgba(16,185,129,0.12)', '& .MuiLinearProgress-bar': { backgroundColor: '#10B981' } }} />
                    </Paper>
                  </Stack>
                )}

                {currentStep < questionnaire.length && (
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, letterSpacing: 0.2 }}>Choose an option</Typography>
                    {isWaitingForOther && questionnaire[currentStep]?.question === 'What do you want to do today?' ? (
                      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1.5, display: 'flex', gap: 1 }}>
                        <TextField inputRef={otherInputRef} fullWidth size="small" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} placeholder="Type your location..." />
                        <Button type="submit" variant="contained" sx={{ backgroundColor: '#10B981', '&:hover': { backgroundColor: '#059669' } }}>Send</Button>
                      </Box>
                    ) : questionnaire[currentStep]?.isFreeText ? (
                      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1.5, display: 'flex', gap: 1 }}>
                        <TextField fullWidth size="small" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} placeholder="Type your response..." />
                        <Button type="submit" variant="contained" sx={{ backgroundColor: '#10B981', '&:hover': { backgroundColor: '#059669' } }}>Send</Button>
                      </Box>
                    ) : (
                      <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1.5 }}>
                        {questionnaire[currentStep]?.options?.map((option) => (
                          <Chip key={option} label={option} onClick={() => handleOptionSelect(option)} variant="outlined" sx={{ borderColor: 'rgba(16,185,129,0.4)', color: '#065F46', fontWeight: 600, '&:hover': { backgroundColor: 'rgba(16,185,129,0.08)' } }} />
                        ))}
                      </Stack>
                    )}
                  </Box>
                )}

                {currentStep >= questionnaire.length && (
                  <Button onClick={handleSendToTeam} fullWidth startIcon={<SendIcon />} variant="contained" sx={{ backgroundColor: '#10B981', textTransform: 'none', fontWeight: 700, '&:hover': { backgroundColor: '#059669' } }}>
                    Send to Team
                  </Button>
                )}
              </Stack>
            )}
            <div ref={messagesEndRef} />
          </Box>

          <Box sx={{ p: 2.5, borderTop: '1px solid rgba(0,0,0,0.05)', bgcolor: 'white' }}>
            <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', display: 'block' }}>
              Tip: You can switch to full screen or start a new chat anytime.
            </Typography>
          </Box>
        </Paper>
      ) : (
        <Button
          onClick={() => {
            setIsOpen(true);
            setIsWaitingForOther(false);
            setCurrentStep(0);
            setMessages([]);
            setUserPreferences({});
          }}
          variant="contained"
          sx={{
            width: 54,
            height: 54,
            minWidth: 54,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            color: 'white',
            border: '2px solid rgba(255,255,255,0.35)',
            boxShadow: '0 12px 28px rgba(16,185,129,0.38)',
            '&:hover': {
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              boxShadow: '0 16px 40px rgba(16,185,129,0.5)',
            },
          }}
          aria-label="Open assistant"
        >
          <SupportAgentIcon />
        </Button>
      )}
    </Box>
  );
}
