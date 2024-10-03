import React from "react";

import CreateModal from "./components/CreateModal";
import FileTree from "./components/FileTree";

const App: React.FC = () => {
	return (
		<div className="flex h-screen bg-blue-100">
			{/* Sidebar */}
			<div className="w-1/5 bg-gray-900 text-gray-300 p-2">
				<FileTree />
			</div>

			{/* Code Editor Area */}
			<div className="flex-1 bg-gray-800 text-white p-4">
				<pre className="mt-4 text-green-400 font-mono text-sm">
					{`const uuidv4 = require('uuid/v4');`}
				</pre>
			</div>
		</div>
	);
};

export default App;
