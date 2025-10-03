import { motion } from "framer-motion";
import { Atom, Users, Globe, Trophy, BookOpen, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  const highlights = [
    {
      icon: Globe,
      title: "Global Initiative",
      description:
        "Part of the worldwide Qiskit Fall Fest series supported by IBM Quantum, connecting students across continents.",
    },
    {
      icon: Users,
      title: "Student-Led",
      description:
        "Organized by passionate students at Rgukt Srikakulam who are enthusiastic about quantum computing.",
    },
    {
      icon: BookOpen,
      title: "Practical Learning",
      description:
        "Hands-on workshops and guided Jupyter notebooks designed for real-world quantum programming skills.",
    },
    {
      icon: Trophy,
      title: "Campus Hackathon",
      description:
        "Build innovative quantum applications and compete with fellow students for exciting prizes.",
    },
    {
      icon: Atom,
      title: "Expert Mentorship",
      description:
        "Learn from leading quantum researchers and industry professionals from IBM and other organizations.",
    },
    {
      icon: Zap,
      title: "Future-Ready Skills",
      description:
        "Gain expertise in quantum computing technologies that will shape the future of computation.",
    },
  ];

  const objectives = [
    "Introduce students to quantum computing concepts and Qiskit framework",
    "Provide hands-on experience with quantum algorithms and applications",
    "Foster collaboration and innovation through hackathon challenges",
    "Build a strong quantum computing community at Rgukt Srikakulam",
    "Connect students with quantum computing professionals and researchers",
    "Prepare students for careers in quantum technology and research",
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background"
    >
      {/* Hero Section */}
      <section className="hero-gradient py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-poppins mb-6">
              About <span className="text-gradient">Qiskit Fall Fest</span>
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed">
              Empowering the next generation of quantum computing innovators
              through hands-on learning and collaborative exploration.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Overview */}
          <motion.div
            className="max-w-4xl mx-auto mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="glass-card p-8 lg:p-12 rounded-2xl border border-white/10">
              <h2 className="text-3xl lg:text-4xl font-bold font-poppins mb-6 text-center">
                What is Qiskit Fall Fest?
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Qiskit Fall Fest is a global student-run series of quantum
                  computing events supported by IBM Quantum. Rgukt Srikakulam
                  edition brings hands-on workshops, guided Jupyter notebooks,
                  and a campus hackathon to help students build practical Qiskit
                  skills.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Our seven-day event is designed to take participants on a
                  comprehensive journey through the fascinating world of quantum
                  technology, from foundational concepts to advanced
                  applications. Whether you're a complete beginner or have some
                  experience with quantum technology, this festival offers
                  something valuable for everyone.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  The event combines theoretical learning with practical
                  implementation, ensuring participants not only understand
                  quantum technology concepts but also gain hands-on experience
                  building quantum applications using IBM's Qiskit framework.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Highlights Grid */}
          <motion.div
            className="mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold font-poppins text-center mb-12">
              Why Attend Qiskit Fall Fest?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {highlights.map((highlight, index) => {
                const Icon = highlight.icon;
                return (
                  <motion.div
                    key={highlight.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -5 }}
                  >
                    <Card className="glass-card border border-white/10 h-full">
                      <CardContent className="p-6">
                        <motion.div
                          className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4"
                          whileHover={{ scale: 1.1 }}
                        >
                          <Icon className="h-6 w-6 text-primary" />
                        </motion.div>
                        <h3 className="text-xl font-semibold mb-3">
                          {highlight.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {highlight.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Objectives */}
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="glass-card p-8 lg:p-12 rounded-2xl border border-white/10">
              <h2 className="text-3xl lg:text-4xl font-bold font-poppins mb-8 text-center">
                Our Objectives
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {objectives.map((objective, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex-shrink-0 w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center mt-1">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {objective}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* IBM Partnership */}
      <section className="py-20 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="glass-card p-8 lg:p-12 rounded-2xl border border-white/10">
              <motion.div
                className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6"
                whileHover={{ scale: 1.1 }}
              >
                <Atom className="h-8 w-8 text-primary animate-pulse-glow" />
              </motion.div>
              <h2 className="text-3xl lg:text-4xl font-bold font-poppins mb-6">
                Powered by IBM Quantum
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                This event is part of the global Qiskit Fall Fest series,
                officially supported by IBM Quantum. Participants will have
                access to IBM's quantum computers, educational resources, and
                expert guidance from the Qiskit community.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                IBM Qiskit is the world's most popular quantum computing
                framework, used by researchers, students, and professionals
                worldwide. Through this partnership, we bring world-class
                quantum education directly to Rgukt Srikakulam.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default About;
