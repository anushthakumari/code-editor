import React, { useState } from "react";
import {
	FaChevronRight,
	FaFileMedical,
	FaFolderPlus,
	FaTrash,
} from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";

interface FileProps {
	name: string;
}

interface DirProps {
	id: string;
	name: string;
	child: Array<FileSystemNode>;
}

type FileSystemNode = {
	id: string;
	type: "file" | "dir";
	name: string;
	child?: FileSystemNode[];
};

const File: React.FC<
	FileProps & {
		deleteFile: (id: string) => void;
		id: string;
	}
> = React.memo(({ name, deleteFile, id }) => {
	return (
		<li className="p-1 w-full cursor-pointer text-base transition-all ease-in-out delay-150 pl-4 flex justify-between items-center">
			<div className="flex-grow overflow-hidden">
				<p
					className="overflow-hidden whitespace-nowrap text-ellipsis"
					title={name}>
					{name}
				</p>
			</div>
			<button
				onClick={() => deleteFile(id)}
				className="p-1 ml-2"
				aria-label={`Delete ${name}`}>
				<FaTrash className="text-gray-400 hover:text-red-500" />
			</button>
		</li>
	);
});
const Directory: React.FC<
	DirProps & {
		onAddFile: (id: string) => void;
		onAddFolder: (id: string) => void;
		deleteFile: (id: string) => void;
		deleteFolder: (id: string) => void;
	}
> = ({ id, name, child, onAddFile, onAddFolder, deleteFile, deleteFolder }) => {
	const [isOpen, setIsOpen] = useState(false);

	const toggleOpen = () => setIsOpen((prev) => !prev);

	const addFile = () => {
		setIsOpen(true);
		onAddFile(id);
	};

	const addFolder = () => {
		setIsOpen(true);
		onAddFolder(id);
	};

	const delFolder = () => {
		deleteFolder(id);
	};

	return (
		<li className="relative max-w-full">
			{/* Directory button */}
			<div className="p-0 flex justify-between items-center gap-2 w-full">
				<div
					onClick={toggleOpen}
					className="overflow-hidden whitespace-nowrap text-ellipsis cursor-pointer relative flex gap-2 items-center flex-grow">
					<FaChevronRight
						className={`transition-transform transform ${
							isOpen ? "rotate-90" : ""
						}`}
					/>
					<p
						className="overflow-hidden whitespace-nowrap text-ellipsis"
						title={name}>
						{name}
					</p>
				</div>

				<div className="flex space-x-2">
					<button
						onClick={addFile}
						className="p-1"
						aria-label={`Add file to ${name}`}>
						<FaFileMedical className="text-gray-400 hover:text-gray-200" />
					</button>
					<button
						onClick={addFolder}
						className="p-1"
						aria-label={`Add folder to ${name}`}>
						<FaFolderPlus className="text-gray-400 hover:text-gray-200" />
					</button>
					<button
						onClick={delFolder}
						className="p-1"
						aria-label={`Delete ${name}`}>
						<FaTrash className="text-gray-400 hover:text-red-500" />
					</button>
				</div>
			</div>

			{/* Files/Folders */}
			<ul
				className={`border-l-2 border-indigo-500 transition-max-height duration-500 ease-in-out overflow-hidden ${
					isOpen ? "max-h-screen" : "max-h-0"
				} pl-3 ml-1`}>
				{child.map((e) =>
					e.type === "file" ? (
						<File id={e.id} key={e.id} name={e.name} deleteFile={deleteFile} />
					) : (
						<Directory
							key={e.id}
							id={e.id}
							name={e.name}
							child={e.child || []}
							onAddFile={onAddFile}
							onAddFolder={onAddFolder}
							deleteFile={deleteFile}
							deleteFolder={deleteFolder}
						/>
					)
				)}
			</ul>
		</li>
	);
};

const App: React.FC = () => {
	const [dirs, setDirs] = useState<FileSystemNode[]>([
		{
			id: uuidv4(),
			type: "dir",
			name: "utils",
			child: [],
		},
	]);

	const addFile = (parentId: string) => {
		setDirs((prevDirs) => {
			const updateDirWithNewFile = (
				nodes: FileSystemNode[]
			): FileSystemNode[] => {
				return nodes.map((node) => {
					if (node.id === parentId && node.type === "dir") {
						// Add the new file
						return {
							...node,
							child: [
								...(node.child || []),
								{
									id: uuidv4(),
									type: "file",
									name: `new-file-${(node.child || []).length}.js`,
								},
							],
						};
					}
					// update child if its a dir
					if (node.type === "dir" && node.child) {
						return {
							...node,
							child: updateDirWithNewFile(node.child),
						};
					}
					return node;
				});
			};

			return updateDirWithNewFile(prevDirs);
		});
	};

	const addFolder = (parentId: string) => {
		setDirs((prevDirs) => {
			const updateDirWithNewFolder = (
				nodes: FileSystemNode[]
			): FileSystemNode[] => {
				return nodes.map((node) => {
					if (node.id === parentId && node.type === "dir") {
						return {
							...node,
							child: [
								...(node.child || []),
								{
									id: uuidv4(),
									type: "dir",
									name: `new-folder-${(node.child || []).length}`,
									child: [],
								},
							],
						};
					}
					if (node.type === "dir" && node.child) {
						return {
							...node,
							child: updateDirWithNewFolder(node.child),
						};
					}
					return node;
				});
			};

			return updateDirWithNewFolder(prevDirs);
		});
	};

	const deleteFile = (fileId: string) => {
		setDirs((prevDirs) => {
			const removeFileById = (nodes: FileSystemNode[]): FileSystemNode[] => {
				return nodes.reduce((acc, node) => {
					if (node.type === "file" && node.id === fileId) {
						//skipping or deleting
						return acc;
					}
					if (node.type === "dir" && node.child) {
						return [
							...acc,
							{
								...node,
								child: removeFileById(node.child),
							},
						];
					}
					return [...acc, node];
				}, [] as FileSystemNode[]);
			};

			return removeFileById(prevDirs);
		});
	};

	const deleteFolder = (folderId: string) => {
		setDirs((prevDirs) => {
			const removeFolder = (nodes: FileSystemNode[]): FileSystemNode[] => {
				return nodes.reduce((acc, node) => {
					if (node.type === "dir" && node.id === folderId) {
						//skipping or deleting
						return acc;
					}
					if (node.type === "dir" && node.child) {
						return [
							...acc,
							{
								...node,
								child: removeFolder(node.child),
							},
						];
					}
					return [...acc, node];
				}, [] as FileSystemNode[]);
			};

			return removeFolder(prevDirs);
		});
	};

	return (
		<div className="flex h-screen bg-blue-100">
			{/* Sidebar */}
			<div className="w-1/5 bg-gray-900 text-gray-300 p-2">
				<ul className="space-y-2">
					{dirs.map((e) =>
						e.type === "dir" ? (
							<Directory
								key={e.id}
								id={e.id}
								name={e.name}
								child={e.child || []}
								onAddFile={addFile}
								onAddFolder={addFolder}
								deleteFile={deleteFile}
								deleteFolder={deleteFolder}
							/>
						) : (
							<File
								key={e.id}
								id={e.id}
								name={e.name}
								deleteFile={deleteFile}
							/>
						)
					)}
				</ul>
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
