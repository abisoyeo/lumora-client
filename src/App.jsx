import { useEffect, useState } from "react";
import ChatbotComponent from "./components/ChatbotComponent";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import { getAllSessions, saveSession } from "./lib/db";
import { login, signup } from "./lib/api";
import { setLogoutHandler } from "./lib/axios";

const App = () => {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState("chat");
  const [chatSessions, setChatSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (loginData) => {
    try {
      const response = await login(loginData);

      console.log(response);

      // He should send user login details along with token

      // const user = {
      //   id: response.id,
      //   name: response.profile.name,
      //   email: response.email,
      //   isPremium: response.subscription_type === "premium",
      // };

      const mockUser = {
        id: "1",
        name: "John Doe",
        email: loginData.email,
        isPremium: true,
      };
      setUser(mockUser);
      setCurrentView("dashboard");
    } catch (error) {
      console.error("Login error:", error);

      let message = "Login failed. Please try again.";

      const detail = error.response?.data?.detail;

      if (typeof detail === "string") {
        // case: simple error message string
        message = detail;
      } else if (Array.isArray(detail)) {
        // case: validation errors array
        message = detail.map((err) => err.msg).join(", ");
      }

      setError(message);
      return;
    }
  };

  const handleSignup = async ({ name, email, password }) => {
    try {
      const response = await signup({
        name,
        email,
        password,
        subscription_type: "premium",
      });
      const user = {
        id: response.id,
        name: response.profile.name,
        email: response.email,
        isPremium: response.subscription_type === "premium",
      };

      setUser(user);
      setCurrentView("dashboard");
    } catch (error) {
      console.error("Signup error:", error);
      let message = "Login failed. Please try again.";

      const detail = error.response?.data?.detail;

      if (typeof detail === "string") {
        // case: simple error message string
        message = detail;
      } else if (Array.isArray(detail)) {
        // case: validation errors array
        message = detail.map((err) => err.msg).join(", ");
      }

      setError(message);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView("chat");
    setChatSessions([]);
    setCurrentSession(null);
    localStorage.removeItem("access_token");
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

    saveSession(newSession);
  };

  const selectSession = (session) => {
    setCurrentSession(session);
    setCurrentView("chat");
  };

  const updateSession = (updatedSession) => {
    setChatSessions((prev) =>
      prev.map((s) => (s.id === updatedSession.id ? updatedSession : s))
    );
    setCurrentSession(updatedSession);

    // Persist in IndexedDB
    saveSession(updatedSession);
  };

  // Load from IndexedDB on mount
  useEffect(() => {
    setLogoutHandler(handleLogout);

    getAllSessions().then((sessions) => {
      setChatSessions(sessions);
    });
  }, []);
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
            error={error}
          />
        )}

        {currentView === "signup" && (
          <SignupForm
            onSignup={handleSignup}
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
