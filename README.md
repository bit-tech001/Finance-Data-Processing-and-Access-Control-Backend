🪙 WealthFlow | Institutional Financial LedgerWealthFlow is a high-performance, full-stack financial monitoring system designed for real-time asset tracking and categorical analytics. Built with the MERN Stack, it features a professional-grade dashboard with glassmorphism UI, secure role-based access, and automated data visualization.🚀 Key FeaturesIntelligence Dashboard: Real-time analytics with interactive Cash Flow (Bar), Asset Allocation (Pie), and Growth (Line) charts.Secure Ledger: High-density transaction history with "Verified UTC" status tracking.Role-Based Access (RBAC): Tiered permissions (Admin, Analyst, Viewer) for secure record management.Data Portability: Integrated native CSV export functionality for offline financial auditing.Premium UI/UX: A "Deep Space" theme featuring Tailwind CSS, Framer Motion animations, and Lucide iconography.🛠️ Tech StackLayerTechnologyFrontendReact.js, Tailwind CSS, Recharts, Lucide ReactBackendNode.js, Express.jsDatabaseMongoDB (Atlas)State/AuthAxios, JWT, LocalStorageStylingModern Glassmorphism & Premium Dark Mode📦 Installation & Setup1. Clone the RepositoryBashgit clone https://github.com/your-username/wealthflow-finance.git
cd wealthflow-finance
2. Backend ConfigurationNavigate to the /backend folder and install dependencies:Bashcd backend
npm install
Create a .env file in the backend root:PlaintextPORT=  enter_port
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_key
3. Frontend ConfigurationNavigate to the /frontend folder:Bashcd ../frontend
npm install
4. Run the ApplicationStart Backend:Bash# inside /backend
npm start
Start Frontend:Bash# inside /frontend
npm start
📊 API ArchitectureMethodEndpointDescriptionAccessGET/api/financeFetch all ledger entriesAll RolesPOST/api/financeCreate new transactionAdmin/AnalystDELETE/api/finance/:idRemove a recordAdmin Only🛡️ Security Best PracticesEnvironment Safety: .env files are strictly ignored via .gitignore to prevent credential leaks.Input Sanitization: All financial inputs are parsed and validated on the server-side.Admin Lockdown: Delete operations are guarded by both frontend UI logic and backend middleware.🤝 ContributingFork the ProjectCreate your Feature Branch (git checkout -b feature/AmazingFeature)Commit your Changes (git commit -m 'Add some AmazingFeature')Push to the Branch (git push origin feature/AmazingFeature)Open a Pull RequestDeveloped with 💙 by Bitu Pathak
