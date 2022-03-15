import Container from "../components/container";
import Header from "../components/header";
import Layout from "../components/layout";
import Head from "next/head";
import { BLOG_TITLE } from "../lib/constants";
import { getPostBySlug } from "../lib/api";
import PostBody from "../components/post-body";
import markdownToHtml from "../lib/markdownToHtml";

const ABOUT_CONTENT = `
# Hi there

I am Médédé Raymond KPATCHAA, a Software Engineer with over 9 years of experience solving problems and having fun.

Javascript experienced developer, I am in love with all the stuff related to the Web and Mobile.

I code with Javascript especially React and React Native, Java, PHP (sometimes, but when I do I like using Laravel).

Data Science enthusiast, I also like reading about Docker, Kubernetes and computer security.

`;

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
  const post = getPostBySlug(
    "about",
    ["title", "date", "slug", "author", "content", "ogImage", "coverImage"],
    true
  );
  const content = await markdownToHtml(post.content || "");

  return {
    props: {
      post: {
        ...post,
        content,
      },
    },
  };
}
