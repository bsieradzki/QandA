import React from "react";
import styles from "./App.module.css";
import { Header } from "./Header";
import { HomePage } from "./HomePage";

function App() {
  return (
    <div className={styles.container}>
      <Header />
      <HomePage />
    </div>
  );
}

export default App;
