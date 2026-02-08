import Head from "next/head";
import { BACKEND_URL } from "@/config";

export default function PostPage({ post }) {
  if (!post) {
    return <h2 style={{ padding: 40 }}>Post not found</h2>;
  }

  const imageUrl =
    post.media?.[0]?.url
      ? `${BACKEND_URL}${post.media[0].url}`
      : "";

  const shareUrl = `http://localhost:3000/post/${post._id}`;

  return (
    <>
      <Head>
        <meta property="og:title" content={post.body || "Post"} />
        <meta property="og:description" content="Check out this post" />
        {imageUrl && <meta property="og:image" content={imageUrl} />}
        <meta property="og:url" content={shareUrl} />
        <meta property="og:type" content="article" />
      </Head>

      <div style={{ padding: 40 }}>
        <h2>{post.userId?.Name}</h2>
        <p>{post.body}</p>

        {imageUrl && (
          <img
            src={imageUrl}
            alt="post"
            style={{ maxWidth: "400px", borderRadius: "10px" }}
          />
        )}
      </div>
    </>
  );
}
export async function getServerSideProps(context) {
  const { id } = context.params;

  try {
    const res = await fetch(
      `http://localhost:8080/post/getSinglePost/${id}`
    );
    const data = await res.json();

    return {
      props: {
        post: data.post || null,
      },
    };
  } catch (err) {
    return {
      props: {
        post: null,
      },
    };
  }
}
