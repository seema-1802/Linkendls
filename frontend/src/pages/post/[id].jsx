import Head from "next/head";
import { BACKEND_URL } from "@/config";

export default function PostPage({ post }) {
  if (!post) {
    return <h2 style={{ padding: 40 }}>Post not found</h2>;
  }
const imageUrl = post.media?.[0]?.url
  ? post.media[0].url.startsWith("http")
    ? post.media[0].url
    : `${BACKEND_URL}${post.media[0].url}`
  : "";
const shareUrl = `https://linkendls.vercel.app/post/${post._id}`;
  return (
    <>
      <Head>
        <meta property="og:title" content={post.body || "Post"} />
        <meta property="og:description" content="Check out this post" />
        {imageUrl && <meta property="og:image" content={imageUrl} />}
        <meta property="og:url" content={shareUrl} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={post.body || "Post"} />
<meta name="twitter:description" content="Check out this post" />
<meta name="twitter:image" content={imageUrl} />
      </Head>

      <div
  style={{
    maxWidth: "700px",
    margin: "40px auto",
    background: "#fff",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  }}
>
  {imageUrl && (
    <img
      src={imageUrl}
      alt="post"
      style={{
        width: "100%",
        maxHeight: "500px",
        objectFit: "cover",
      }}
    />
  )}

  <div style={{ padding: "20px" }}>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "15px",
      }}
    >
      <img
        src={
          post.userId?.ProfileImage ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            post.userId?.Name || "User"
          )}`
        }
        alt="profile"
        style={{
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          objectFit: "cover",
        }}
      />

      <div>
        <h3 style={{ margin: 0 }}>
          {post.userId?.Name}
        </h3>

        <small style={{ color: "#666" }}>
          {new Date(post.createdAt).toLocaleString()}
        </small>
      </div>
    </div>

    <p
      style={{
        fontSize: "16px",
        lineHeight: "1.6",
      }}
    >
      {post.body}
    </p>
  </div>
</div>
    </>
  );
}
export async function getServerSideProps(context) {
  const { id } = context.params;

  try {
     const res = await fetch(
      `${BACKEND_URL}/post/getSinglePost/${id}`
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
