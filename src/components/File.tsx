import React from "react";
import { FaTrash, FaFile } from "react-icons/fa";
import { useDispatch } from "react-redux";

import { deleteNode } from "../store/slices/fileSystemSlice";

interface FileProps {
  name: string;
  id: string;
}

const File: React.FC<FileProps> = React.memo(({ name, id }) => {
  const dispatch = useDispatch();

  const handleDelete = () => {
    dispatch(deleteNode({ nodeId: id }));
  };

  return (
    <li className="p-1 w-full cursor-pointer text-base transition-all ease-in-out delay-150 pl-4 flex justify-between items-center group">
      <div className="flex items-center gap-2 flex-grow overflow-hidden">
        <FaFile className="text-gray-400" />
        <p
          className="overflow-hidden whitespace-nowrap text-ellipsis"
          title={name}
        >
          {name}
        </p>
      </div>

      <button
        onClick={handleDelete}
        className="bg-gray-900 absolute right-0 hidden group-hover:block transition-opacity"
        aria-label={`Delete ${name}`}
      >
        <FaTrash className="text-gray-400 hover:text-red-500" />
      </button>
    </li>
  );
});

export default File;
