import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  User,
  Mail,
  Phone,
  GraduationCap,
  Building,
  ExternalLink,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import groupQR from "/images/group-q.png";
import { useAuth } from "@/components/AuthProvider";

const WHATSAPP_GROUP_LINK =
  "https://chat.whatsapp.com/IOa3y2QZaaCI1JCHCOmZIP?mode=ems_qr_t";
const WHATSAPP_QR_CODE = groupQR;

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    institution: "",
    year: "",
    branch: "",
    experience: "",
    motivation: "",
    referralCode: "",
    agreeTerms: false,
    agreeUpdates: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  // If user is not signed in
  if (!user) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center bg-background px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="max-w-md w-full text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div
            className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Lock className="h-10 w-10 text-blue-600 dark:text-blue-400" />
          </motion.div>
          <h1 className="text-2xl font-bold font-poppins mb-4">
            Sign In Required
          </h1>
          <p className="text-muted-foreground mb-6">
            Please sign in or create an account to access the registration form.
          </p>
          <Button
            onClick={() => navigate("/login")}
            className="btn-quantum text-primary-foreground px-8 py-3 text-lg font-semibold rounded-lg shadow-lg relative group animate-pulse-glow"
          >
            <span className="relative z-10">Go to Login</span>
            <span className="absolute inset-0 bg-white/10 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity"></span>
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    if (user?.email) {
      setFormData((prev) => ({
        ...prev,
        email: user.email, // ✅ prefill from auth
      }));
    }
  }, [user]); // Pre-fill referral code if in URL
  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      setFormData((prev) => ({
        ...prev,
        referralCode: ref,
      }));
    }
  }, [searchParams]);

  const validateForm = () => {
    const requiredFields = [
      "fullName",
      "email",
      "phone",
      "institution",
      "year",
      "branch",
    ];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.agreeTerms) {
      toast({
        title: "Terms & Conditions",
        description: "Please agree to the terms and conditions to continue.",
        variant: "destructive",
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      if (!user) return;

      // Check if already registered
      const { data: existing } = await supabase
        .from("registrations")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (existing) {
        toast({
          title: "Already Registered",
          description: "You have already registered for this event.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Generate referral code from user ID
      const referralCode = btoa(user.id).substring(0, 8);

      // Find referrer if referral code provided
      let referredBy = null;
      if (formData.referralCode) {
        const { data: referrer } = await supabase
          .from("registrations")
          .select("id")
          .eq("referral_code", formData.referralCode)
          .single();
        if (referrer) {
          referredBy = referrer.id;
        }
      }

      // Insert registration record
      const { error: registrationError } = await supabase
        .from("registrations")
        .insert([
          {
            user_id: user.id,
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            institution: formData.institution,
            year: formData.year,
            branch: formData.branch,
            experience: formData.experience,
            motivation: formData.motivation,
            referral_code: referralCode,
            referred_by: referredBy,
          },
        ]);

      if (registrationError) throw registrationError;

      setIsSubmitted(true);
      toast({
        title: "Registration Successful!",
        description: "You have registered for Qiskit Fall Fest 🎉",
      });
    } catch (error) {
      console.error("Error submitting registration:", error);
      toast({
        title: "Registration Failed",
        description: error.message || "Something went wrong. Try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success Page
  if (isSubmitted) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center bg-background px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="max-w-md w-full text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div
            className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
          </motion.div>
          <h1 className="text-2xl font-bold font-poppins mb-4">
            Registration Successful!
          </h1>
          <p className="text-muted-foreground mb-6">
            Thanks for registering! Stay connected with updates below.
          </p>

          <Card className="mb-6 border border-green-200 dark:border-green-900/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-green-700 dark:text-green-400">
                Join Our WhatsApp Group
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Stay updated with event announcements and connect with other
                participants!
              </p>
              <div className="mb-4 flex justify-center">
                <img
                  src={WHATSAPP_QR_CODE}
                  alt="WhatsApp Group QR Code"
                  className="w-48 h-48 border border-border rounded-lg"
                />
              </div>
              <Button
                onClick={() => window.open(WHATSAPP_GROUP_LINK, "_blank")}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium flex items-center justify-center gap-2"
              >
                Join WhatsApp Group
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    );
  }

  // Form Page
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background py-20"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold font-poppins mb-4">
              Register for{" "}
              <span className="text-gradient">Qiskit Fall Fest 2025</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Secure your spot at IIIT Srikakulam's quantum computing
              celebration
            </p>
          </div>

          <Card className="glass-card border border-white/10">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">
                Registration Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <User className="h-5 w-5 mr-2 text-primary" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) =>
                          handleInputChange("fullName", e.target.value)
                        }
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={() => {}} // disable manual changes
                        readOnly // ✅ prevents editing
                        className="bg-muted cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      placeholder="+91 XXXXX XXXXX"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="referralCode">
                      Referral Code (Optional)
                    </Label>
                    <Input
                      id="referralCode"
                      value={formData.referralCode}
                      onChange={(e) =>
                        handleInputChange("referralCode", e.target.value)
                      }
                      placeholder="Enter referral code if you have one"
                    />
                  </div>
                </div>

                {/* Academic Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <GraduationCap className="h-5 w-5 mr-2 text-primary" />
                    Academic Information
                  </h3>
                  <div>
                    <Label htmlFor="institution">Institution *</Label>
                    <Input
                      id="institution"
                      value={formData.institution}
                      onChange={(e) =>
                        handleInputChange("institution", e.target.value)
                      }
                      placeholder="Your college/university name"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="year">Academic Year *</Label>
                      <Select
                        onValueChange={(value) =>
                          handleInputChange("year", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1st-year">1st Year</SelectItem>
                          <SelectItem value="2nd-year">2nd Year</SelectItem>
                          <SelectItem value="3rd-year">3rd Year</SelectItem>
                          <SelectItem value="4th-year">
                            4th Year / Final Year
                          </SelectItem>
                          <SelectItem value="masters">
                            Master's Student
                          </SelectItem>
                          <SelectItem value="phd">PhD Student</SelectItem>
                          <SelectItem value="faculty">Faculty/Staff</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="branch">Branch/Major *</Label>
                      <Input
                        id="branch"
                        value={formData.branch}
                        onChange={(e) =>
                          handleInputChange("branch", e.target.value)
                        }
                        placeholder="e.g., Computer Science, Physics"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Background */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Building className="h-5 w-5 mr-2 text-primary" />
                    Background & Motivation
                  </h3>
                  <div>
                    <Label htmlFor="experience">
                      Quantum Computing Experience
                    </Label>
                    <Select
                      onValueChange={(value) =>
                        handleInputChange("experience", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">
                          No prior experience
                        </SelectItem>
                        <SelectItem value="beginner">
                          Beginner (some reading/online courses)
                        </SelectItem>
                        <SelectItem value="intermediate">
                          Intermediate (some projects/coursework)
                        </SelectItem>
                        <SelectItem value="advanced">
                          Advanced (research/professional experience)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="motivation">
                      Why do you want to attend? (Optional)
                    </Label>
                    <Textarea
                      id="motivation"
                      value={formData.motivation}
                      onChange={(e) =>
                        handleInputChange("motivation", e.target.value)
                      }
                      placeholder="Tell us what motivates you..."
                      rows={3}
                    />
                  </div>
                </div>

                {/* Terms */}
                <div className="space-y-4 border-t border-border pt-4">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="agreeTerms"
                      checked={formData.agreeTerms}
                      onCheckedChange={(checked) =>
                        handleInputChange("agreeTerms", checked)
                      }
                    />
                    <div className="text-sm">
                      <Label htmlFor="agreeTerms" className="cursor-pointer">
                        I agree to the{" "}
                        <a
                          href="/code-of-conduct"
                          className="text-primary hover:underline"
                        >
                          Code of Conduct
                        </a>{" "}
                        and event terms and conditions. *
                      </Label>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="agreeUpdates"
                      checked={formData.agreeUpdates}
                      onCheckedChange={(checked) =>
                        handleInputChange("agreeUpdates", checked)
                      }
                    />
                    <div className="text-sm">
                      <Label htmlFor="agreeUpdates" className="cursor-pointer">
                        I would like to receive updates about future quantum
                        events.
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full btn-quantum py-3 text-lg font-semibold rounded-lg shadow-lg relative group animate-pulse-glow"
                  disabled={isSubmitting}
                >
                  <span className="relative z-10">
                    {isSubmitting ? "Registering..." : "Complete Registration"}
                  </span>
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  Already registered?{" "}
                  <a
                    href={WHATSAPP_GROUP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center justify-center gap-1"
                  >
                    Join WhatsApp Group <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Register;
