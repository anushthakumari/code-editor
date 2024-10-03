import FileType from './FileType';

interface FileSystemNode extends FileType {
    id: string;
    name: string;
    child?: FileSystemNode[];
}

export default FileSystemNode