import { j as jsxRuntimeExports, N as Navigate } from "./index-D39pcanF.js";
import { c as createLucideIcon, u as useAuth, G as GraduationCap, B as Button, a as BookOpen } from "./useAuth-DmwR_m9H.js";
import { m as motion } from "./proxy-coyDPL9v.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["polygon", { points: "10 8 16 12 10 16 10 8", key: "1cimsy" }]
];
const CirclePlay = createLucideIcon("circle-play", __iconNode$1);
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
      d: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",
      key: "4pj2yx"
    }
  ],
  ["path", { d: "M20 3v4", key: "1olli1" }],
  ["path", { d: "M22 5h-4", key: "1gvqau" }],
  ["path", { d: "M4 17v2", key: "vumght" }],
  ["path", { d: "M5 18H3", key: "zchphs" }]
];
const Sparkles = createLucideIcon("sparkles", __iconNode);
const features = [
  {
    icon: CirclePlay,
    title: "Video Lectures",
    description: "Watch high-quality instructor-recorded lectures at your own pace."
  },
  {
    icon: BookOpen,
    title: "Course Notes",
    description: "Access structured notes and study materials alongside each lecture."
  },
  {
    icon: Sparkles,
    title: "Expert Instruction",
    description: "Content curated and delivered by a dedicated instructor."
  }
];
function LoginPage() {
  const { isAuthenticated, isLoading, login } = useAuth();
  if (isAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/library" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex flex-col items-center justify-center px-4 py-16 sm:py-24", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
        className: "text-center max-w-2xl mx-auto",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center mb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-2xl bg-primary flex items-center justify-center shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "w-11 h-11 text-primary-foreground" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-foreground leading-tight mb-4", children: [
            "Prakarn",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary block", children: "Resonance" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-lg sm:text-xl mb-10 max-w-lg mx-auto leading-relaxed", children: "An instructor-curated learning space for video lectures and course notes. Sign in to start learning." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "lg",
              className: "h-12 px-8 text-base font-semibold shadow-md hover:shadow-lg transition-smooth",
              onClick: login,
              disabled: isLoading,
              "data-ocid": "login-btn",
              children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-pulse mr-2", children: "●" }),
                "Connecting…"
              ] }) : "Sign in with Internet Identity"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-4", children: "Secure, passwordless authentication via the Internet Computer" })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-muted/30 border-t border-border py-16 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.p,
        {
          initial: { opacity: 0 },
          whileInView: { opacity: 1 },
          viewport: { once: true },
          transition: { duration: 0.5 },
          className: "text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-10",
          children: "What's inside"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-6", children: features.map(({ icon: Icon, title, description }, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { duration: 0.5, delay: i * 0.1 },
          className: "bg-card rounded-xl border border-border p-6 shadow-sm",
          "data-ocid": `feature-card-${i}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-5 h-5 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground mb-2", children: title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: description })
          ]
        },
        title
      )) })
    ] }) })
  ] });
}
export {
  LoginPage as default
};
