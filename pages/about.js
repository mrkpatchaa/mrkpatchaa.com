import Container from "../components/container";
import Header from "../components/header";
import Layout from "../components/layout";
import Head from "next/head";
import { BLOG_TITLE } from "../lib/constants";
import { getPostBySlug } from "../lib/api";
import PostBody from "../components/post-body";
import markdownToHtml from "../lib/markdownToHtml";

export default function About({ post }) {
  return (
    <>
      <Layout>
        <Head>
          <title>
            {post.title} | {BLOG_TITLE}
          </title>
          {/* <meta property="og:image" content={post.ogImage.url} /> */}
        </Head>
        <Container>
          <Header />
          <PostBody content={post.content} />
        </Container>
      </Layout>
    </>
  );
}

export async function getStaticProps() {
  const post = await getPostBySlug("about", true);
  const content = await markdownToHtml(post.body || "");

  return {
    props: {
      post: {
        ...post,
        content,
      },
    },
  };
}
