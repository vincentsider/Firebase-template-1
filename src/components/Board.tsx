import React, { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase";
import List from "./List";

interface Board {
  id: string;
  title: string;
}

const Board: React.FC = () => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [newBoardTitle, setNewBoardTitle] = useState("");

  useEffect(() => {
    const boardsQuery = query(collection(db, "boards"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(boardsQuery, (snapshot) => {
      const newBoards = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Board[];
      setBoards(newBoards);
    });

    return () => unsubscribe();
  }, []);

  const addBoard = async () => {
    if (newBoardTitle.trim() === "") return;
    await addDoc(collection(db, "boards"), {
      title: newBoardTitle,
      createdAt: Timestamp.now(),
    });
    setNewBoardTitle("");
  };

  return (
    <div className="board p-4">
      <h1 className="text-2xl font-bold mb-4 text-center text-red-500">Boards</h1>
      <div className="max-w-2xl mx-auto">
        <input
          type="text"
          value={newBoardTitle}
          onChange={(e) => setNewBoardTitle(e.target.value)}
          placeholder="New Board Title"
          className="input mb-4"
        />
        <button onClick={addBoard} className="btn mb-4">Add Board</button>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {boards.map((board) => (
            <div key={board.id} className="board bg-white shadow-md rounded-lg p-4 mb-4">
              <h2 className="text-xl font-bold">{board.title}</h2>
              <List boardId={board.id} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Board;