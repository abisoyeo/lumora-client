import ChatbotComponent from "./components/ChatbotComponent";
import Header from "./components/Header";

const App = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-gray-100">
      {/* Navbar */}
      <Header />
      <main className="container mx-auto px-4 pt-2 md:py-8 max-w-6xl">
        <ChatbotComponent />
      </main>
    </div>
  );
};

export default App;
