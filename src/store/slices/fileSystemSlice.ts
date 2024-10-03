import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from "uuid";
import FileType from '../../interfaces/FileType';

import FileSystemNode from "../../interfaces/FileSystemNode";

interface AddFolderParams extends FileType {
    parentId: string;
    name: string;
    child?: FileSystemNode[];
}

interface AddFileParams extends FileType {
    parentId: string;
    name: string;
    content?: string;
}

interface DeleteNodeParams {
    nodeId: string;
}

const initialState: FileSystemNode[] = [{
    id: uuidv4(),
    type: "dir",
    name: "utils",
    child: [],
}];

export const fileSystemSlice = createSlice({
    name: 'filesystem',
    initialState,
    reducers: {

        addFolderNode: (state, action: PayloadAction<AddFolderParams>) => {
            const parentId = action.payload.parentId;
            const name = action.payload.name;

            const parentNode = getNodeById(state, parentId);

            if (parentNode) {
                const nameExists = parentNode.child?.some(node => node.name === name && node.type === "dir");
                if (nameExists) {
                    alert(`A file or folder with the name "${name}" already exists in this directory.`);
                    return;
                }

                const newFolder: FileSystemNode = {
                    id: uuidv4(),
                    type: 'dir',
                    name: name,
                    child: []
                };
                parentNode.child?.push(newFolder);
            }
        },

        addFileNode: (state, action: PayloadAction<AddFileParams>) => {
            const parentId = action.payload.parentId;
            const name = action.payload.name;

            const parentNode = getNodeById(state, parentId);

            if (parentNode) {
                const nameExists = parentNode.child?.some(node => node.name === name);
                if (nameExists) {
                    alert(`A file or folder with the name "${name}" already exists in this directory.`);
                    return;
                }

                const newFile: FileSystemNode = {
                    id: uuidv4(),
                    type: 'file',
                    name: name,
                    child: undefined,
                };
                parentNode.child?.push(newFile);
            }
        },

        deleteNode: (state, action: PayloadAction<DeleteNodeParams>) => {
            const nodeId = action.payload.nodeId;

            function removeNode(nodes: FileSystemNode[]): boolean {
                for (let i = 0; i < nodes.length; i++) {
                    if (nodes[i].id === nodeId) {
                        nodes.splice(i, 1);
                        return true;
                    }
                    if (nodes[i].child) {
                        const isRemoved = removeNode(nodes[i].child!);
                        if (isRemoved) return true;
                    }
                }
                return false;
            }

            removeNode(state);
        }
    },
});


function getNodeById(nodes: FileSystemNode[], id: string): FileSystemNode | undefined {
    for (const node of nodes) {
        if (node.id === id) {
            return node;
        }
        if (node.child) {
            const foundNode = getNodeById(node.child, id);
            if (foundNode) {
                return foundNode;
            }
        }
    }
    return undefined;
}

export const { addFolderNode, addFileNode, deleteNode } = fileSystemSlice.actions;
export default fileSystemSlice.reducer;
