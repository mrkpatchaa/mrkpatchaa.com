import { useEffect } from "react";
import Prism from "prismjs";

require("prismjs/components/prism-javascript");
require("prismjs/components/prism-css");
require("prismjs/components/prism-jsx");
require("prismjs/components/prism-json");
require("prismjs/components/prism-bash");

import markdownStyles from "./markdown-styles.module.css";

export default function PostBody({ content }) {
  useEffect(() => {
    // console.log("body mounted");
    Prism.highlightAll();
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <div
        className={markdownStyles["markdown"]}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
