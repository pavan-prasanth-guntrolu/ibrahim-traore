import { motion } from "framer-motion";
import { useState } from "react";
import {
  Mail,
  MapPin,
  Phone,
  Send,
  ExternalLink,
  ArrowRight,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { FaLinkedin, FaTwitter, FaYoutube, FaInstagram } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const { error } = await supabase
        .from("contact_messages")
        .insert([formData]);

      if (error) throw error;

      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Us",
      description: "Get in touch with our organizing team",
      contact: "qiskit.fallfest@rguktsklm.ac.in",
      action: "mailto:qiskit.fallfest@rguktsklm.ac.in",
    },
    {
      icon: Phone,
      title: "Call Us",
      description: "Speak directly with organizers",
      contact: "+91 93928 10073",
      action: "tel:+919392810073",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      description: "RGUKT Srikakulam Campus",
      contact: "Srikakulam, Andhra Pradesh, India",
      action: "https://maps.app.goo.gl/Eo9Jy9rXVHPQZnSt8",
    },
  ];

  const socialLinks = [
    {
      icon: FaLinkedin,
      name: "LinkedIn",
      url: "https://www.linkedin.com/company/rguktsklm-qff2025/",
      color: "from-blue-600 to-blue-800",
      hoverColor: "group-hover:from-blue-700 group-hover:to-blue-900",
    },
    {
      icon: FaTwitter,
      name: "X (Twitter)",
      url: "https://x.com/rguktsklm_qff25?t=biaMBN4M9_3vEKNrAH7Hxg&s=08",
      color: "from-gray-700 to-gray-900",
      hoverColor: "group-hover:from-gray-800 group-hover:to-black",
    },
    {
      icon: FaYoutube,
      name: "YouTube",
      url: "https://www.youtube.com/@rguktsklm_qff2025",
      color: "from-red-600 to-red-800",
      hoverColor: "group-hover:from-red-700 group-hover:to-red-900",
    },
    {
      icon: FaInstagram,
      name: "Instagram",
      url: "https://www.instagram.com/rguktsklm_qff2025/",
      color: "from-pink-500 via-purple-500 to-indigo-500",
      hoverColor:
        "group-hover:from-pink-600 group-hover:via-purple-600 group-hover:to-indigo-600",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background"
    >
      <section className="hero-gradient py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-poppins mb-6">
              Get in <span className="text-gradient">Touch</span>
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground">
              Have questions? We're here to help make your quantum journey
              successful
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {contactMethods.map((method, index) => {
                const Icon = method.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <Card className="glass-card border border-white/10 text-center h-full">
                      <CardContent className="p-6">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">
                          {method.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-3">
                          {method.description}
                        </p>
                        <a
                          href={method.action}
                          className="text-primary hover:text-primary-hover transition-colors font-medium"
                        >
                          {method.contact}
                        </a>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Social Media Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold font-poppins mb-6 text-center">
                Connect With Us <span className="text-gradient">Socially</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {socialLinks.map((social, index) => {
                  const SocialIcon = social.icon;
                  return (
                    <motion.a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="glass-card border border-white/10 overflow-hidden h-full relative">
                        <CardContent className="p-6 text-center relative z-10">
                          <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center text-3xl text-primary">
                            <SocialIcon />
                          </div>
                          <h3 className="font-semibold mb-1">{social.name}</h3>
                        </CardContent>
                      </Card>
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>

            {/* Contact Form */}
            <Card className="glass-card border border-white/10 mb-8 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary opacity-50"></div>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold font-poppins mb-6 text-center">
                  Send Us a <span className="text-gradient">Message</span>
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium mb-2 flex items-center"
                      >
                        <span className="bg-primary/10 p-1 rounded-md mr-2">
                          <span className="block h-3 w-3 rounded-full bg-primary"></span>
                        </span>
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-white/20 bg-background/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium mb-2 flex items-center"
                      >
                        <span className="bg-primary/10 p-1 rounded-md mr-2">
                          <span className="block h-3 w-3 rounded-full bg-primary"></span>
                        </span>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-white/20 bg-background/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium mb-2 flex items-center"
                    >
                      <span className="bg-primary/10 p-1 rounded-md mr-2">
                        <span className="block h-3 w-3 rounded-full bg-primary"></span>
                      </span>
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-white/20 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors bg-popover"
                    >
                      <option value="">Select a topic</option>
                      <option value="registration">
                        Registration Questions
                      </option>
                      <option value="technical">Technical Support</option>
                      <option value="sponsorship">Sponsorship Inquiry</option>
                      <option value="media">Media & Press</option>
                      <option value="general">General Questions</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium mb-2 flex items-center"
                    >
                      <span className="bg-primary/10 p-1 rounded-md mr-2">
                        <span className="block h-3 w-3 rounded-full bg-primary"></span>
                      </span>
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 rounded-lg border border-white/20 bg-background/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none"
                      placeholder="Tell us how we can help you..."
                    ></textarea>
                  </div>

                  <div className="text-center">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-quantum px-8 py-2 text-primary-foreground rounded-lg shadow-md relative group animate-pulse-glow disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="relative z-10 flex items-center">
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Send Message
                          </>
                        )}
                      </span>
                      <span className="absolute inset-0 bg-white/10 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity"></span>
                    </Button>
                  </div>

                  {submitStatus === "success" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center"
                    >
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      <span className="text-green-700 dark:text-green-400">
                        Message sent successfully! We'll get back to you soon.
                      </span>
                    </motion.div>
                  )}

                  {submitStatus === "error" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center"
                    >
                      <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                      <span className="text-red-700 dark:text-red-400">
                        Failed to send message. Please try again or contact us
                        directly.
                      </span>
                    </motion.div>
                  )}
                </form>
              </CardContent>
            </Card>

            {/* Code of Conduct */}
            <Card className="glass-card border border-white/10 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary to-primary opacity-50"></div>
              <CardContent className="p-8 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-2xl font-bold font-poppins mb-4">
                    Code of <span className="text-gradient">Conduct</span>
                  </h2>
                  <p className="text-muted-foreground mb-6 leading-relaxed max-w-2xl mx-auto">
                    We follow a zero-tolerance Code of Conduct. Respect everyone
                    — harassment is not tolerated. Report incidents to
                    <a
                      href="mailto:qiskit.fallfest@rguktsklm.ac.in"
                      className="text-primary hover:underline ml-1"
                    >
                      qiskit.fallfest@rguktsklm.ac.in
                    </a>
                    .
                  </p>
                  <Button
                    variant="outline"
                    className="px-6 py-2 glass-card border border-white/20 hover:border-primary/50 rounded-lg shadow-md relative group"
                  >
                    <span className="relative z-10 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center">
                      View Full Code of Conduct
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <span className="absolute inset-0 bg-white/5 rounded-lg opacity-0 group-hover:opacity-30 transition-opacity"></span>
                  </Button>
                </motion.div>
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-12"
            >
              <h2 className="text-2xl font-bold font-poppins mb-6 text-center">
                Frequently Asked{" "}
                <span className="text-gradient">Questions</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    question: "What is Qiskit Fall Fest?",
                    answer:
                      "Qiskit Fall Fest is a global quantum computing event series organized by students and supported by IBM Quantum. It features workshops, hackathons, and networking opportunities.",
                  },
                  {
                    question: "Do I need prior quantum computing knowledge?",
                    answer:
                      "No, beginners are welcome! We'll have introductory workshops to help you get started with quantum computing concepts and Qiskit.",
                  },
                  {
                    question: "How can I participate in the hackathon?",
                    answer:
                      "Register for the event, attend the workshops, and form a team. Detailed hackathon rules and project submission guidelines will be provided during the event.",
                  },
                  {
                    question: "Is there a registration fee?",
                    answer:
                      "No, participation in Qiskit Fall Fest 2025 is completely free, thanks to our sponsors and RGUKT Srikakulam.",
                  },
                ].map((faq, index) => (
                  <Card
                    key={index}
                    className="glass-card border border-white/10 overflow-hidden"
                  >
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-2 text-primary">
                        {faq.question}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {faq.answer}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Contact;
