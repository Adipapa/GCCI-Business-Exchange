import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DealRoom, Currency } from '../../types';
import { 
  ShieldCheck, 
  Send, 
  Paperclip, 
  FileText, 
  CheckSquare, 
  Square, 
  Plus, 
  DollarSign, 
  Users, 
  Calendar, 
  Lock, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  ArrowLeft
} from 'lucide-react';

interface DealRoomWorkspaceProps {
  dealRoomId: string;
  onBack: () => void;
}

export const DealRoomWorkspace: React.FC<DealRoomWorkspaceProps> = ({ dealRoomId, onBack }) => {
  const { 
    dealRooms, 
    currentUser, 
    addDealRoomMessage, 
    addDealRoomDocument, 
    addDealRoomActionItem, 
    toggleActionItem, 
    updateDealRoomStatus 
  } = useApp();

  const room = dealRooms.find(dr => dr.id === dealRoomId);

  const [messageInput, setMessageInput] = useState('');
  const [activeTab, setActiveTab] = useState<'messages' | 'documents' | 'action_items' | 'deal_terms'>('messages');

  // New action item state
  const [newActionTitle, setNewActionTitle] = useState('');
  const [newActionAssignee, setNewActionAssignee] = useState(currentUser.fullName);
  const [newActionDueDate, setNewActionDueDate] = useState('');

  // New document upload state
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocFileName, setNewDocFileName] = useState('');
  const [newDocConfidential, setNewDocConfidential] = useState(false);

  // Deal completion state
  const [dealStatus, setDealStatus] = useState<DealRoom['status']>(room?.status || 'negotiating');
  const [reportedValue, setReportedValue] = useState<number>(room?.reportedValue || 0);
  const [dealOutcome, setDealOutcome] = useState(room?.reportedOutcome || '');
  const [statusUpdated, setStatusUpdated] = useState(false);

  if (!room) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
        <p className="text-slate-600">Deal Room not found or you are not an authorized participant.</p>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs">
          Return to Deal Rooms
        </button>
      </div>
    );
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    addDealRoomMessage(room.id, messageInput.trim());
    setMessageInput('');
  };

  const handleAddAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActionTitle) return;

    addDealRoomActionItem(room.id, {
      title: newActionTitle,
      assignedTo: newActionAssignee || currentUser.fullName,
      dueDate: newActionDueDate || new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().slice(0, 10)
    });

    setNewActionTitle('');
    setNewActionDueDate('');
  };

  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocTitle) return;

    addDealRoomDocument(room.id, {
      title: newDocTitle,
      fileName: newDocFileName || `${newDocTitle.replace(/\s+/g, '_')}.pdf`,
      size: '1.8 MB',
      confidential: newDocConfidential,
      fileUrl: '#'
    });

    setNewDocTitle('');
    setNewDocFileName('');
    setNewDocConfidential(false);
  };

  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    updateDealRoomStatus(room.id, dealStatus, Number(reportedValue), dealOutcome);
    setStatusUpdated(true);
    setTimeout(() => setStatusUpdated(false), 2000);
  };

  return (
    <div className="gcci-dealroom bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[750px] max-h-[85vh]">
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors"
            title="Back to portal"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                {room.referenceNumber}
              </span>
              <span className="text-xs text-slate-400 capitalize">
                · {room.originatingType.replace('_', ' ')}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight mt-0.5">
              {room.title}
            </h2>
          </div>
        </div>

        {/* Current Status Badge */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Status</span>
            <span className="text-xs font-bold text-emerald-400 capitalize bg-slate-800 px-2.5 py-1 rounded border border-slate-700">
              {room.status.replace('_', ' ')}
            </span>
          </div>
          {room.reportedValue ? (
            <div className="text-right hidden sm:block">
              <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Agreed Value</span>
              <span className="text-xs font-bold text-white font-mono-numbers">
                D{room.reportedValue.toLocaleString()} {room.currency}
              </span>
            </div>
          ) : null}
        </div>
      </div>

      {/* Participants & Security Bar */}
      <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
        <div className="flex items-center gap-2">
          <Users className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-medium text-slate-700">Participants:</span>
          {room.participants.map((p, i) => (
            <span key={i} className="text-slate-700">
              {p.name} ({p.businessName}) {i < room.participants.length - 1 ? '·' : ''}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-1.5 text-emerald-800 text-[11px] font-medium">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>GCCI Protected Commercial Workspace</span>
        </div>
      </div>

      {/* Workspace Tabs */}
      <div className="flex border-b border-slate-200 bg-white px-4 text-xs font-medium text-slate-600">
        <button
          onClick={() => setActiveTab('messages')}
          className={`py-3 px-4 border-b-2 font-semibold transition-colors ${activeTab === 'messages' ? 'border-emerald-800 text-emerald-900' : 'border-transparent hover:text-slate-900'}`}
        >
          Discussion ({room.messages.length})
        </button>
        <button
          onClick={() => setActiveTab('documents')}
          className={`py-3 px-4 border-b-2 font-semibold transition-colors ${activeTab === 'documents' ? 'border-emerald-800 text-emerald-900' : 'border-transparent hover:text-slate-900'}`}
        >
          Documents Vault ({room.documents.length})
        </button>
        <button
          onClick={() => setActiveTab('action_items')}
          className={`py-3 px-4 border-b-2 font-semibold transition-colors ${activeTab === 'action_items' ? 'border-emerald-800 text-emerald-900' : 'border-transparent hover:text-slate-900'}`}
        >
          Action Items ({room.actionItems.filter(a => a.completed).length}/{room.actionItems.length})
        </button>
        <button
          onClick={() => setActiveTab('deal_terms')}
          className={`py-3 px-4 border-b-2 font-semibold transition-colors ${activeTab === 'deal_terms' ? 'border-emerald-800 text-emerald-900' : 'border-transparent hover:text-slate-900'}`}
        >
          Commercial Agreement & Outcome
        </button>
      </div>

      {/* Workspace Tab Contents */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50">
        {/* 1. MESSAGING TAB */}
        {activeTab === 'messages' && (
          <div className="h-full flex flex-col justify-between space-y-4">
            <div className="space-y-3 overflow-y-auto pr-2 max-h-[460px]">
              {room.messages.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  <p>No messages exchanged yet.</p>
                  <p className="mt-1">Initiate commercial discussions or introduce your specifications below.</p>
                </div>
              ) : (
                room.messages.map(msg => {
                  const isMe = msg.senderId === currentUser.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-2 mb-1 text-[11px] text-slate-500">
                        <span className="font-semibold text-slate-800">{msg.senderName}</span>
                        <span>({msg.senderBusiness})</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono-numbers">{msg.timestamp}</span>
                      </div>
                      <div
                        className={`p-3 rounded-2xl max-w-lg text-xs leading-relaxed shadow-2xs ${isMe ? 'bg-emerald-800 text-white rounded-tr-xs' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs'}`}
                      >
                        {msg.content}
                        {msg.attachmentName && (
                          <div className={`mt-2 pt-2 border-t flex items-center gap-1.5 text-[11px] ${isMe ? 'border-emerald-700 text-emerald-200' : 'border-slate-100 text-slate-500'}`}>
                            <Paperclip className="w-3.5 h-3.5" />
                            <span>{msg.attachmentName}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Message Input Box */}
            <form onSubmit={handleSendMessage} className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center gap-2">
              <input
                type="text"
                value={messageInput}
                onChange={e => setMessageInput(e.target.value)}
                placeholder="Type your message, contract clarification, delivery timetable..."
                className="flex-1 text-xs text-slate-900 focus:outline-none px-2"
              />
              <button
                type="submit"
                className="p-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg transition-colors shadow-xs"
                title="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* 2. DOCUMENTS TAB */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Protected Deal Documents & Contracts</h3>
                <p className="text-xs text-slate-500">Accessible strictly by verified room participants.</p>
              </div>
            </div>

            {/* Document list */}
            <div className="space-y-2">
              {room.documents.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-xs text-slate-500">
                  No documents shared in this Deal Room yet.
                </div>
              ) : (
                room.documents.map(doc => (
                  <div
                    key={doc.id}
                    className="p-3.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs hover:border-slate-300"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-600">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{doc.title}</p>
                        <p className="text-[11px] text-slate-400 font-mono-numbers">
                          {doc.fileName} · {doc.size} · Uploaded by {doc.uploadedBy} on {doc.uploadedAt}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {doc.confidential && (
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded text-[10px] font-semibold">
                          Confidential NDA
                        </span>
                      )}
                      <button
                        onClick={() => alert(`Simulated secure download of ${doc.fileName} via GCCI protected file storage.`)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg text-xs"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Upload Document Box */}
            <form onSubmit={handleAddDocument} className="p-4 bg-white rounded-xl border border-slate-200 space-y-3 text-xs">
              <h4 className="font-semibold text-slate-900">Upload Commercial Document / Agreement</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">Document Title</label>
                  <input
                    type="text"
                    required
                    value={newDocTitle}
                    onChange={e => setNewDocTitle(e.target.value)}
                    placeholder="e.g. Purchase Order PO-2026-901"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">File Name</label>
                  <input
                    type="text"
                    value={newDocFileName}
                    onChange={e => setNewDocFileName(e.target.value)}
                    placeholder="PO_Groundnut_Signed.pdf"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono-numbers"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={newDocConfidential}
                    onChange={e => setNewDocConfidential(e.target.checked)}
                    className="rounded text-emerald-800"
                  />
                  <span>Mark as strictly confidential</span>
                </label>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg shadow-xs"
                >
                  Upload to Deal Room
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 3. ACTION ITEMS TAB */}
        {activeTab === 'action_items' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Action Items & Deliverables Checklist</h3>
              <p className="text-xs text-slate-500">Track mutual milestones from sample inspection to contract execution.</p>
            </div>

            <div className="space-y-2">
              {room.actionItems.map(item => (
                <div
                  key={item.id}
                  onClick={() => toggleActionItem(room.id, item.id)}
                  className={`p-3 bg-white rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-all ${item.completed ? 'border-emerald-200 bg-emerald-50/30 line-through text-slate-400' : 'border-slate-200 hover:border-slate-300 text-slate-800'}`}
                >
                  <div className="flex items-center gap-3">
                    {item.completed ? (
                      <CheckSquare className="w-4 h-4 text-emerald-700 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <span className="font-medium">{item.title}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono-numbers">
                    <span>Assigned: <strong>{item.assignedTo}</strong></span>
                    <span>Due: {item.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Action Item Form */}
            <form onSubmit={handleAddAction} className="p-4 bg-white rounded-xl border border-slate-200 space-y-3 text-xs">
              <h4 className="font-semibold text-slate-900">Add Milestone / Action Item</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-slate-600 mb-1">Action Description</label>
                  <input
                    type="text"
                    required
                    value={newActionTitle}
                    onChange={e => setNewActionTitle(e.target.value)}
                    placeholder="e.g. Dispatch 2kg cashew sampling batch to Kanifing lab"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newActionDueDate}
                    onChange={e => setNewActionDueDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono-numbers"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg shadow-xs"
                >
                  Add Milestone
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 4. DEAL TERMS & CLOSURE TAB (Section 13.6) */}
        {activeTab === 'deal_terms' && (
          <form onSubmit={handleUpdateStatus} className="max-w-2xl bg-white p-6 rounded-xl border border-slate-200 space-y-5 text-xs">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Commercial Outcome & Agreement Tracking</h3>
              <p className="text-slate-500 text-xs mt-0.5">
                Record contract status changes and commercial transaction amounts to maintain auditable trade records.
              </p>
            </div>

            {statusUpdated && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Deal status and commercial figures updated successfully!</span>
              </div>
            )}

            <div>
              <label className="block font-medium text-slate-700 mb-1">Current Deal Status</label>
              <select
                value={dealStatus}
                onChange={e => setDealStatus(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-800 capitalize font-medium"
              >
                <option value="awaiting_response">Awaiting Initial Response</option>
                <option value="contacted">Contacted & Exploring Specs</option>
                <option value="negotiating">Active Price & Terms Negotiation</option>
                <option value="due_diligence">Statutory Due Diligence & Sampling</option>
                <option value="agreement_reached">Commercial Agreement Signed</option>
                <option value="completed">Deal Completed & Dispatched</option>
                <option value="unsuccessful">Closed - Unsuccessful</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Reported Transaction Amount</label>
                <input
                  type="number"
                  value={reportedValue}
                  onChange={e => setReportedValue(Number(e.target.value))}
                  placeholder="e.g. 2500000"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono-numbers"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Currency</label>
                <input
                  type="text"
                  disabled
                  value={room.currency}
                  className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-lg text-xs font-mono-numbers text-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Commercial Outcome Summary & Terms</label>
              <textarea
                rows={3}
                value={dealOutcome}
                onChange={e => setDealOutcome(e.target.value)}
                placeholder="State agreed payment terms, delivery schedule, port of discharge, or closure rationale..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg shadow-xs text-xs"
              >
                Save Deal Outcome
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
