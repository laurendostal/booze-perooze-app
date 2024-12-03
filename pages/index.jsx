import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import styles from "../styles/Home.module.css";
import Header from "../components/header";
import useLogout from "../hooks/useLogout";

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user;
    const props = {};
    if (user) {
      props.user = req.session.user;
      props.isLoggedIn = true;
    } else {
      props.isLoggedIn = false;
    }
    return { props };
  },
  sessionOptions
);

export default function Home(props) {
  const router = useRouter();
  const logout = useLogout();
  return (
    <div className={styles.container}>
      <Head>
        <title>Booze Perooze App</title>
        <meta name="description" content="Booze Perooze app" />
        <link rel="icon" href="/logo.png" />
      </Head>

      <Header isLoggedIn={props.isLoggedIn} username={props?.user?.username} />

      <main className={styles.main}>
      <img src="/logo.png" alt="Logo"/>
        <h1 className={styles.title}>
          Welcome to Booze Perooze!
        </h1>
        <p>Login or Sign Up to start searching and saving drinks.</p>
      </main>

      <div className={styles.description}>
        <h2 className={styles.subtitle}>About</h2>
        <p>
          Booze Perooze is an application for searching and saving cocktail names, ingredients, and step-by-step recipes.  Booze Perooze provides a simple and effective search and bookmarking application that provides cocktail ingredient and recipes all in one environment.
        </p>
        <p>
          Users can bookmark cocktails to their favorites list, where they can access them quickly within the application.  Rather than sifting through information on search engines or within long webpages that include written background for a cocktail recipe, Booze Perooze provides a simple interface – without the distractions or extra information!
        </p>
        <p>
          Booze Perooze utilizes data from TheCocktailDB API to provide drink information that includes the drink's name, example photo, ingredients, instruction, and recommended glass type.
        </p>
        <img src="/cocktailsfromabove.jpg" alt="Cocktails on a counter"/>
      </div>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Booze Perooze powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}
