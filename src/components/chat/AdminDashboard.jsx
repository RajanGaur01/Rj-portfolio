import React, { useState, useEffect, useRef } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, logoutUser } from '../../lib/firebase';
import { 
  Shield, 
  CheckCircle2, 
  Ban, 
  RotateCcw, 
  Send, 
  Search, 
  Clock, 
  User, 
  Mail, 
  AlertTriangle, 
  Sparkles, 
  Eye, 
  LogOut,
  ChevronRight,
  MessageSquare,
  ShieldAlert,
  ShieldCheck,
  X,
  Radio,
  ExternalLink,
  Activity,
  Layers,
  Cpu,
  Hash,
  Calendar,
  Zap,
  ArrowLeft
} from 'lucide-react';

export default function AdminDashboard({ user, onClose, onTogglePreview }) {
  const [threads, setThreads] = useState([]);
  const [selectedThreadId, setSelectedThreadId] = useState(null);
  const [filter, setFilter] = useState('pending'); // 'pending' | 'allowed' | 'blocked' | 'all'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Active Thread Data
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  // Block Modal State
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [selectedBlockReason, setSelectedBlockReason] = useState('Spam / Unsolicited promotional inquiry');
  const [customBlockReason, setCustomBlockReason] = useState('');
  const [blockingAction, setBlockingAction] = useState(false);

  // Quick Canned Responses
  const CANNED_REPLIES = [
    "Thanks for reaching out! Let's schedule a call to discuss your product vision.",
    "Reviewed and authorized! Tell me more about the technical stack and requirements.",
    "Could you share a link to your repository, Figma mockup, or specification document?",
    "I'm excited to collaborate. What is your estimated timeline and launch target?"
  ];

  const messagesEndRef = useRef(null);

  // 1. Pure Firestore listener for all user inquiries
  useEffect(() => {
    const threadsRef = collection(db, 'threads');
    const q = query(threadsRef, orderBy('lastMessageAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      }));
      setThreads(list);

      // Auto-select first thread if none selected
      setSelectedThreadId((prev) => {
        if (prev && list.some(t => t.id === prev)) return prev;
        const firstPending = list.find(t => t.status === 'pending');
        return firstPending ? firstPending.id : (list[0]?.id || null);
      });
    }, (err) => {
      console.error("Firestore threads listener error:", err);
    });

    return () => unsubscribe();
  }, []);

  // 2. Pure Firestore listener for messages in the selected thread
  useEffect(() => {
    if (!selectedThreadId) {
      setMessages([]);
      return;
    }

    const messagesRef = collection(db, 'threads', selectedThreadId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      }));
      setMessages(msgs);

      // Mark unread by admin false
      updateDoc(doc(db, 'threads', selectedThreadId), { unreadByAdmin: false }).catch(() => {});
    }, (err) => {
      console.error("Firestore messages listener error:", err);
    });

    return () => unsubscribe();
  }, [selectedThreadId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const selectedThread = threads.find(t => t.id === selectedThreadId);

  // Filtered threads list
  const filteredThreads = threads.filter(t => {
    const matchesFilter = filter === 'all' || t.status === filter;
    const matchesSearch = !searchQuery || 
      (t.userName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.userEmail || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.lastMessage || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Moderation: Allow / Approve
  const handleAllowUser = async () => {
    if (!selectedThread) return;
    try {
      const targetUid = selectedThread.userId || selectedThread.id;
      await updateDoc(doc(db, 'threads', selectedThread.id), {
        status: 'allowed',
        blockReason: null,
        blockedAt: null,
        allowedAt: serverTimestamp(),
      });
      await updateDoc(doc(db, 'users', targetUid), {
        status: 'allowed',
        blockReason: null,
        blockedAt: null,
        allowedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Error allowing user in Firestore:", err);
    }
  };

  // Moderation: Block User with reason
  const handleConfirmBlock = async () => {
    if (!selectedThread) return;
    setBlockingAction(true);
    try {
      const finalReason = customBlockReason.trim() || selectedBlockReason;
      const targetUid = selectedThread.userId || selectedThread.id;

      await updateDoc(doc(db, 'threads', selectedThread.id), {
        status: 'blocked',
        blockReason: finalReason,
        blockedAt: serverTimestamp(),
      });
      await updateDoc(doc(db, 'users', targetUid), {
        status: 'blocked',
        blockReason: finalReason,
        blockedAt: serverTimestamp(),
      });

      setShowBlockModal(false);
      setCustomBlockReason('');
    } catch (err) {
      console.error("Error blocking user in Firestore:", err);
    } finally {
      setBlockingAction(false);
    }
  };

  // Moderation: Reset to Pending
  const handleResetToPending = async () => {
    if (!selectedThread) return;
    try {
      const targetUid = selectedThread.userId || selectedThread.id;
      await updateDoc(doc(db, 'threads', selectedThread.id), {
        status: 'pending',
        blockReason: null,
        blockedAt: null,
      });
      await updateDoc(doc(db, 'users', targetUid), {
        status: 'pending',
        blockReason: null,
        blockedAt: null,
      });
    } catch (err) {
      console.error("Error resetting user in Firestore:", err);
    }
  };

  // Send Admin Reply (Auto-Authorizes if not blocked; restricted if blocked)
  const handleSendReply = async (e) => {
    e?.preventDefault();
    const trimmed = replyText.trim();
    if (!trimmed || sendingReply || !selectedThread) return;

    // Restriction: Cannot send message if user is blocked
    if (selectedThread.status === 'blocked') {
      return;
    }

    setSendingReply(true);
    try {
      const messagesRef = collection(db, 'threads', selectedThread.id, 'messages');
      await addDoc(messagesRef, {
        senderId: user.uid,
        senderName: 'RAJAN GAUR',
        senderEmail: user.email,
        senderPhoto: user.photoURL || null,
        senderRole: 'admin',
        text: trimmed,
        createdAt: serverTimestamp(),
      });

      const targetUid = selectedThread.userId || selectedThread.id;
      const threadUpdates = {
        lastMessage: trimmed,
        lastMessageAt: serverTimestamp(),
        unreadByUser: true,
      };

      // Auto-Authorize: Replying automatically marks the user as authorized/allowed!
      if (selectedThread.status !== 'allowed') {
        threadUpdates.status = 'allowed';
        threadUpdates.allowedAt = serverTimestamp();
        threadUpdates.blockReason = null;
        threadUpdates.blockedAt = null;

        await updateDoc(doc(db, 'users', targetUid), {
          status: 'allowed',
          allowedAt: serverTimestamp(),
          blockReason: null,
          blockedAt: null,
        }).catch(() => {});
      }

      await updateDoc(doc(db, 'threads', selectedThread.id), threadUpdates);

      setReplyText('');
    } catch (err) {
      console.error("Error sending admin reply:", err);
    } finally {
      setSendingReply(false);
    }
  };

  const formatTimestamp = (ts) => {
    if (!ts) return '';
    try {
      const d = ts.toDate ? ts.toDate() : new Date(ts);
      return d.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  const counts = {
    all: threads.length,
    pending: threads.filter(t => t.status === 'pending').length,
    allowed: threads.filter(t => t.status === 'allowed').length,
    blocked: threads.filter(t => t.status === 'blocked').length,
  };

  return (
    <div className="fixed inset-0 z-[100] w-screen h-screen bg-[#050508] text-white flex flex-col overflow-hidden font-body select-none">
      
      {/* ───────────────────────────────────────────────────────────── */}
      {/* TOP EXECUTIVE COMMAND BAR                                      */}
      {/* ───────────────────────────────────────────────────────────── */}
      <header className="h-16 px-6 bg-[#09090f] border-b border-white/10 flex items-center justify-between shrink-0 z-20">
        
        {/* Left: Identity & Live Latency Indicator */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-blue-600/30 flex items-center justify-center">
              <Shield size={18} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-sm text-white tracking-wider uppercase">
                  RAJAN GAUR
                </span>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/40 text-[9px] font-mono font-bold text-blue-300">
                  ADMIN CONSOLE
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse" />
                <span className="text-emerald-400 font-semibold">Live Real-Time Sync Active</span>
                <span className="text-zinc-600">•</span>
                <span>{user?.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Quick Telemetry Metric Pills */}
        <div className="hidden md:flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-semibold">
            <Clock size={12} className="animate-spin" style={{ animationDuration: '6s' }} />
            <span>Pending Review: <strong>{counts.pending}</strong></span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-semibold">
            <CheckCircle2 size={12} />
            <span>Authorized: <strong>{counts.allowed}</strong></span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-mono font-semibold">
            <Ban size={12} />
            <span>Restricted: <strong>{counts.blocked}</strong></span>
          </div>
        </div>

        {/* Right: Actions & Exit Controls */}
        <div className="flex items-center gap-2.5">
          {onTogglePreview && (
            <button
              onClick={onTogglePreview}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-mono text-zinc-300 hover:text-white transition-all cursor-pointer font-semibold"
              title="Inspect customer perspective"
            >
              <Eye size={13} className="text-blue-400" />
              <span className="hidden sm:inline">Visitor Preview</span>
            </button>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/40 text-xs font-mono text-blue-300 hover:text-white transition-all cursor-pointer font-semibold"
            >
              <ArrowLeft size={13} />
              <span>Back to Portfolio</span>
            </button>
          )}

          <button
            onClick={logoutUser}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-xs font-mono text-red-300 hover:text-white transition-all cursor-pointer font-semibold"
            title="Sign out of Admin Session"
          >
            <LogOut size={13} />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3-PANEL FULL-SCREEN WORKSPACE                                  */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
        
        {/* ============================================================= */}
        {/* PANEL 1: INQUIRIES & THREADS INBOX (COL 1-4)                  */}
        {/* ============================================================= */}
        <aside className="md:col-span-4 lg:col-span-3 bg-[#08080d] border-r border-white/10 flex flex-col overflow-hidden">
          
          {/* Filter Tabs */}
          <div className="p-3.5 border-b border-white/10 space-y-2.5 bg-[#0a0a10]">
            <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-black/50 border border-white/10 text-[11px] font-mono font-semibold">
              <button
                onClick={() => setFilter('pending')}
                className={`py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                  filter === 'pending'
                    ? 'bg-amber-500/25 text-amber-300 border border-amber-500/40 font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Review ({counts.pending})
              </button>
              <button
                onClick={() => setFilter('allowed')}
                className={`py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                  filter === 'allowed'
                    ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Allowed ({counts.allowed})
              </button>
              <button
                onClick={() => setFilter('blocked')}
                className={`py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                  filter === 'blocked'
                    ? 'bg-red-500/25 text-red-300 border border-red-500/40 font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Blocked ({counts.blocked})
              </button>
              <button
                onClick={() => setFilter('all')}
                className={`py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                  filter === 'all'
                    ? 'bg-blue-500/25 text-blue-300 border border-blue-500/40 font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                All ({counts.all})
              </button>
            </div>

            {/* Live Search Input */}
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Search inquiries by name, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Real-time Thread List */}
          <div className="flex-1 overflow-y-auto divide-y divide-white/5">
            {filteredThreads.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 space-y-2">
                <MessageSquare size={28} className="mx-auto text-zinc-600" />
                <p className="text-xs font-mono">No inquiry threads matching "{filter}"</p>
              </div>
            ) : (
              filteredThreads.map(t => {
                const isSelected = t.id === selectedThreadId;
                const isPending = t.status === 'pending';
                const isAllowed = t.status === 'allowed';
                const isBlocked = t.status === 'blocked';

                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedThreadId(t.id)}
                    className={`w-full p-4 text-left transition-all flex items-start gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-blue-950/40 border-l-4 border-blue-500 shadow-inner'
                        : 'hover:bg-white/[0.02]'
                    }`}
                  >
                    {/* User Avatar */}
                    {t.userPhoto ? (
                      <img
                        src={t.userPhoto}
                        alt={t.userName}
                        className="w-10 h-10 rounded-full object-cover border border-white/20 shrink-0 mt-0.5"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/20 flex items-center justify-center font-display font-bold text-white text-xs shrink-0 mt-0.5">
                        {(t.userName || 'U').charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="font-display font-bold text-sm text-white truncate">
                          {t.userName || 'Visitor'}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-500 shrink-0">
                          {formatTimestamp(t.lastMessageAt)}
                        </span>
                      </div>

                      <p className="text-xs font-mono text-zinc-400 truncate mb-1.5">
                        {t.userEmail}
                      </p>

                      <p className="text-xs text-zinc-300 line-clamp-2 font-body mb-2 leading-snug">
                        {t.lastMessage || 'No messages yet'}
                      </p>

                      {/* Status Tag Pill */}
                      <div className="flex items-center justify-between">
                        {isPending && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/20 text-[10px] font-mono font-bold text-amber-300 border border-amber-500/30">
                            <Clock size={10} className="animate-pulse" />
                            <span>PENDING REVIEW</span>
                          </span>
                        )}
                        {isAllowed && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/20 text-[10px] font-mono font-bold text-emerald-300 border border-emerald-500/30">
                            <CheckCircle2 size={10} />
                            <span>AUTHORIZED</span>
                          </span>
                        )}
                        {isBlocked && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-500/20 text-[10px] font-mono font-bold text-red-300 border border-red-500/30">
                            <Ban size={10} />
                            <span>RESTRICTED</span>
                          </span>
                        )}

                        {t.unreadByAdmin && (
                          <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_6px_#3b82f6] animate-pulse" />
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>

        </aside>

        {/* ============================================================= */}
        {/* PANEL 2: CONVERSATION & MODERATION WORKSPACE (COL 5-8/9)       */}
        {/* ============================================================= */}
        <main className="md:col-span-8 lg:col-span-6 bg-[#06060a] flex flex-col overflow-hidden relative">
          
          {selectedThread ? (
            <>
              {/* Active Conversation Header */}
              <div className="p-4 bg-[#0a0a10] border-b border-white/10 flex flex-wrap items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-3">
                  {selectedThread.userPhoto ? (
                    <img
                      src={selectedThread.userPhoto}
                      alt={selectedThread.userName}
                      className="w-10 h-10 rounded-xl object-cover border border-white/20"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-white/20 flex items-center justify-center font-display font-bold text-white text-sm">
                      {(selectedThread.userName || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-sm text-white">
                        {selectedThread.userName || 'Visitor'}
                      </span>
                      <span className="text-xs font-mono text-zinc-400">
                        ({selectedThread.userEmail})
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400">
                      <span>Status: <strong className="uppercase text-white">{selectedThread.status}</strong></span>
                      {selectedThread.topic && (
                        <span>• Topic: <span className="text-blue-300">{selectedThread.topic}</span></span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Moderation Actions */}
                <div className="flex items-center gap-2">
                  {selectedThread.status !== 'allowed' && (
                    <button
                      onClick={handleAllowUser}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold uppercase transition-all shadow-lg shadow-emerald-600/30 cursor-pointer active:scale-95"
                    >
                      <CheckCircle2 size={13} />
                      <span>Authorize Chat</span>
                    </button>
                  )}

                  {selectedThread.status !== 'blocked' && (
                    <button
                      onClick={() => setShowBlockModal(true)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold uppercase transition-all shadow-lg shadow-red-600/30 cursor-pointer active:scale-95"
                    >
                      <Ban size={13} />
                      <span>Block</span>
                    </button>
                  )}

                  <button
                    onClick={handleResetToPending}
                    className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all cursor-pointer"
                    title="Reset to Pending Review"
                  >
                    <RotateCcw size={13} />
                  </button>
                </div>
              </div>

              {/* Live Chat Stream */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
                {/* Notice based on user status */}
                {selectedThread.status === 'pending' && (
                  <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-xs font-mono text-amber-300 flex items-start gap-3">
                    <Clock size={16} className="text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">INITIAL INQUIRY AWAITING REVIEW</p>
                      <p className="text-zinc-400 text-[11px] font-body mt-0.5">
                        This visitor dropped their 1-time introductory message. Click "Authorize Chat" above to unlock live bidirectional messaging for them.
                      </p>
                    </div>
                  </div>
                )}

                {selectedThread.status === 'blocked' && (
                  <div className="p-4 rounded-2xl bg-red-950/30 border border-red-500/30 text-xs font-mono text-red-300 flex items-start gap-3">
                    <ShieldAlert size={16} className="text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">USER BLOCKED FROM COMMUNICATION</p>
                      <p className="text-zinc-400 text-[11px] font-body mt-0.5">
                        Reason recorded: "{selectedThread.blockReason || 'General policy restriction'}". This user cannot send messages.
                      </p>
                    </div>
                  </div>
                )}

                {messages.length === 0 ? (
                  <div className="p-12 text-center text-zinc-500">
                    No messages recorded in this conversation yet.
                  </div>
                ) : (
                  messages.map(msg => {
                    const isAdmin = msg.senderRole === 'admin';

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}
                      >
                        <div className="flex items-end gap-2 max-w-[85%]">
                          {!isAdmin && (
                            <div className="w-7 h-7 rounded-full bg-zinc-800 border border-white/20 flex items-center justify-center text-white text-[10px] font-bold shrink-0 mb-1">
                              {(msg.senderName || 'U').charAt(0).toUpperCase()}
                            </div>
                          )}

                          <div
                            className={`p-4 rounded-2xl text-sm font-body leading-relaxed shadow-lg ${
                              isAdmin
                                ? 'bg-blue-600 text-white rounded-br-none shadow-blue-900/30'
                                : 'bg-[#12121a] text-zinc-100 rounded-bl-none border border-white/15'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-4 text-[10px] font-mono pb-1 mb-1 border-b border-white/10 opacity-75">
                              <span className="font-bold flex items-center gap-1">
                                {isAdmin ? 'RAJAN GAUR (YOU)' : msg.senderName}
                                {isAdmin && <ShieldCheck size={11} className="text-blue-200" />}
                              </span>
                              <span>{formatTimestamp(msg.createdAt)}</span>
                            </div>

                            <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Canned Responses Bar */}
              <div className="px-4 py-2 bg-[#09090e] border-t border-white/10 flex items-center gap-2 overflow-x-auto no-scrollbar">
                <span className="text-[10px] font-mono text-zinc-500 shrink-0">
                  <Zap size={11} className="inline mr-1 text-blue-400" />
                  QUICK REPLIES:
                </span>
                {CANNED_REPLIES.map((reply, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setReplyText(reply)}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-mono text-zinc-300 hover:text-white truncate max-w-[200px] shrink-0 transition-colors cursor-pointer"
                    title={reply}
                  >
                    {reply}
                  </button>
                ))}
              </div>

              {/* Live Reply Composer / Blocked Banner */}
              {selectedThread.status === 'blocked' ? (
                <div className="p-4 bg-red-950/30 border-t border-red-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-red-300 shrink-0">
                  <div className="flex items-center gap-2 text-center sm:text-left">
                    <Ban size={15} className="text-red-400 shrink-0" />
                    <span>
                      User is blocked ({selectedThread.blockReason || 'Communication Restricted'}). Sending replies is disabled.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAllowUser}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shrink-0 transition-all cursor-pointer shadow-lg shadow-emerald-600/30 active:scale-95"
                  >
                    Unblock & Authorize
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSendReply} className="p-4 bg-[#0a0a10] border-t border-white/10 shrink-0">
                  <div className="relative flex items-center gap-2">
                    <textarea
                      rows={1}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendReply();
                        }
                      }}
                      placeholder={`Reply to ${selectedThread.userName || 'user'} as Rajan Gaur... (Enter to send)`}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/15 focus:border-blue-500 focus:outline-none text-white text-sm placeholder:text-zinc-500 resize-none font-body transition-colors"
                    />

                    <button
                      type="submit"
                      disabled={!replyText.trim() || sendingReply}
                      className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-white font-mono text-xs font-bold uppercase flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-lg shadow-blue-600/30 active:scale-95"
                    >
                      <span>Transmit</span>
                      <Send size={13} />
                    </button>
                  </div>
                </form>
              )}
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-zinc-500 space-y-3">
              <MessageSquare size={40} className="text-zinc-600" />
              <p className="text-sm font-mono">Select an inquiry from the inbox panel to inspect details.</p>
            </div>
          )}

        </main>

        {/* ============================================================= */}
        {/* PANEL 3: USER DOSSIER & TELEMETRY (COL 9-12 / DESKTOP ONLY)    */}
        {/* ============================================================= */}
        <aside className="hidden lg:flex lg:col-span-3 bg-[#08080d] border-l border-white/10 flex-col overflow-y-auto p-6 space-y-6">
          <div className="space-y-1 pb-4 border-b border-white/10">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase font-bold">
              <Activity size={13} className="text-blue-400" />
              <span>User Telemetry Dossier</span>
            </div>
            <p className="text-[11px] text-zinc-500">
              Verified Google Identity & Audit History
            </p>
          </div>

          {selectedThread ? (
            <div className="space-y-5">
              {/* User Profile Card */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 text-center space-y-3">
                {selectedThread.userPhoto ? (
                  <img
                    src={selectedThread.userPhoto}
                    alt={selectedThread.userName}
                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-500/40 mx-auto shadow-xl"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-zinc-800 border-2 border-blue-500/40 flex items-center justify-center font-display font-black text-xl text-white mx-auto shadow-xl">
                    {(selectedThread.userName || 'U').charAt(0).toUpperCase()}
                  </div>
                )}

                <div>
                  <h4 className="font-display font-bold text-base text-white">
                    {selectedThread.userName || 'Visitor'}
                  </h4>
                  <p className="text-xs font-mono text-zinc-400 truncate">
                    {selectedThread.userEmail}
                  </p>
                </div>

                <div className="pt-2 flex justify-center">
                  {selectedThread.status === 'pending' && (
                    <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold">
                      AWAITING REVIEW
                    </span>
                  )}
                  {selectedThread.status === 'allowed' && (
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold">
                      AUTHORIZED
                    </span>
                  )}
                  {selectedThread.status === 'blocked' && (
                    <span className="px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-mono font-bold">
                      RESTRICTED
                    </span>
                  )}
                </div>
              </div>

              {/* Data Properties */}
              <div className="space-y-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                  <span className="text-[10px] text-zinc-500 uppercase flex items-center gap-1">
                    <Hash size={10} /> User UID
                  </span>
                  <p className="text-zinc-300 text-[11px] truncate font-mono select-all">
                    {selectedThread.userId || selectedThread.id}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                  <span className="text-[10px] text-zinc-500 uppercase flex items-center gap-1">
                    <Calendar size={10} /> First Contact
                  </span>
                  <p className="text-zinc-300 text-[11px] font-mono">
                    {formatTimestamp(selectedThread.createdAt || selectedThread.lastMessageAt)}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                  <span className="text-[10px] text-zinc-500 uppercase flex items-center gap-1">
                    <MessageSquare size={10} /> Total Messages In Thread
                  </span>
                  <p className="text-zinc-300 text-[11px] font-mono font-bold">
                    {messages.length} messages
                  </p>
                </div>

                {selectedThread.blockReason && (
                  <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 space-y-1">
                    <span className="text-[10px] text-red-400 uppercase font-bold flex items-center gap-1">
                      <AlertTriangle size={11} /> Block Explanation
                    </span>
                    <p className="text-red-200 text-xs font-mono leading-relaxed">
                      "{selectedThread.blockReason}"
                    </p>
                  </div>
                )}
              </div>

              {/* Fast Mailout Link */}
              <div className="pt-2">
                <a
                  href={`mailto:${selectedThread.userEmail}`}
                  className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-mono text-zinc-200 hover:text-white flex items-center justify-center gap-2 transition-colors font-semibold"
                >
                  <Mail size={12} />
                  <span>Send Direct Email</span>
                </a>
              </div>
            </div>
          ) : (
            <p className="text-xs font-mono text-zinc-500 text-center pt-8">
              Select a thread to view dossier telemetry.
            </p>
          )}
        </aside>

      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL: BLOCK ACCOUNT CONFIRMATION & REASON SELECTOR            */}
      {/* ───────────────────────────────────────────────────────────── */}
      {showBlockModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl bg-[#0e0708] border border-red-500/40 p-7 shadow-2xl space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-950/80 border border-red-500/40 flex items-center justify-center text-red-400">
                <ShieldAlert size={24} />
              </div>
              <div>
                <h3 className="font-display font-black text-xl text-white uppercase">
                  Block Account & Record Reason
                </h3>
                <p className="text-xs text-zinc-400 font-mono">
                  {selectedThread?.userName} ({selectedThread?.userEmail})
                </p>
              </div>
            </div>

            <p className="text-xs text-zinc-300 font-body leading-relaxed">
              When blocked, this user is restricted from chatting. When they log in via Google, they will receive this official explanation:
            </p>

            {/* Presets */}
            <div className="space-y-2">
              {[
                "Spam / Unsolicited promotional inquiry",
                "Off-topic or irrelevant inquiry",
                "Violates community engagement guidelines",
                "Inappropriate or abusive language",
              ].map(reason => (
                <label
                  key={reason}
                  onClick={() => setSelectedBlockReason(reason)}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-mono cursor-pointer transition-all ${
                    selectedBlockReason === reason
                      ? 'bg-red-950/40 border-red-500/60 text-red-200 font-bold'
                      : 'bg-white/[0.02] border-white/10 text-zinc-400 hover:text-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="blockReason"
                    checked={selectedBlockReason === reason}
                    onChange={() => setSelectedBlockReason(reason)}
                    className="accent-red-500"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>

            {/* Custom Reason */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-zinc-400 uppercase font-semibold">
                Or Custom Reason:
              </label>
              <textarea
                rows={2}
                value={customBlockReason}
                onChange={(e) => setCustomBlockReason(e.target.value)}
                placeholder="Type custom explanation to display to this user..."
                className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-red-500/30 text-white text-xs font-mono placeholder:text-zinc-600 focus:outline-none focus:border-red-500"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowBlockModal(false)}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-zinc-300 font-mono text-xs font-bold uppercase transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={blockingAction}
                onClick={handleConfirmBlock}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold uppercase transition-all shadow-lg shadow-red-600/40 cursor-pointer active:scale-95"
              >
                Confirm Block
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
