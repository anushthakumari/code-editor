import React, { useState } from "react";
import languages from "../contants/languages";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	onCreate: (data: {
		fileName: string;
		language: string;
		type: "file" | "dir";
		parentId: string;
	}) => void;
	type: "file" | "dir";
	parentId: string;
}

const CreateModal: React.FC<ModalProps> = ({
	isOpen,
	onClose,
	onCreate,
	type,
	parentId,
}) => {
	const [fileName, setFileName] = useState<string>("");
	const [language, setLanguage] = useState<string>("");

	if (!isOpen) return null;

	const handleCreate = () => {
		if (fileName) {
			onCreate({ fileName, language, type, parentId });
		} else {
			alert("Please fill out all fields.");
		}
	};

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
			<div className="bg-gray-700 p-6 rounded shadow-lg w-80">
				<h2 className="text-xl font-semibold mb-4">Create New </h2>
				<div className="mb-4">
					<label htmlFor="fileName" className="block mb-1">
						File Name:
					</label>
					<input
						type="text"
						id="fileName"
						value={fileName}
						onChange={(e) => setFileName(e.target.value)}
						required
						className="border text-black border-gray-300 p-2 rounded w-full"
					/>
				</div>
				{type === "file" ? (
					<div className="mb-4">
						<label htmlFor="language" className="block mb-1">
							Language:
						</label>
						<select
							id="language"
							value={language}
							onChange={(e) => setLanguage(e.target.value)}
							className="text-black border border-gray-300 p-2 rounded w-full"
							required>
							<option value="">Select a language</option>
							{languages.map((e) => (
								<option value={e.code}>{e.name}</option>
							))}
						</select>
					</div>
				) : null}
				<div className="flex justify-between">
					<button
						onClick={handleCreate}
						className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
						Create
					</button>
					<button
						onClick={onClose}
						className="bg-gray-300 text-gray-700 p-2 rounded hover:bg-gray-400">
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
};

export default CreateModal;
