import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import Header from '../components/header';


export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const { user } = req.session;
    const props = {};
    if (user) {
      props.user = req.session.user;
    }
    props.isLoggedIn = !!user;
    return { props };
  },
  sessionOptions
);

export default function Signup(props) {
  const router = useRouter();
  const [
    { username, password, "confirm-password": confirmPassword },
    setForm,
  ] = useState({
    username: "",
    password: "",
    "confirm-password": "",
  });
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({
      username,
      password,
      "confirm-password": confirmPassword,
      ...{ [e.target.name]: e.target.value.trim() },
    });
  }

  async function handleCreateAccount(e) {
    e.preventDefault();
    if (!username) 
      return setError("Must include username");
    if (!password.trim())
      return setError("Must include password");
    if (!confirmPassword.trim())
      return setError("Please confirm password");
    if (password !== confirmPassword) 
      return setError("Passwords must Match");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      if (res.status === 200) 
        return router.push("/search");
      const { error: message } = await res.json();
      const errorFirstPart = message.slice(0,6)
      if (errorFirstPart === "E11000") {
        return setError("Username already exists")
      } else {
        return setError(message);
      }
    } catch (err) {
      console.log(err);
    }
  }
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Booze Perooze App</title>
        <meta name="description" content="Booze Perooze app" />
        <link rel="icon" href="/logo.png" />
      </Head>

      <Header isLoggedIn={props.isLoggedIn} />

      <main className={styles.main}>
        <h1>
          Create an account below:
        </h1>

        <form
          className={[styles.card, styles.form].join(" ")}
          onSubmit={handleCreateAccount}
        >
          <label htmlFor="username">Username: </label>
          <input
            type="text"
            name="username"
            id="username"
            onChange={handleChange}
            value={username}
          />
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            name="password"
            id="password"
            onChange={handleChange}
            value={password}
          />
          <label htmlFor="confirm-password">Confirm Password: </label>
          <input
            type="password"
            name="confirm-password"
            id="confirm-password"
            onChange={handleChange}
            value={confirmPassword}
          />
          <button>Submit</button>
          {error && <p>{error}</p>}
        </form>
        <Link href="/login">
          <p>Login instead?</p>
        </Link>
      </main>
      <div className={styles.description}>
        <h2 className={styles.subtitle}>Why Sign Up?</h2>
          <p>
            While any user can search for drinks, Booze Perooze members can bookmark drinks to their favorites list.  When logged in, users can access their saved drinks quickly within the application on the Favorites page.
          </p>
          <img src="/drinksontable.jpg" alt="Assorted drinks on a table"/>
      </div>
      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Booze Perooze Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}
