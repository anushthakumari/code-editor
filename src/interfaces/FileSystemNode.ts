import FileType from "./FileType";

interface FileSystemNode extends FileType {
	id: string;
	name: string;
	child?: FileSystemNode[];
	lang_code?: string;
}

export default FileSystemNode;
