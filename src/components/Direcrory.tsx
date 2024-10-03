import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
	FaChevronRight,
	FaFileMedical,
	FaFolderPlus,
	FaTrash,
} from "react-icons/fa";

import File from "./File";

import { deleteNode } from "../store/slices/fileSystemSlice";

import FileSystemNode from "../interfaces/FileSystemNode";

interface DirProps {
	id: string;
	name: string;
	child: Array<FileSystemNode>;
	addNode: (data: { parentId: string; type: "file" | "dir" }) => void;
}

const Directory: React.FC<DirProps> = ({ id, name, child, addNode }) => {
	const [isOpen, setIsOpen] = useState(false);
	const dispatch = useDispatch();

	const toggleOpen = () => setIsOpen((prev) => !prev);

	const addFile = () => {
		setIsOpen(true);
		addNode({ type: "file", parentId: id });
	};

	const addFolder = () => {
		setIsOpen(true);
		addNode({ type: "dir", parentId: id });
	};

	const delFolder = () => {
		dispatch(deleteNode({ nodeId: id }));
	};

	return (
		<li className="relative max-w-full">
			{/* Directory button */}
			<div className="group p-0 flex justify-between items-center gap-2 w-full">
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

				<div className="bg-gray-900 absolute right-0 hidden group-hover:flex space-x-2">
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
				className={`border-l-1 border-indigo-500 transition-max-height duration-500 ease-in-out overflow-hidden ${
					isOpen ? "max-h-screen" : "max-h-0"
				} pl-3 ml-1`}>
				{child.map((e) =>
					e.type === "file" ? (
						<File id={e.id} key={e.id} name={e.name} />
					) : (
						<Directory
							key={e.id}
							id={e.id}
							name={e.name}
							child={e.child || []}
							addNode={addNode}
						/>
					)
				)}
			</ul>
		</li>
	);
};

export default Directory;
