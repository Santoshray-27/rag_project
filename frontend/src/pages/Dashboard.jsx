import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const Dashboard = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState([]);
  
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [asking, setAsking] = useState(false);

  // Fetch user's documents on load
  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const { data } = await api.get('/documents');
      if (data.success) {
        setDocuments(data.documents);
      }
    } catch (error) {
      console.error("Error fetching docs", error);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      await api.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFile(null);
      fetchDocuments(); // Refresh list
    } catch (error) {
      console.error("Upload error", error);
      alert("Upload failed. Ensure backend is running and MongoDB is connected.");
    } finally {
      setUploading(false);
    }
  };

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const currentQ = question;
    setQuestion('');
    setAsking(true);
    
    // Add user question to chat instantly
    setChatHistory(prev => [...prev, { role: 'user', content: currentQ }]);

    try {
      const { data } = await api.post('/rag/ask', { question: currentQ });
      if (data.success) {
        setChatHistory(prev => [...prev, { 
          role: 'ai', 
          content: data.answer,
          sources: data.sources 
        }]);
      }
    } catch (error) {
      setChatHistory(prev => [...prev, { role: 'ai', content: "Error: Could not get answer." }]);
    } finally {
      setAsking(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-80px)]">
      
      {/* Left Sidebar: Upload & Docs List */}
      <div className="bg-white rounded-lg shadow p-6 flex flex-col gap-6">
        <div>
          <h2 className="text-xl font-bold mb-4 text-gray-800">Upload Document</h2>
          <form onSubmit={handleUpload} className="flex flex-col gap-3">
            <input 
              type="file" 
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files[0])}
              className="border p-2 rounded w-full text-sm"
            />
            <button 
              type="submit" 
              disabled={!file || uploading}
              className="bg-green-600 text-white p-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {uploading ? 'Processing...' : 'Upload PDF'}
            </button>
          </form>
        </div>

        <div className="flex-1 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Your Documents</h2>
          {documents.length === 0 ? (
            <p className="text-gray-500 text-sm">No documents uploaded yet.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {documents.map((doc, idx) => (
               <li key={idx} className="p-3 bg-gray-50 rounded border text-sm flex justify-between items-center">
                 <span className="truncate w-3/4 font-medium">{doc.fileName}</span>
                 <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                   {doc.chunkCount} chunks
                 </span>
               </li> 
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Right Area: Chat UI */}
      <div className="md:col-span-2 bg-white rounded-lg shadow flex flex-col">
        <div className="p-4 border-b bg-gray-50 rounded-t-lg">
          <h2 className="text-xl font-bold text-gray-800">Chat with Documents</h2>
        </div>
        
        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {chatHistory.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-400">
              Ask a question about your uploaded documents!
            </div>
          ) : (
            chatHistory.map((chat, idx) => (
              <div key={idx} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-4 rounded-lg ${chat.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                  <p className="whitespace-pre-wrap">{chat.content}</p>
                  
                  {/* Sources Render */}
                  {chat.sources && chat.sources.length > 0 && (
                    <div className="mt-4 border-t border-gray-300 pt-2">
                      <p className="text-xs font-bold text-gray-500 mb-2">SOURCES:</p>
                      <div className="flex flex-col gap-2">
                        {chat.sources.map((src, i) => (
                          <div key={i} className="bg-white p-2 rounded border border-gray-200 text-xs">
                            <p className="font-semibold text-blue-600 truncate">{src.fileName}</p>
                            <p className="text-gray-500 mt-1 italic">"{src.preview}"</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          {asking && (
             <div className="flex justify-start">
               <div className="bg-gray-100 p-4 rounded-lg rounded-bl-none text-gray-500 animate-pulse">
                 Thinking...
               </div>
             </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t">
          <form onSubmit={handleAsk} className="flex gap-2">
            <input 
              type="text" 
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 p-3 border rounded-lg focus:outline-none focus:border-blue-500"
              disabled={asking}
            />
            <button 
              type="submit" 
              disabled={asking || !question.trim()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
