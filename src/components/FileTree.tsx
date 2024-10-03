import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";

import File from "./File";
import Directory from "./Direcrory";
import CreateModal from "./CreateModal";

import { addFileNode, addFolderNode } from "../store/slices/fileSystemSlice";
import languages from "../contants/languages";

import FileType from "../interfaces/FileType";
import FileSystemNode from "../interfaces/FileSystemNode";

interface ModalState extends FileType {
	isOpen: boolean;
	parentId: string;
}

const FileTree = () => {
	const dispatch = useDispatch();

	const [modalState, setmodalState] = useState<ModalState>({
		isOpen: false,
		type: "dir",
		parentId: "",
	});

	const dirs = useSelector((state) => state.fileTree);

	const openCreateModal = (data: { parentId: string } & FileType) => {
		setmodalState({
			isOpen: true,
			type: data.type,
			parentId: data.parentId,
		});
	};

	const handleClose = () => {
		setmodalState({
			isOpen: false,
			type: "dir",
			parentId: "",
		});
	};

	const handleCreate = (data: {
		fileName: string;
		language: string;
		type: "file" | "dir";
		parentId: string;
	}) => {
		if (data.type === "file") {
			const language_data = languages.find((v) => v.code === data.language);

			const ext = language_data?.ext;

			const newFilename = data.fileName.trim() + ext;

			dispatch(
				addFileNode({
					parentId: data.parentId,
					name: newFilename,
					type: "file",
					lang_code: data.language,
				})
			);
		} else {
			dispatch(
				addFolderNode({
					parentId: data.parentId,
					name: data.fileName,
					child: [],
					type: "dir",
				})
			);
		}

		handleClose();
	};

	return (
		<div>
			<ul className="space-y-2">
				{dirs.map((e: FileSystemNode) =>
					e.type === "dir" ? (
						<Directory
							key={e.id}
							id={e.id}
							name={e.name}
							child={e.child || []}
							addNode={openCreateModal}
						/>
					) : (
						<File key={e.id} id={e.id} name={e.name} />
					)
				)}
			</ul>
			<CreateModal
				type={modalState.type}
				isOpen={modalState.isOpen}
				onClose={handleClose}
				onCreate={handleCreate}
				parentId={modalState.parentId}
			/>
		</div>
	);
};

export default FileTree;
