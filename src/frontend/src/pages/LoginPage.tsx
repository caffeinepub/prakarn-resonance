import { Button } from "@/components/ui/button";
import { Navigate } from "@tanstack/react-router";
import { BookOpen, GraduationCap, PlayCircle, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../hooks/useAuth";

const features = [
  {
    icon: PlayCircle,
    title: "Video Lectures",
    description:
      "Watch high-quality instructor-recorded lectures at your own pace.",
  },
  {
    icon: BookOpen,
    title: "Course Notes",
    description:
      "Access structured notes and study materials alongside each lecture.",
  },
  {
    icon: Sparkles,
    title: "Expert Instruction",
    description: "Content curated and delivered by a dedicated instructor.",
  },
];

export default function LoginPage() {
  const { isAuthenticated, isLoading, login } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/library" />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="text-center max-w-2xl mx-auto"
        >
          {/* Logo mark */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
              <GraduationCap className="w-11 h-11 text-primary-foreground" />
            </div>
          </div>

          <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-foreground leading-tight mb-4">
            Prakarn
            <span className="text-primary block">Resonance</span>
          </h1>

          <p className="text-muted-foreground text-lg sm:text-xl mb-10 max-w-lg mx-auto leading-relaxed">
            An instructor-curated learning space for video lectures and course
            notes. Sign in to start learning.
          </p>

          <Button
            size="lg"
            className="h-12 px-8 text-base font-semibold shadow-md hover:shadow-lg transition-smooth"
            onClick={login}
            disabled={isLoading}
            data-ocid="login-btn"
          >
            {isLoading ? (
              <>
                <span className="animate-pulse mr-2">●</span>
                Connecting…
              </>
            ) : (
              "Sign in with Internet Identity"
            )}
          </Button>

          <p className="text-xs text-muted-foreground mt-4">
            Secure, passwordless authentication via the Internet Computer
          </p>
        </motion.div>
      </div>

      {/* Feature cards */}
      <div className="bg-muted/30 border-t border-border py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-10"
          >
            What's inside
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, description }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-card rounded-xl border border-border p-6 shadow-sm"
                data-ocid={`feature-card-${i}`}
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">
                  {title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
