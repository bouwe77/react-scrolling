import { useCallback, useEffect, useRef, useState } from "react";
import "./styles.css";

export default function App() {
  const [scrollTop, setScrollTop] = useState(0);
  const [goToPosition, setGoToPosition] = useState("top");
  const scrollerRef = useRef();
  const topRef = useRef();
  const bottomRef = useRef();
  const scrollPosition = useRef();

  // Scroll to either the top or bottom when the goToPosition state says so.
  useEffect(() => {
    if (goToPosition === "top") topRef.current.scrollIntoView();
    else bottomRef.current.scrollIntoView();

    const { scrollTop } = scrollerRef.current;
    setScrollTop(scrollTop);
  }, [goToPosition]);

  // Determine the user has scrolled to either the top, or bottom, or somewhere in between.
  const determineScrollPosition = useCallback(() => {
    if (!scrollerRef.current) return;
    const { scrollTop, clientHeight, scrollHeight } = scrollerRef.current;
    const offset = 10;

    console.log({ clientHeight, scrollHeight, scrollTop });
    console.log(
      `((${scrollTop} + ${clientHeight}) > (${scrollHeight} - ${offset})`
    );

    // Dus de vraag is: Verandert scrollTop uberhaupt wel naar iets anders dan 0
    // als je scrollIntoView doet op een (andere) ref?
    // =====> Uitproberen in CodeSandbox!!!

    if (scrollTop + clientHeight > scrollHeight - offset)
      scrollPosition.current = "bottom";
    else if (scrollTop < offset) scrollPosition.current = "top";
    else scrollPosition.current = "somewhereInBetween";
    console.log("scrollPosition", scrollPosition.current);
  }, []);

  // When scrolling, update the scrollTop state
  useEffect(() => {
    const ref = scrollerRef.current;
    if (!ref) return () => {};

    const handleScroll = () => {
      if (!scrollerRef.current) return;
      const { scrollHeight } = scrollerRef.current;
      determineScrollPosition();

      setScrollTop(scrollHeight);
    };

    if (scrollerRef.current) ref.addEventListener("scroll", handleScroll);

    return () => {
      ref.removeEventListener("scroll", handleScroll);
    };
  }, [determineScrollPosition]);

  return (
    <>
      <button
        onClick={() =>
          setGoToPosition((prev) => (prev === "top" ? "bottom" : "top"))
        }
      >
        Click here
      </button>
      <div id="container">
        <div id="scroller" ref={scrollerRef}>
          <div ref={topRef} />
          <p>
            Far out in the uncharted backwaters of the unfashionable end of the
            western spiral arm of the Galaxy lies a small unregarded yellow sun.
          </p>
          <p>
            Orbiting this at a distance of roughly ninety-two million miles is
            an utterly insignificant little blue green planet whose
            ape-descended life forms are so amazingly primitive that they still
            think digital watches are a pretty neat idea.
          </p>
          <p>
            However, someone once told me that time is a predator that stalks us
            all our lives, but I rather believe that time is a companion who
            goes with us on the journey, reminds us to cherish every moment,
            because they’ll never come again. What we leave behind is not is
            important as how we lived. After all, Number One, we’re only mortal.
          </p>
          <div ref={bottomRef} />
        </div>
      </div>

      <div id="output">scrollTop: {scrollTop}</div>
    </>
  );
}
