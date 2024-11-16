// components/TopBar.tsx
import React from "react";
import { Link } from "@aws-amplify/ui-react";
import styles from "./TopBar.module.css";

const TopBar = () => {
  return (
    <div className={styles.topBar}>
      <div className={styles.logo}>
        <Link href="/">
          <a>MyApp</a>
        </Link>
      </div>
      <nav className={styles.navLinks}>
        <Link href="/submit">
          <a>Submit</a>
        </Link>
        <Link href="/dashboard">
          <a>Dashboard</a>
        </Link>
      </nav>
    </div>
  );
};

export default TopBar;
