import { useRouter } from "next/router";
import styles from "@/styles/Home.module.css";
import Index from "@/layout/UserLayout";
export default function Home() {
  const router = useRouter();

  return (
    <Index>
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome to LinkedIn Clone</h1>
      <button
        className={styles.button}
        onClick={() => router.push("/login")}
      >
        JOIN NOW
      </button>
    </div>
    </Index>
  );
}
