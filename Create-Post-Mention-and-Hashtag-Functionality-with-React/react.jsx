/* eslint-disable */

function CreatePostTextArea() {
  const editorRef = useRef(null);
  useEffect(() => {
    editorRef.current.designMode = "on";
  }, []);

  /* Danger zone: It works! Don't touch! {start} */
  const prevNodeIndex = useRef(null);
  const prevNodeOffset = useRef(null);
  const hasChildNode = useRef(null);

  function theAlmightyMentionAndHashtagAlgorithm() {
    const selection = window.getSelection();

    prevNodeOffset.current = selection.anchorOffset;
    editorRef.current.childNodes.forEach((node, nodeIndex) => {
      if (node.isSameNode(selection.anchorNode)) {
        prevNodeIndex.current = nodeIndex;
        hasChildNode.current = false;

        if (node.textContent.match(/[@#]$/)) {
          prevNodeIndex.current = nodeIndex + 1;
          prevNodeOffset.current = 1;
          hasChildNode.current = true;
        }
      } else if (
        node.hasChildNodes() &&
        node.isSameNode(selection.anchorNode.parentNode)
      ) {
        prevNodeIndex.current = nodeIndex;
        hasChildNode.current = true;

        if (
          node.textContent.trimEnd().length < node.textContent.length ||
          node.textContent.match(/[\s.?!,;-]/)
        ) {
          prevNodeIndex.current = nodeIndex + 1;
          prevNodeOffset.current = 1;
          hasChildNode.current = false;
        }
      }
    });

    const editorText = editorRef.current.textContent;

    /*
		- @ or # must be preceeded by space
			(?<=\s)[@#]
		- match any character after it, except sentence separators and terminators
			[@#][^\s.?!,;-]*
		- color a match only when one or more characters follows @ or #
			matchStr.length > 1
			AND
		- a match must only contain one @ or # for it to be colored
			!matchStr.slice(1).match(/[@#]/)
		*/
    const formatted = editorText.replaceAll(
      /(?<=\s)[@#][^\s.?!,;-]*/g,
      (matchStr) =>
        `<span style='color: ${
          matchStr.length > 1 && !matchStr.slice(1).match(/[@#]/)
            ? "red"
            : "initial"
        };'>${matchStr}</span>`
    );
    editorRef.current.innerHTML = formatted;

    selection.collapse(
      hasChildNode.current
        ? editorRef.current.childNodes[prevNodeIndex.current].childNodes[0]
        : editorRef.current.childNodes[prevNodeIndex.current],
      prevNodeOffset.current
    );
    /* Danger zone: It works! Don't touch! {finish} */
  }

  return (
    <div className="create-post-textarea">
      <div
        ref={editorRef}
        contentEditable
        className="h-20 overflow-auto w-full text-sm break-words outline-none"
        onInput={theAlmightyMentionAndHashtagAlgorithm}
      />
    </div>
  );
}
