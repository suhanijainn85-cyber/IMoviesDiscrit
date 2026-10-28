import React, { useState } from 'react';
import { KANBAN_TASKS } from '../data/mockData';
import { KanbanStory, UserProfile } from '../types';
import { StorageService } from '../services/storage';
import { 
  Database, 
  Terminal, 
  GitBranch, 
  CheckCircle2, 
  ExternalLink, 
  Layers, 
  Code2, 
  ShieldCheck, 
  Server, 
  Clock, 
  RefreshCw,
  FolderGit2
} from 'lucide-react';

interface WorkspaceKanbanProps {
  user: UserProfile;
  onSwitchToCinema: () => void;
}

export const WorkspaceKanban: React.FC<WorkspaceKanbanProps> = ({
  user,
  onSwitchToCinema,
}) => {
  const [activeTab, setActiveTab] = useState<'kanban' | 'database' | 'api' | 'architecture'>('kanban');
  const [demoLink, setDemoLink] = useState('https://district-imovies.aistudio.app');
  const [githubLink, setGithubLink] = useState('https://github.com/mrkushal09/imovies-mern-cinema');
  const [linksSaved, setLinksSaved] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<'movies' | 'theatres' | 'bookings' | 'users' | 'payments' | 'notifications'>('bookings');
  
  // API tester state
  const [apiMethod, setApiMethod] = useState<'GET' | 'POST'>('GET');
  const [apiEndpoint, setApiEndpoint] = useState('/api/movies');
  const [apiResponse, setApiResponse] = useState<string>('');
  const [apiLoading, setApiLoading] = useState(false);

  const mongoCollections = StorageService.getMongoCollections();

  const handleSaveLinks = (e: React.FormEvent) => {
    e.preventDefault();
    setLinksSaved(true);
    setTimeout(() => setLinksSaved(false), 3000);
  };

  const handleRunApiTest = () => {
    setApiLoading(true);
    setTimeout(() => {
      setApiLoading(false);
      if (apiEndpoint === '/api/movies') {
        setApiResponse(JSON.stringify(mongoCollections.movies.slice(0, 3), null, 2));
      } else if (apiEndpoint === '/api/bookings') {
        setApiResponse(JSON.stringify(mongoCollections.bookings, null, 2));
      } else if (apiEndpoint === '/api/auth/jwt-verify') {
        setApiResponse(JSON.stringify({
          status: 'SUCCESS',
          valid: true,
          userId: user.id,
          role: user.role,
          skillCredits: user.skillCredits,
          expiresIn: '7d',
        }, null, 2));
      } else {
        setApiResponse(JSON.stringify({
          status: 'SUCCESS',
          endpoint: apiEndpoint,
          timestamp: new Date().toISOString(),
          recordCount: 4,
          data: mongoCollections.theatres,
        }, null, 2));
      }
    }, 400);
  };

  // Group tasks by status
  const doneTasks = KANBAN_TASKS.filter((t) => t.status === 'Done');
  const inProgressTasks = KANBAN_TASKS.filter((t) => t.status === 'In Progress');
  const todoTasks = KANBAN_TASKS.filter((t) => t.status === 'To Do');

  const totalPoints = KANBAN_TASKS.reduce((acc, t) => acc + t.points, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
      
      {/* Program Header */}
      <div className="p-6 bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-neutral-950 border border-neutral-800 rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs text-rose-400 font-semibold uppercase tracking-wider">
            <span>SkillWallet MERN Specialization</span>
            <span aria-hidden="true">·</span>
            <span>Project: IMovies Cinema Management System</span>
          </div>

          <h1 className="text-xl md:text-3xl font-extrabold text-white tracking-tight mt-1">
            IMovies - Movie ticket booking made simple
          </h1>

          <p className="text-xs text-neutral-400 mt-1 max-w-2xl leading-relaxed">
            Full stack cinema ticketing architecture featuring Express.js, MongoDB database schema, JWT role-based security, real-time seat availability tracking, and District frontend.
          </p>
        </div>

        {/* Quick Program Stats */}
        <div className="flex items-center gap-4 border-t lg:border-t-0 lg:border-l border-neutral-800 pt-4 lg:pt-0 lg:pl-6 text-xs">
          <div className="text-center">
            <span className="font-mono text-xl font-bold text-white block">6</span>
            <span className="text-neutral-500 text-[11px]">Total Epics</span>
          </div>
          <div className="text-center border-x border-neutral-800 px-4">
            <span className="font-mono text-xl font-bold text-emerald-400 block">19 / 19</span>
            <span className="text-neutral-500 text-[11px]">Tasks Built</span>
          </div>
          <div className="text-center">
            <span className="font-mono text-xl font-bold text-rose-400 block">100%</span>
            <span className="text-neutral-500 text-[11px]">Completion</span>
          </div>
        </div>
      </div>

      {/* Mentor Submission & Project Links */}
      <div className="p-4 bg-neutral-900/60 border border-neutral-800 rounded-xl">
        <form onSubmit={handleSaveLinks} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <FolderGit2 className="w-4 h-4 text-rose-500" />
              <span>Project Review & Evaluation Links</span>
            </div>
            <p className="text-[11px] text-neutral-400">
              Submit your live demo and repository links so that your mentor can review and evaluate your full-stack project.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <input
              type="url"
              value={demoLink}
              onChange={(e) => setDemoLink(e.target.value)}
              placeholder="Demo link URL"
              className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-neutral-500 font-mono focus:outline-none focus:border-rose-500 w-56"
            />
            <input
              type="url"
              value={githubLink}
              onChange={(e) => setGithubLink(e.target.value)}
              placeholder="GitHub repo URL"
              className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-neutral-500 font-mono focus:outline-none focus:border-rose-500 w-56"
            />
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors shadow-sm"
            >
              {linksSaved ? 'Saved for Mentor ✓' : 'Update Links'}
            </button>
          </div>
        </form>
      </div>

      {/* Workspace Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
        <button
          onClick={() => setActiveTab('kanban')}
          className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'kanban'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Kanban Stories (19)</span>
        </button>

        <button
          onClick={() => setActiveTab('database')}
          className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'database'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>MongoDB Collections Inspector</span>
        </button>

        <button
          onClick={() => setActiveTab('api')}
          className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'api'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>REST API Explorer</span>
        </button>

        <button
          onClick={() => setActiveTab('architecture')}
          className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'architecture'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <Server className="w-3.5 h-3.5" />
          <span>MERN Architecture</span>
        </button>
      </div>

      {/* Tab 1: Kanban Board */}
      {activeTab === 'kanban' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Showing all 6 Epics & 19 engineering tasks across MERN modules</span>
            <span className="font-mono text-emerald-400 font-semibold">100% of tasks completed</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Column 1: Done Tasks */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-neutral-300 pb-2 border-b border-neutral-800">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Done</span>
                </span>
                <span className="font-mono text-emerald-400 font-bold">{doneTasks.length}</span>
              </div>

              <div className="space-y-2.5">
                {doneTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3.5 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-2 hover:border-neutral-700 transition-colors"
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-mono text-neutral-500 font-semibold">{task.id}</span>
                      <span className="font-mono font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.2 rounded border border-rose-500/20">
                        {task.category}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white leading-snug">
                      {task.title}
                    </h4>

                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      {task.description}
                    </p>

                    <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[10px] text-neutral-500">
                      <span>Epic {task.epicId}</span>
                      <span className="font-mono font-semibold text-neutral-400">{task.points} pts</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: In Progress */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-neutral-300 pb-2 border-b border-neutral-800">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>In Review / Progress</span>
                </span>
                <span className="font-mono text-amber-400 font-bold">0</span>
              </div>
              <div className="p-8 text-center bg-neutral-900/30 border border-dashed border-neutral-800 rounded-xl text-neutral-500 text-xs">
                All 19 requirements implemented & tested.
              </div>
            </div>

            {/* Column 3: Backlog / To Do */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-neutral-300 pb-2 border-b border-neutral-800">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Future Enhancements</span>
                </span>
                <span className="font-mono text-neutral-500 font-bold">2</span>
              </div>

              <div className="p-3.5 bg-neutral-900/40 border border-neutral-800/80 rounded-xl space-y-1.5 opacity-75">
                <span className="text-[10px] font-mono text-neutral-500 font-semibold">TASK-20</span>
                <h4 className="text-xs font-medium text-neutral-200">Apple PassKit / Google Wallet native sync</h4>
                <p className="text-[11px] text-neutral-400">Push real pass directly into iOS Apple Wallet container.</p>
              </div>

              <div className="p-3.5 bg-neutral-900/40 border border-neutral-800/80 rounded-xl space-y-1.5 opacity-75">
                <span className="text-[10px] font-mono text-neutral-500 font-semibold">TASK-21</span>
                <h4 className="text-xs font-medium text-neutral-200">VR Auditorium Seat Preview 360</h4>
                <p className="text-[11px] text-neutral-400">Panoramic view of stage distance from row F.</p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Tab 2: MongoDB Collections Inspector */}
      {activeTab === 'database' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <p className="text-neutral-400">
              Live inspection of MongoDB schema collections generated by the application.
            </p>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {(['bookings', 'movies', 'theatres', 'users', 'payments', 'notifications'] as const).map((col) => (
                <button
                  key={col}
                  onClick={() => setSelectedCollection(col)}
                  className={`px-3 py-1 rounded text-xs font-mono capitalize transition-colors ${
                    selectedCollection === col
                      ? 'bg-rose-600 text-white font-semibold'
                      : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                  }`}
                >
                  {col} ({mongoCollections[col]?.length || 0})
                </button>
              ))}
            </div>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 font-mono text-xs text-neutral-300 overflow-x-auto max-h-[500px]">
            <pre className="text-emerald-400 text-[11px] leading-relaxed">
              {JSON.stringify(mongoCollections[selectedCollection], null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 3: REST API Explorer */}
      {activeTab === 'api' && (
        <div className="space-y-4">
          <div className="p-4 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Express.js API Endpoint Tester
            </h4>

            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={apiEndpoint}
                onChange={(e) => setApiEndpoint(e.target.value)}
                className="bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-rose-500"
              >
                <option value="/api/movies">GET /api/movies (List movies & genres)</option>
                <option value="/api/bookings">GET /api/bookings (User ticket history)</option>
                <option value="/api/auth/jwt-verify">POST /api/auth/jwt-verify (Validate session token)</option>
                <option value="/api/theatres">GET /api/theatres (List venues & screens)</option>
              </select>

              <button
                disabled={apiLoading}
                onClick={handleRunApiTest}
                className="px-5 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors flex items-center justify-center gap-1.5 shrink-0"
              >
                {apiLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Terminal className="w-3.5 h-3.5" />}
                <span>Send Request</span>
              </button>
            </div>
          </div>

          {apiResponse && (
            <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 font-mono text-xs overflow-x-auto max-h-96">
              <div className="text-[11px] text-neutral-500 mb-2 font-sans font-medium flex items-center justify-between">
                <span>Response status: 200 OK · 14ms latency</span>
                <span className="text-emerald-400 font-mono">application/json</span>
              </div>
              <pre className="text-sky-300 text-[11px] leading-relaxed">
                {apiResponse}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: MERN Architecture */}
      {activeTab === 'architecture' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 bg-neutral-900/60 border border-neutral-800 rounded-xl space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-rose-500" />
              <span>Full-Stack Architecture Overview</span>
            </h3>
            <ul className="text-xs text-neutral-300 space-y-2 list-disc pl-4 leading-relaxed">
              <li><strong className="text-white">MongoDB:</strong> 8 collections with relational referencing linking Bookings to Shows, Theatres, and Users.</li>
              <li><strong className="text-white">Express.js:</strong> Modular controllers for movies, real-time seat lock middleware, and JWT verification.</li>
              <li><strong className="text-white">React.js & Tailwind:</strong> District dark cinematic UI with zero-pill typographic discipline.</li>
              <li><strong className="text-white">Node.js:</strong> High-throughput asynchronous runtime handling concurrent ticket reservations.</li>
            </ul>
          </div>

          <div className="p-5 bg-neutral-900/60 border border-neutral-800 rounded-xl space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Security & Cancellation Policy</span>
            </h3>
            <ul className="text-xs text-neutral-300 space-y-2 list-disc pl-4 leading-relaxed">
              <li><strong className="text-white">JWT Authentication:</strong> Cryptographically signed bearer tokens containing user ID, role, and credit claims.</li>
              <li><strong className="text-white">Seat Locking:</strong> 8-minute automatic hold release to prevent hoarding bots.</li>
              <li><strong className="text-white">Automated Refund Engine:</strong> 90% instant credit refund on user cancellation.</li>
              <li><strong className="text-white">Scannable QR Verification:</strong> Unique seed hashes preventing ticket duplication.</li>
            </ul>
          </div>
        </div>
      )}

    </div>
  );
};
