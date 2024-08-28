import React, { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase";
import Card from "./Card";

interface List {
  id: string;
  title: string;
  boardId: string;
}

const List: React.FC<{ boardId: string }> = ({ boardId }) => {
  const [lists, setLists] = useState<List[]>([]);
  const [newListTitle, setNewListTitle] = useState("");

  useEffect(() => {
    const listsQuery = query(collection(db, "boards", boardId, "lists"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(listsQuery, (snapshot) => {
      const newLists = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as List[];
      setLists(newLists);
    });

    return () => unsubscribe();
  }, [boardId]);

  const addList = async () => {
    if (newListTitle.trim() === "") return;
    await addDoc(collection(db, "boards", boardId, "lists"), {
      title: newListTitle,
      createdAt: Timestamp.now(),
    });
    setNewListTitle("");
  };

  return (
    <div className="list p-4">
      <input
        type="text"
        value={newListTitle}
        onChange={(e) => setNewListTitle(e.target.value)}
        placeholder="New List Title"
        className="input mb-4"
      />
      <button onClick={addList} className="btn mb-4">Add List</button>
      <div className="space-y-4">
        {lists.map((list) => (
          <div key={list.id} className="list bg-white shadow-md rounded-lg p-4 mb-4">
            <h3 className="text-lg font-bold">{list.title}</h3>
            <Card boardId={boardId} listId={list.id} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;