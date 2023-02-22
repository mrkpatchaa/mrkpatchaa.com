import { SOCIAL } from "../lib/constants";
import Link from "next/link";
const {
  siGithub,
  siTwitter,
  siRss,
  siLinkedin,
} = require("simple-icons/icons");
import Image from "next/image";

export default function Header() {
  return (
    <div className="flex flex-row flex-nowrap justify-between mb-20 mt-8 items-center">
      <div className="flex flex-row flex-nowrap justify-end items-center">
        <h2 className="mr-4 leading-none">
          <Link
            href="/"
            className="inline-block icon w-16 h-8 relative"
            passHref
          >
            <Image src={"/assets/mrk.svg"} alt={"Logo"} layout="fill" />
          </Link>
        </h2>
        <Link href="/about" className="text-neutral-900">
          About
        </Link>
      </div>
      <nav className="flex flex-row flex-nowrap justify-end">
        {/* <a href="/rss.xml" target="_blank" rel="noopener noreferrer">
                          <span
                            className="inline-block icon w-12 h-8"
                            style={{ color: '#263238' }}
                            dangerouslySetInnerHTML={{ __html: siRss.svg }}
                          />
                        </a> */}
        <a
          href={`https://github.com/${SOCIAL.github}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span
            className="inline-block icon w-12 h-8"
            style={{ color: "#263238" }}
            dangerouslySetInnerHTML={{ __html: siGithub.svg }}
          />
        </a>
        <a
          href={`https://twitter.com/${SOCIAL.twitter}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span
            className="inline-block icon w-12 h-8"
            style={{ color: "#55acee" }}
            dangerouslySetInnerHTML={{ __html: siTwitter.svg }}
          />
        </a>
        <a
          href={`https://linkedin.com/in/${SOCIAL.linkedin}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span
            className="inline-block icon w-12 h-8"
            style={{ color: "#0077B5" }}
            dangerouslySetInnerHTML={{ __html: siLinkedin.svg }}
          />
        </a>
      </nav>
    </div>
  );
}
