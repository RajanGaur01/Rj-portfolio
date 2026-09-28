import React, { useState, useEffect, useRef } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, logoutUser } from '../../lib/firebase';
import { 
  Send, 
  ShieldCheck, 
  LogOut, 
  Clock, 
  CheckCircle2, 
  ShieldAlert, 
  Sparkles,
  MessageSquare
} from 'lucide-react';

export default function UserChatDashboard({ user, profile }) {
  const [messages, setMessages] = useState([]);
  const [thread, setThread] = useState(null);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  // 1. Real-time listener for current user's thread in Firestore
  useEffect(() => {
    if (!user?.uid) return;

    const threadRef = doc(db, 'threads', user.uid);
    const unsubscribe = onSnapshot(threadRef, (snap) => {
      if (snap.exists()) {
        setThread({ id: snap.id, ...snap.data() });
      } else {
        setThread(null);
      }
    }, (err) => {
      console.error("Firestore thread listener error:", err);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  // 2. Real-time listener for messages in threads/{user.uid}/messages
  useEffect(() => {
    if (!user?.uid) return;

    const messagesRef = collection(db, 'threads', user.uid, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      }));
      setMessages(msgs);
    }, (err) => {
      console.error("Firestore messages listener error:", err);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Determine user moderation status
  const currentStatus = thread?.status || profile?.status || 'pending';
  const isAllowed = currentStatus === 'allowed';
  const isBlocked = currentStatus === 'blocked';
  const hasSentFirstMessage = messages.length > 0 || thread?.lastMessage;

  // Send message handler
  const handleSendMessage = async (e) => {
    e?.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed || sending) return;

    // If user is not allowed and has already sent a message, prevent sending
    if (!isAllowed && hasSentFirstMessage) return;

    setSending(true);
    try {
      // 1. If thread doesn't exist yet, create parent thread
      const threadRef = doc(db, 'threads', user.uid);
      await setDoc(threadRef, {
        userId: user.uid,
        userName: user.displayName || 'Visitor',
        userEmail: user.email,
        userPhoto: user.photoURL || null,
        status: isAllowed ? 'allowed' : 'pending',
        blockReason: null,
        lastMessage: trimmed,
        lastMessageAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        unreadByAdmin: true,
      }, { merge: true });

      // 2. Add message to subcollection
      const messagesRef = collection(db, 'threads', user.uid, 'messages');
      await addDoc(messagesRef, {
        senderId: user.uid,
        senderName: user.displayName || 'Visitor',
        senderEmail: user.email,
        senderPhoto: user.photoURL || null,
        senderRole: 'user',
        text: trimmed,
        createdAt: serverTimestamp(),
      });

      // 3. Update user profile document
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        lastActive: serverTimestamp(),
      }).catch(() => {});

      setInputText('');
    } catch (err) {
      console.error("Failed to send message to Firestore:", err);
      alert("Failed to send message. Please ensure Cloud Firestore is enabled in your Firebase Console.");
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    try {
      const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto rounded-3xl bg-gradient-to-b from-[#0e0e18] to-[#07070e] border border-blue-500/30 shadow-2xl overflow-hidden flex flex-col h-[650px] relative backdrop-blur-2xl">
      
      {/* ───────────────────────────────────────────────────────────── */}
      {/* HEADER: USER & RECIPIENT STATUS                                */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="px-6 py-4 bg-[#0a0a12] border-b border-white/10 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 p-0.5 shadow-lg shadow-blue-600/30">
              <div className="w-full h-full rounded-2xl bg-[#0a0a0f] flex items-center justify-center font-display font-black text-sm text-white">
                RG
              </div>
            </div>
            <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#0a0a0f] ${
              isAllowed ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-blue-500'
            }`} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-sm sm:text-base text-white">RAJAN GAUR</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/20 text-[10px] font-mono font-bold text-blue-300 border border-blue-500/30">
                <ShieldCheck size={11} className="text-blue-400" />
                <span>ARCHITECT</span>
              </span>
            </div>
            <p className="text-[11px] font-mono text-zinc-400">
              {isAllowed ? 'Direct Live Channel • Authorized' : 'Direct Message Queue • 1-Note Rule'}
            </p>
          </div>
        </div>

        {/* User Google Identity & Sign Out */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-semibold text-zinc-200 truncate max-w-[160px]">
              {user?.displayName || 'Visitor'}
            </span>
            <span className="text-[10px] font-mono text-zinc-500 truncate max-w-[160px]">
              {user?.email}
            </span>
          </div>

          <button
            onClick={logoutUser}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all cursor-pointer"
            title="Sign Out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MESSAGES FEED                                                  */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
        
        {/* Status Notification Header */}
        {!hasSentFirstMessage && (
          <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-500/20 text-center space-y-1">
            <div className="inline-flex items-center gap-1.5 text-blue-400 font-mono text-xs font-bold uppercase">
              <Sparkles size={13} />
              <span>Direct Messaging Protocol</span>
            </div>
            <p className="text-xs text-zinc-400 font-body max-w-md mx-auto">
              Write your initial note to Rajan below. After you submit, you can talk to Rajan as soon as he reviews and allows your request.
            </p>
          </div>
        )}

        {/* Render all messages in real time */}
        {messages.map((msg) => {
          const isUser = msg.senderRole === 'user' || msg.senderId === user?.uid;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-end gap-2.5 max-w-[85%] sm:max-w-[75%]">
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0 mb-1 shadow-lg shadow-blue-600/30">
                    RG
                  </div>
                )}

                <div
                  className={`p-4 rounded-2xl text-sm font-body leading-relaxed shadow-lg ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-br-none border border-blue-400/30 shadow-blue-900/20'
                      : 'bg-[#14141e] text-zinc-100 rounded-bl-none border border-white/15'
                  }`}
                >
                  {!isUser && (
                    <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-blue-300 pb-1 mb-1 border-b border-white/10">
                      <span>RAJAN GAUR</span>
                      <ShieldCheck size={12} className="text-blue-400" />
                    </div>
                  )}

                  <p className="whitespace-pre-wrap break-words">{msg.text}</p>

                  <div className={`pt-1 text-[10px] font-mono text-right ${isUser ? 'text-blue-200' : 'text-zinc-500'}`}>
                    {formatTime(msg.createdAt)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* BOTTOM CONTROLS: ENABLED vs DISABLED / AWAITING ALLOW         */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="p-4 bg-[#0a0a12] border-t border-white/10 shrink-0">
        {isBlocked ? (
          /* ========================================================= */
          /* CASE 1: BLOCKED USER                                      */
          /* ========================================================= */
          <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/40 text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-red-400 font-mono text-xs font-bold uppercase">
              <ShieldAlert size={16} />
              <span>Communication Restricted</span>
            </div>
            <p className="text-xs text-zinc-300 font-body">
              You have been blocked from messaging Rajan.
            </p>
            {thread?.blockReason && (
              <p className="text-xs font-mono text-red-300 bg-black/50 p-2 rounded-xl border border-red-500/20">
                Reason: "{thread.blockReason}"
              </p>
            )}
          </div>
        ) : !isAllowed && hasSentFirstMessage ? (
          /* ========================================================= */
          /* CASE 2: 1 MESSAGE SENT -> INPUT DISABLED / INVISIBLE      */
          /* ========================================================= */
          <div className="p-5 rounded-2xl bg-[#0e0e18] border border-blue-500/30 text-center space-y-2.5 shadow-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-500/40 text-[11px] font-mono font-bold text-blue-300 uppercase">
              <Clock size={12} className="animate-spin" style={{ animationDuration: '6s' }} />
              <span>Awaiting Rajan's Approval</span>
            </div>

            <p className="text-sm font-display font-semibold text-white">
              Your message has been sent to Rajan.
            </p>

            <p className="text-xs text-zinc-400 font-body max-w-md mx-auto leading-relaxed">
              You can only send one initial message. You will be able to talk with Rajan as soon as he reviews and allows your request.
            </p>
          </div>
        ) : (
          /* ========================================================= */
          /* CASE 3: INPUT IS ENABLED (FIRST MESSAGE OR ALLOWED CHAT)   */
          /* ========================================================= */
          <form onSubmit={handleSendMessage} className="relative flex items-center gap-2.5">
            <textarea
              rows={1}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={
                isAllowed 
                  ? "Type your message to Rajan... (Press Enter to send)" 
                  : "Write your note to Rajan... (1 message limit until approved)"
              }
              maxLength={1000}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/15 focus:border-blue-500 focus:outline-none text-white text-sm placeholder:text-zinc-500 resize-none font-body transition-colors"
            />

            <button
              type="submit"
              disabled={!inputText.trim() || sending}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-white font-mono text-xs font-bold uppercase flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shrink-0 shadow-lg shadow-blue-600/30"
            >
              <span>{isAllowed ? "Send" : "Send Note"}</span>
              <Send size={13} />
            </button>
          </form>
        )}
      </div>

    </div>
  );
}
