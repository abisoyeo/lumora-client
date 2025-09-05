import { useState } from "react";
import ChatbotComponent from "./components/ChatbotComponent";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";

const App = () => {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState("chat");
  const [chatSessions, setChatSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogin = ({ email, password }) => {
    // Simulate login - in real app, this would be an API call
    const mockUser = {
      id: "1",
      name: "John Doe",
      email: email,
      password: password,
      isPremium: true,
    };
    setUser(mockUser);
    setCurrentView("dashboard");
  };

  const handleSignup = ({ name, email, password }) => {
    // Simulate login - in real app, this would be an API call
    const mockUser = {
      id: "1",
      name: name,
      email: email,
      password: password,
      isPremium: true,
    };
    setUser(mockUser);
    setCurrentView("dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView("chat");
    setChatSessions([]);
    setCurrentSession(null);
  };

  const createNewSession = () => {
    const newSession = {
      id: Date.now().toString(),
      title: "New Conversation",
      lastMessage: "",
      timestamp: new Date(),
      messages: [],
    };
    setChatSessions((prev) => [newSession, ...prev]);
    setCurrentSession(newSession);
    setCurrentView("chat");
  };

  const selectSession = (session) => {
    setCurrentSession(session);
    setCurrentView("chat");
  };

  const updateSession = (updatedSession) => {
    setChatSessions((prev) =>
      prev.map((session) =>
        session.id === updatedSession.id ? updatedSession : session
      )
    );
    // Also update current session if it matches
    if (currentSession?.id === updatedSession.id) {
      setCurrentSession(updatedSession);
    } else if (!currentSession) {
      // If no current session, set this as current
      setCurrentSession(updatedSession);
      // Add to sessions list if not already there
      setChatSessions((prev) => {
        const exists = prev.some((s) => s.id === updatedSession.id);
        return exists ? prev : [updatedSession, ...prev];
      });
    }
  };
  return (
    <div className="min-h-screen bg-slate-900 text-gray-100">
      {/* Navbar */}
      <Header
        user={user}
        currentView={currentView}
        setCurrentView={setCurrentView}
        onLogout={handleLogout}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        onCreateNewSession={createNewSession}
        canCreateNew={!!user?.isPremium}
      />
      <main className="container mx-auto px-4 pt-2 md:py-8 max-w-6xl">
        {currentView === "chat" && (
          <ChatbotComponent
            user={user}
            currentSession={currentSession}
            onUpdateSession={updateSession}
            onLogin={() => setCurrentView("login")}
          />
        )}

        {currentView === "login" && (
          <LoginForm
            onLogin={handleLogin}
            onSwitchToSignup={() => setCurrentView("signup")}
            onCancel={() => setCurrentView("chat")}
          />
        )}

        {currentView === "signup" && (
          <SignupForm
            onSignup={handleSignup}
            onSwitchToLogin={() => setCurrentView("login")}
            onCancel={() => setCurrentView("chat")}
          />
        )}

        {currentView === "dashboard" && user?.isPremium && (
          <Dashboard
            user={user}
            chatSessions={chatSessions}
            onSelectSession={selectSession}
            onCreateNewSession={createNewSession}
          />
        )}

        {currentView === "settings" && user && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-slate-800 rounded-xl p-8 shadow-lg">
              <h1 className="text-3xl font-bold text-emerald-400 mb-8">
                Account Settings
              </h1>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={user.name}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                    readOnly
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-emerald-900/20 border border-emerald-500/30 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-emerald-400">
                      Premium Account
                    </h3>
                    <p className="text-sm text-gray-400">
                      Access to advanced features and chat history
                    </p>
                  </div>
                  <div className="px-3 py-1 bg-emerald-500 text-slate-900 rounded-full text-sm font-medium">
                    Active
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;

// import React, { useState, useEffect } from 'react';
// import { MessageCircle, User, Settings, Upload, Plus, LogOut, Menu, X } from 'lucide-react';
// import ChatInterface from './components/ChatInterface';
// import LoginForm from './components/LoginForm';
// import Dashboard from './components/Dashboard';
// import Navigation from './components/Navigation';

// export interface User {
//   id: string;
//   name: string;
//   email: string;
//   isPremium: boolean;
// }

// export interface ChatSession {
//   id: string;
//   title: string;
//   lastMessage: string;
//   timestamp: Date;
//   messages: Message[];
// }

// export interface Message {
//   id: string;
//   content: string;
//   isBot: boolean;
//   timestamp: Date;
// }

// function App() {
//   const [user, setUser] = useState<User | null>(null);
//   const [currentView, setCurrentView] = useState<'chat' | 'login' | 'dashboard' | 'settings'>('chat');
//   const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
//   const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   // Initialize with some sample data for premium users
//   useEffect(() => {
//     if (user?.isPremium) {
//       const sampleSessions: ChatSession[] = [
//         {
//           id: '1',
//           title: 'VAT Registration Process',
//           lastMessage: 'Thank you for the detailed explanation about VAT registration requirements.',
//           timestamp: new Date(Date.now() - 86400000), // 1 day ago
//           messages: [
//             {
//               id: '1',
//               content: 'How do I register for VAT in Nigeria?',
//               isBot: false,
//               timestamp: new Date(Date.now() - 86400000 - 60000)
//             },
//             {
//               id: '2',
//               content: 'To register for VAT in Nigeria, you need to meet certain criteria and follow these steps: 1) Ensure your annual turnover exceeds ₦25 million, 2) Visit the nearest FIRS office or register online through the TaxPro Max portal...',
//               isBot: true,
//               timestamp: new Date(Date.now() - 86400000)
//             }
//           ]
//         },
//         {
//           id: '2',
//           title: 'Business Registration Lagos',
//           lastMessage: 'The CAC registration process typically takes 3-5 business days.',
//           timestamp: new Date(Date.now() - 172800000), // 2 days ago
//           messages: [
//             {
//               id: '3',
//               content: 'What documents do I need for business registration in Lagos?',
//               isBot: false,
//               timestamp: new Date(Date.now() - 172800000 - 120000)
//             },
//             {
//               id: '4',
//               content: 'For business registration with the Corporate Affairs Commission (CAC) in Lagos, you will need: 1) Completed CAC forms, 2) Memorandum and Articles of Association, 3) Evidence of payment of stamp duty...',
//               isBot: true,
//               timestamp: new Date(Date.now() - 172800000)
//             }
//           ]
//         }
//       ];
//       setChatSessions(sampleSessions);
//     }
//   }, [user]);

//   const handleLogin = (email: string, password: string) => {
//     // Simulate login - in real app, this would be an API call
//     const mockUser: User = {
//       id: '1',
//       name: 'John Doe',
//       email: email,
//       isPremium: true
//     };
//     setUser(mockUser);
//     setCurrentView('dashboard');
//   };

//   const handleLogout = () => {
//     setUser(null);
//     setCurrentView('chat');
//     setChatSessions([]);
//     setCurrentSession(null);
//   };

//   const createNewSession = () => {
//     const newSession: ChatSession = {
//       id: Date.now().toString(),
//       title: 'New Conversation',
//       lastMessage: '',
//       timestamp: new Date(),
//       messages: []
//     };
//     setChatSessions(prev => [newSession, ...prev]);
//     setCurrentSession(newSession);
//     setCurrentView('chat');
//   };

//   const selectSession = (session: ChatSession) => {
//     setCurrentSession(session);
//     setCurrentView('chat');
//   };

//   const updateSession = (updatedSession: ChatSession) => {
//     setChatSessions(prev =>
//       prev.map(session =>
//         session.id === updatedSession.id ? updatedSession : session
//       )
//     );
//     // Also update current session if it matches
//     if (currentSession?.id === updatedSession.id) {
//       setCurrentSession(updatedSession);
//     } else if (!currentSession) {
//       // If no current session, set this as current
//       setCurrentSession(updatedSession);
//       // Add to sessions list if not already there
//       setChatSessions(prev => {
//         const exists = prev.some(s => s.id === updatedSession.id);
//         return exists ? prev : [updatedSession, ...prev];
//       });
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-900 text-gray-100">
//       <Navigation
//         user={user}
//         currentView={currentView}
//         setCurrentView={setCurrentView}
//         onLogout={handleLogout}
//         isMobileMenuOpen={isMobileMenuOpen}
//         setIsMobileMenuOpen={setIsMobileMenuOpen}
//         onCreateNewSession={createNewSession}
//         canCreateNew={!!user?.isPremium}
//       />

//       <main className="container mx-auto px-4 py-8 max-w-6xl">
//         {currentView === 'chat' && (
//           <ChatInterface
//             user={user}
//             currentSession={currentSession}
//             onUpdateSession={updateSession}
//             onLogin={() => setCurrentView('login')}
//           />
//         )}

//         {currentView === 'login' && (
//           <LoginForm
//             onLogin={handleLogin}
//             onCancel={() => setCurrentView('chat')}
//           />
//         )}

//         {currentView === 'dashboard' && user?.isPremium && (
//           <Dashboard
//             user={user}
//             chatSessions={chatSessions}
//             onSelectSession={selectSession}
//             onCreateNewSession={createNewSession}
//           />
//         )}

//         {currentView === 'settings' && user && (
//           <div className="max-w-2xl mx-auto">
//             <div className="bg-slate-800 rounded-xl p-8 shadow-lg">
//               <h1 className="text-3xl font-bold text-emerald-400 mb-8">Account Settings</h1>

//               <div className="space-y-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
//                   <input
//                     type="text"
//                     value={user.name}
//                     className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
//                     readOnly
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
//                   <input
//                     type="email"
//                     value={user.email}
//                     className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
//                     readOnly
//                   />
//                 </div>

//                 <div className="flex items-center justify-between p-4 bg-emerald-900/20 border border-emerald-500/30 rounded-lg">
//                   <div>
//                     <h3 className="font-semibold text-emerald-400">Premium Account</h3>
//                     <p className="text-sm text-gray-400">Access to advanced features and chat history</p>
//                   </div>
//                   <div className="px-3 py-1 bg-emerald-500 text-slate-900 rounded-full text-sm font-medium">
//                     Active
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }

// export default App;
