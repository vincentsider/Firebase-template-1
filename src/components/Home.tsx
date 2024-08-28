import React from "react";
import Board from "./Board";

const Home: React.FC = () => {
  return (
    <div className="home p-4">
      <h1 className="text-2xl font-bold mb-4 text-center text-red-500">Home Feed</h1>
      <Board />
    </div>
  );
};

export default Home;
