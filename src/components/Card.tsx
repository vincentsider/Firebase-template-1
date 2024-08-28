import React, { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase";

interface Card {
  id: string;
  text: string;
  listId: string;
  boardId: string;
}

const Card: React.FC<{ boardId: string; listId: string }> = ({ boardId, listId }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [newCardText, setNewCardText] = useState("");

  useEffect(() => {
    const cardsQuery = query(collection(db, "boards", boardId, "lists", listId, "cards"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(cardsQuery, (snapshot) => {
      const newCards = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Card[];
      setCards(newCards);
    });

    return () => unsubscribe();
  }, [boardId, listId]);

  const addCard = async () => {
    if (newCardText.trim() === "") return;
    await addDoc(collection(db, "boards", boardId, "lists", listId, "cards"), {
      text: newCardText,
      createdAt: Timestamp.now(),
    });
    setNewCardText("");
  };

  return (
    <div className="card p-4">
      <input
        type="text"
        value={newCardText}
        onChange={(e) => setNewCardText(e.target.value)}
        placeholder="New Card Text"
        className="input mb-4"
      />
      <button onClick={addCard} className="btn mb-4">Add Card</button>
      <div className="space-y-4">
        {cards.map((card) => (
          <div key={card.id} className="card bg-white shadow-md rounded-lg p-4 mb-4">
            <p className="text-gray-800">{card.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Card;