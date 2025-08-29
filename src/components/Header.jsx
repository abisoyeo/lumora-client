import {
  LucideMessageCircle,
  MessageCircle,
  MessageCircleIcon,
} from "lucide-react";
const Header = () => {
  return (
    <nav className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 h-16">
        {/* Left Section: Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-slate-900" />
          </div>
          <h1 className="text-xl font-bold text-emerald-400">Lumora</h1>
        </div>

        {/* Right Section: New Chat */}
        {/* <div className="hidden md:flex items-center">
          <button
            className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-all 
          bg-emerald-500 text-slate-900
          hover:text-emerald-400 hover:bg-slate-700"
          >
            <LucideMessageCircle />
            <span>New Chat</span>
          </button>
        </div> */}
      </div>
    </nav>
  );
};

export default Header;
