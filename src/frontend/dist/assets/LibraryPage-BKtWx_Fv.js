import { r as reactExports, j as jsxRuntimeExports, c as cn, S as Skeleton } from "./index-D39pcanF.js";
import { R as Root, C as Content, b as Close, X, a as Title, P as Portal, O as Overlay, u as useIsCallerAdmin, i as useLectures, l as useNotes, h as ProtectedRoute, L as Layout, I as Input, F as FileText, B as Badge } from "./useNotes-D2HQH_X2.js";
import { c as createLucideIcon, a as BookOpen } from "./useAuth-DmwR_m9H.js";
import { M as MotionConfigContext, i as isHTMLElement, u as useConstant, P as PresenceContext, a as usePresence, b as useIsomorphicLayoutEffect, L as LayoutGroupContext, m as motion } from "./proxy-coyDPL9v.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [["polygon", { points: "6 3 20 12 6 21 6 3", key: "1oa8hb" }]];
const Play = createLucideIcon("play", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
];
const Search = createLucideIcon("search", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5",
      key: "ftymec"
    }
  ],
  ["rect", { x: "2", y: "6", width: "14", height: "12", rx: "2", key: "158x01" }]
];
const Video = createLucideIcon("video", __iconNode);
function setRef(ref, value) {
  if (typeof ref === "function") {
    return ref(value);
  } else if (ref !== null && ref !== void 0) {
    ref.current = value;
  }
}
function composeRefs(...refs) {
  return (node) => {
    let hasCleanup = false;
    const cleanups = refs.map((ref) => {
      const cleanup = setRef(ref, node);
      if (!hasCleanup && typeof cleanup === "function") {
        hasCleanup = true;
      }
      return cleanup;
    });
    if (hasCleanup) {
      return () => {
        for (let i = 0; i < cleanups.length; i++) {
          const cleanup = cleanups[i];
          if (typeof cleanup === "function") {
            cleanup();
          } else {
            setRef(refs[i], null);
          }
        }
      };
    }
  };
}
function useComposedRefs(...refs) {
  return reactExports.useCallback(composeRefs(...refs), refs);
}
class PopChildMeasure extends reactExports.Component {
  getSnapshotBeforeUpdate(prevProps) {
    const element = this.props.childRef.current;
    if (isHTMLElement(element) && prevProps.isPresent && !this.props.isPresent && this.props.pop !== false) {
      const parent = element.offsetParent;
      const parentWidth = isHTMLElement(parent) ? parent.offsetWidth || 0 : 0;
      const parentHeight = isHTMLElement(parent) ? parent.offsetHeight || 0 : 0;
      const computedStyle = getComputedStyle(element);
      const size = this.props.sizeRef.current;
      size.height = parseFloat(computedStyle.height);
      size.width = parseFloat(computedStyle.width);
      size.top = element.offsetTop;
      size.left = element.offsetLeft;
      size.right = parentWidth - size.width - size.left;
      size.bottom = parentHeight - size.height - size.top;
    }
    return null;
  }
  /**
   * Required with getSnapshotBeforeUpdate to stop React complaining.
   */
  componentDidUpdate() {
  }
  render() {
    return this.props.children;
  }
}
function PopChild({ children, isPresent, anchorX, anchorY, root, pop }) {
  var _a;
  const id = reactExports.useId();
  const ref = reactExports.useRef(null);
  const size = reactExports.useRef({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  });
  const { nonce } = reactExports.useContext(MotionConfigContext);
  const childRef = ((_a = children.props) == null ? void 0 : _a.ref) ?? (children == null ? void 0 : children.ref);
  const composedRef = useComposedRefs(ref, childRef);
  reactExports.useInsertionEffect(() => {
    const { width, height, top, left, right, bottom } = size.current;
    if (isPresent || pop === false || !ref.current || !width || !height)
      return;
    const x = anchorX === "left" ? `left: ${left}` : `right: ${right}`;
    const y = anchorY === "bottom" ? `bottom: ${bottom}` : `top: ${top}`;
    ref.current.dataset.motionPopId = id;
    const style = document.createElement("style");
    if (nonce)
      style.nonce = nonce;
    const parent = root ?? document.head;
    parent.appendChild(style);
    if (style.sheet) {
      style.sheet.insertRule(`
          [data-motion-pop-id="${id}"] {
            position: absolute !important;
            width: ${width}px !important;
            height: ${height}px !important;
            ${x}px !important;
            ${y}px !important;
          }
        `);
    }
    return () => {
      var _a2;
      (_a2 = ref.current) == null ? void 0 : _a2.removeAttribute("data-motion-pop-id");
      if (parent.contains(style)) {
        parent.removeChild(style);
      }
    };
  }, [isPresent]);
  return jsxRuntimeExports.jsx(PopChildMeasure, { isPresent, childRef: ref, sizeRef: size, pop, children: pop === false ? children : reactExports.cloneElement(children, { ref: composedRef }) });
}
const PresenceChild = ({ children, initial, isPresent, onExitComplete, custom, presenceAffectsLayout, mode, anchorX, anchorY, root }) => {
  const presenceChildren = useConstant(newChildrenMap);
  const id = reactExports.useId();
  let isReusedContext = true;
  let context = reactExports.useMemo(() => {
    isReusedContext = false;
    return {
      id,
      initial,
      isPresent,
      custom,
      onExitComplete: (childId) => {
        presenceChildren.set(childId, true);
        for (const isComplete of presenceChildren.values()) {
          if (!isComplete)
            return;
        }
        onExitComplete && onExitComplete();
      },
      register: (childId) => {
        presenceChildren.set(childId, false);
        return () => presenceChildren.delete(childId);
      }
    };
  }, [isPresent, presenceChildren, onExitComplete]);
  if (presenceAffectsLayout && isReusedContext) {
    context = { ...context };
  }
  reactExports.useMemo(() => {
    presenceChildren.forEach((_, key) => presenceChildren.set(key, false));
  }, [isPresent]);
  reactExports.useEffect(() => {
    !isPresent && !presenceChildren.size && onExitComplete && onExitComplete();
  }, [isPresent]);
  children = jsxRuntimeExports.jsx(PopChild, { pop: mode === "popLayout", isPresent, anchorX, anchorY, root, children });
  return jsxRuntimeExports.jsx(PresenceContext.Provider, { value: context, children });
};
function newChildrenMap() {
  return /* @__PURE__ */ new Map();
}
const getChildKey = (child) => child.key || "";
function onlyElements(children) {
  const filtered = [];
  reactExports.Children.forEach(children, (child) => {
    if (reactExports.isValidElement(child))
      filtered.push(child);
  });
  return filtered;
}
const AnimatePresence = ({ children, custom, initial = true, onExitComplete, presenceAffectsLayout = true, mode = "sync", propagate = false, anchorX = "left", anchorY = "top", root }) => {
  const [isParentPresent, safeToRemove] = usePresence(propagate);
  const presentChildren = reactExports.useMemo(() => onlyElements(children), [children]);
  const presentKeys = propagate && !isParentPresent ? [] : presentChildren.map(getChildKey);
  const isInitialRender = reactExports.useRef(true);
  const pendingPresentChildren = reactExports.useRef(presentChildren);
  const exitComplete = useConstant(() => /* @__PURE__ */ new Map());
  const exitingComponents = reactExports.useRef(/* @__PURE__ */ new Set());
  const [diffedChildren, setDiffedChildren] = reactExports.useState(presentChildren);
  const [renderedChildren, setRenderedChildren] = reactExports.useState(presentChildren);
  useIsomorphicLayoutEffect(() => {
    isInitialRender.current = false;
    pendingPresentChildren.current = presentChildren;
    for (let i = 0; i < renderedChildren.length; i++) {
      const key = getChildKey(renderedChildren[i]);
      if (!presentKeys.includes(key)) {
        if (exitComplete.get(key) !== true) {
          exitComplete.set(key, false);
        }
      } else {
        exitComplete.delete(key);
        exitingComponents.current.delete(key);
      }
    }
  }, [renderedChildren, presentKeys.length, presentKeys.join("-")]);
  const exitingChildren = [];
  if (presentChildren !== diffedChildren) {
    let nextChildren = [...presentChildren];
    for (let i = 0; i < renderedChildren.length; i++) {
      const child = renderedChildren[i];
      const key = getChildKey(child);
      if (!presentKeys.includes(key)) {
        nextChildren.splice(i, 0, child);
        exitingChildren.push(child);
      }
    }
    if (mode === "wait" && exitingChildren.length) {
      nextChildren = exitingChildren;
    }
    setRenderedChildren(onlyElements(nextChildren));
    setDiffedChildren(presentChildren);
    return null;
  }
  const { forceRender } = reactExports.useContext(LayoutGroupContext);
  return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: renderedChildren.map((child) => {
    const key = getChildKey(child);
    const isPresent = propagate && !isParentPresent ? false : presentChildren === renderedChildren || presentKeys.includes(key);
    const onExit = () => {
      if (exitingComponents.current.has(key)) {
        return;
      }
      if (exitComplete.has(key)) {
        exitingComponents.current.add(key);
        exitComplete.set(key, true);
      } else {
        return;
      }
      let isEveryExitComplete = true;
      exitComplete.forEach((isExitComplete) => {
        if (!isExitComplete)
          isEveryExitComplete = false;
      });
      if (isEveryExitComplete) {
        forceRender == null ? void 0 : forceRender();
        setRenderedChildren(pendingPresentChildren.current);
        propagate && (safeToRemove == null ? void 0 : safeToRemove());
        onExitComplete && onExitComplete();
      }
    };
    return jsxRuntimeExports.jsx(PresenceChild, { isPresent, initial: !isInitialRender.current || initial ? void 0 : false, custom, presenceAffectsLayout, mode, root, onExitComplete: isPresent ? void 0 : onExit, anchorX, anchorY, children: child }, key);
  }) });
};
function Dialog({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root, { "data-slot": "dialog", ...props });
}
function DialogPortal({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { "data-slot": "dialog-portal", ...props });
}
function DialogOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Overlay,
    {
      "data-slot": "dialog-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogPortal, { "data-slot": "dialog-portal", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogOverlay, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Content,
      {
        "data-slot": "dialog-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        ),
        ...props,
        children: [
          children,
          showCloseButton && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Close,
            {
              "data-slot": "dialog-close",
              className: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(X, {}),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Close" })
              ]
            }
          )
        ]
      }
    )
  ] });
}
function DialogHeader({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "dialog-header",
      className: cn("flex flex-col gap-2 text-center sm:text-left", className),
      ...props
    }
  );
}
function DialogTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Title,
    {
      "data-slot": "dialog-title",
      className: cn("text-lg leading-none font-semibold", className),
      ...props
    }
  );
}
function useDebounce(value, delay) {
  const [debounced, setDebounced] = reactExports.useState(value);
  reactExports.useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}
function formatRelativeTime(ts) {
  const ms = Number(ts / 1000000n);
  const diff = Date.now() - ms;
  const seconds = Math.floor(diff / 1e3);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days !== 1 ? "s" : ""} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months !== 1 ? "s" : ""} ago`;
  return `${Math.floor(months / 12)} year${Math.floor(months / 12) !== 1 ? "s" : ""} ago`;
}
function getMediaUrl(item) {
  if (item.type === "lecture") {
    return item.raw.videoFile.getDirectURL();
  }
  return item.raw.file.getDirectURL();
}
function ContentCardSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-interactive animate-pulse", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-36 w-full rounded-md mb-3" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-16 rounded-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-20 rounded-full" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-4/5 mb-2" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full mb-1" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/5" })
  ] });
}
function ContentCard({ item, onOpen }) {
  const isLecture = item.type === "lecture";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, scale: 0.97 },
      transition: { duration: 0.22 },
      layout: true,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          "data-ocid": "content-card",
          className: "card-interactive w-full text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          onClick: () => onOpen(item),
          "aria-label": `Open ${item.type}: ${item.title}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-36 w-full rounded-md mb-3 overflow-hidden bg-muted/60 flex items-center justify-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `absolute inset-0 opacity-20 ${isLecture ? "bg-primary" : "bg-accent"}`
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `relative z-10 rounded-full p-4 ${isLecture ? "bg-primary/20 text-primary" : "bg-accent/20 text-accent"} group-hover:scale-110 transition-smooth`,
                  children: isLecture ? /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { className: "h-8 w-8", "aria-hidden": "true" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-8 w-8", "aria-hidden": "true" })
                }
              ),
              isLecture && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-2 right-2 bg-background/80 rounded-full p-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Play,
                {
                  className: "h-3 w-3 text-primary fill-primary",
                  "aria-hidden": "true"
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "secondary",
                  className: isLecture ? "bg-primary/10 text-primary border-primary/20" : "bg-accent/10 text-accent border-accent/20",
                  children: isLecture ? "Lecture" : "Notes"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-muted-foreground text-xs", children: item.topic })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-sm text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors duration-200", children: item.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs line-clamp-2 mb-3 min-h-[2.5rem]", children: item.description }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs", children: formatRelativeTime(item.uploadedAt) })
          ]
        }
      )
    }
  );
}
function ContentModal({ selected, onClose }) {
  const isLecture = (selected == null ? void 0 : selected.item.type) === "lecture";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!selected, onOpenChange: (open) => !open && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-3xl w-full p-0 overflow-hidden bg-card border-border", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { className: "px-6 pt-5 pb-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `rounded-lg p-2 flex-shrink-0 ${isLecture ? "bg-primary/15 text-primary" : "bg-accent/15 text-accent"}`,
            children: isLecture ? /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { className: "h-5 w-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-5 w-5" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display font-bold text-lg text-foreground line-clamp-2", children: selected == null ? void 0 : selected.item.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "outline",
                className: "text-xs text-muted-foreground",
                children: selected == null ? void 0 : selected.item.topic
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: selected ? formatRelativeTime(selected.item.uploadedAt) : "" })
          ] })
        ] })
      ] }),
      (selected == null ? void 0 : selected.item.description) && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-3 px-1 pb-1", children: selected.item.description })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 bg-background/60 border-t border-border", children: selected && isLecture ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "video",
      {
        src: selected.url,
        controls: true,
        className: "w-full max-h-[420px] bg-background",
        "data-ocid": "lecture-video-player",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("track", { kind: "captions" })
      },
      selected.url
    ) : selected ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "iframe",
      {
        src: selected.url,
        title: selected.item.title,
        className: "w-full h-[480px] border-0",
        "data-ocid": "note-pdf-viewer"
      },
      selected.url
    ) : null })
  ] }) });
}
function EmptyState({ hasFilters }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      className: "col-span-full flex flex-col items-center justify-center py-20 px-6 text-center",
      "data-ocid": "empty-state",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-full bg-muted/60 p-6 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          BookOpen,
          {
            className: "h-10 w-10 text-muted-foreground",
            "aria-hidden": "true"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-lg text-foreground mb-2", children: hasFilters ? "No content matches your filters" : "No content yet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm max-w-xs", children: hasFilters ? "Try adjusting your search or filter to find what you're looking for." : "Your instructor hasn't uploaded any content yet. Check back soon!" })
      ]
    }
  );
}
const SKELETON_KEYS = ["sk-a", "sk-b", "sk-c", "sk-d", "sk-e", "sk-f"];
const TYPE_OPTIONS = [
  { value: "all", label: "All" },
  { value: "lectures", label: "Lectures" },
  { value: "notes", label: "Notes" }
];
function LibraryPage() {
  const { isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: lectures = [], isLoading: lecturesLoading } = useLectures();
  const { data: notes = [], isLoading: notesLoading } = useNotes();
  const [search, setSearch] = reactExports.useState("");
  const [typeFilter, setTypeFilter] = reactExports.useState("all");
  const [topicFilter, setTopicFilter] = reactExports.useState("all");
  const [selected, setSelected] = reactExports.useState(null);
  const debouncedSearch = useDebounce(search, 300);
  const isLoading = lecturesLoading || notesLoading;
  const unified = reactExports.useMemo(() => {
    const lectureItems = lectures.map((l) => ({
      id: `lecture-${l.id}`,
      type: "lecture",
      title: l.title,
      description: l.description,
      topic: l.topic,
      uploadedAt: l.uploadedAt,
      raw: l
    }));
    const noteItems = notes.map((n) => ({
      id: `note-${n.id}`,
      type: "note",
      title: n.title,
      description: n.description,
      topic: n.topic,
      uploadedAt: n.uploadedAt,
      raw: n
    }));
    return [...lectureItems, ...noteItems].sort(
      (a, b) => Number(b.uploadedAt - a.uploadedAt)
    );
  }, [lectures, notes]);
  const topics = reactExports.useMemo(() => {
    const set = new Set(unified.map((i) => i.topic));
    return Array.from(set).sort();
  }, [unified]);
  const filtered = reactExports.useMemo(() => {
    let items = unified;
    if (typeFilter === "lectures")
      items = items.filter((i) => i.type === "lecture");
    if (typeFilter === "notes") items = items.filter((i) => i.type === "note");
    if (topicFilter !== "all")
      items = items.filter((i) => i.topic === topicFilter);
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      items = items.filter(
        (i) => i.title.toLowerCase().includes(q) || i.description.toLowerCase().includes(q)
      );
    }
    return items;
  }, [unified, typeFilter, topicFilter, debouncedSearch]);
  const hasFilters = typeFilter !== "all" || topicFilter !== "all" || debouncedSearch.trim().length > 0;
  const handleOpen = reactExports.useCallback((item) => {
    const url = getMediaUrl(item);
    setSelected({ item, url });
  }, []);
  const handleClose = reactExports.useCallback(() => setSelected(null), []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ProtectedRoute, { isRoleLoading: adminLoading, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { isAdmin, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-3xl text-foreground mb-1", children: "Content Library" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "Browse video lectures and course notes from your instructor." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Search,
            {
              className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none",
              "aria-hidden": "true"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              "data-ocid": "search-input",
              type: "search",
              placeholder: "Search by title or description…",
              value: search,
              onChange: (e) => setSearch(e.target.value),
              className: "pl-9 pr-9 bg-card border-input",
              "aria-label": "Search content"
            }
          ),
          search && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setSearch(""),
              className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors",
              "aria-label": "Clear search",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            "data-ocid": "topic-filter",
            value: topicFilter,
            onChange: (e) => setTopicFilter(e.target.value),
            className: "h-10 rounded-md border border-input bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth min-w-[140px]",
            "aria-label": "Filter by topic",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "All Topics" }),
              topics.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: t, children: t }, t))
            ]
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "fieldset",
        {
          className: "inline-flex gap-1 rounded-lg border border-border bg-muted/40 p-1 mb-6",
          "aria-label": "Filter by content type",
          children: TYPE_OPTIONS.map(({ value, label }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": `type-filter-${value}`,
              onClick: () => setTypeFilter(value),
              className: `rounded-md px-4 py-1.5 text-sm font-display font-medium transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${typeFilter === value ? "bg-card text-foreground shadow-sm border border-border" : "text-muted-foreground hover:text-foreground"}`,
              "aria-pressed": typeFilter === value,
              children: label
            },
            value
          ))
        }
      ),
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "content-grid", children: SKELETON_KEYS.map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(ContentCardSkeleton, {}, k)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "content-grid", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "popLayout", children: filtered.length > 0 ? filtered.map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, scale: 0.96 },
          transition: { delay: idx * 0.04, duration: 0.22 },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ContentCard, { item, onOpen: handleOpen })
        },
        item.id
      )) : /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { hasFilters }) }) }),
      !isLoading && filtered.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-6 text-muted-foreground text-xs text-center", children: [
        "Showing ",
        filtered.length,
        " of ",
        unified.length,
        " items"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ContentModal, { selected, onClose: handleClose })
  ] }) });
}
export {
  LibraryPage as default
};
