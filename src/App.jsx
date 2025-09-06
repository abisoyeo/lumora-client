import { useEffect, useState } from "react";
import ChatbotComponent from "./components/ChatbotComponent";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import Settings from "./components/Settings";

import { getAllSessions, saveSession } from "./lib/db";
import { useAuth } from "./hooks/useAuth";

const App = () => {
  const { user, error, handleLogin, handleSignup, handleLogout, setError } =
    useAuth();

  const [currentView, setCurrentView] = useState("chat");
  const [chatSessions, setChatSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const createNewSession = () => {
    if (!user?.isPremium) return;

    const newCount =
      chatSessions.filter((s) => s.title.startsWith("New Conversation"))
        .length + 1;

    const newSession = {
      id: Date.now().toString(),
      title: `New Conversation ${newCount}`,
      lastMessage: "",
      timestamp: new Date(),
      messages: [],
      userId: user.id,
    };

    setChatSessions((prev) => [newSession, ...prev]);
    setCurrentSession(newSession);

    saveSession(newSession);
    setCurrentView("chat");
  };

  const selectSession = (session) => {
    setCurrentSession(session);
    setCurrentView("chat");
  };

  const updateSession = (updatedSession) => {
    let sessionToSave = {
      ...updatedSession,
      timestamp: new Date(),
    };

    // Set lastMessage to last in the array
    if (sessionToSave.messages.length > 0) {
      sessionToSave.lastMessage =
        sessionToSave.messages[sessionToSave.messages.length - 1].text;
    }

    // Improve title if first user message
    if (
      sessionToSave.messages.length === 1 &&
      sessionToSave.title.startsWith("New Conversation")
    ) {
      const firstMessage = sessionToSave.messages[0].text || "Untitled";
      sessionToSave.title = `${sessionToSave.title}: ${firstMessage.slice(
        0,
        30
      )}`;
    }

    if (user?.isPremium) {
      setChatSessions((prev) =>
        prev.map((s) => (s.id === sessionToSave.id ? sessionToSave : s))
      );
      setCurrentSession(sessionToSave);
      saveSession(sessionToSave); // IndexedDB
    } else {
      localStorage.setItem(
        "freeUserChat",
        JSON.stringify(sessionToSave.messages)
      );
      setCurrentSession(sessionToSave);
    }
  };

  useEffect(() => {
    if (user?.isPremium) {
      getAllSessions(user.id).then((sessions) => setChatSessions(sessions));
    } else {
      const saved = localStorage.getItem("freeUserChat");
      if (saved) {
        const messages = JSON.parse(saved);
        const defaultSession = {
          id: "free-session",
          title: "Free Chat",
          messages,
          timestamp: new Date(),
        };
        setCurrentSession(defaultSession);
        setChatSessions([defaultSession]);
      } else {
        setCurrentSession(null);
        setChatSessions([]);
      }
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-slate-900 text-gray-100">
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
            onLogin={async (data) => {
              const newUser = await handleLogin(data);
              if (newUser) setCurrentView("dashboard");
            }}
            onSwitchToSignup={() => setCurrentView("signup")}
            onCancel={() => setCurrentView("chat")}
            error={error}
          />
        )}

        {currentView === "signup" && (
          <SignupForm
            onSignup={async (data) => {
              const newUser = await handleSignup(data);
              if (newUser) setCurrentView("dashboard");
            }}
            onSwitchToLogin={() => setCurrentView("login")}
            onCancel={() => setCurrentView("chat")}
            error={error}
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

        {currentView === "settings" && user && <Settings user={user} />}
      </main>
    </div>
  );
};

export default App;
