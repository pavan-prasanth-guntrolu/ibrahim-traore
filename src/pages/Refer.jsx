import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Copy, Share2, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";

const Refer = () => {
  const [referralCode, setReferralCode] = useState("");
  const [referredUsers, setReferredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [friendReferralCode, setFriendReferralCode] = useState("");
  const [hasRegistration, setHasRegistration] = useState(false);
  const [currentFriendReferralCode, setCurrentFriendReferralCode] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchReferralData();
      fetchLeaderboard();
    }
  }, [user]);

  const fetchReferralData = async () => {
    try {
      const { data: registration, error: registrationError } = await supabase
        .from("registrations")
        .select(`
          referral_code,
          id,
          referred_by,
          referrer:registrations!referred_by(referral_code)
        `)
        .eq("user_id", user.id)
        .single();

      if (registrationError && registrationError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw registrationError;
      }

      if (registration) {
        setHasRegistration(true);
        setReferralCode(registration.referral_code);

        // Set the current friend's referral code if it exists
        if (registration.referrer && registration.referrer.referral_code) {
          setCurrentFriendReferralCode(registration.referrer.referral_code);
          setFriendReferralCode(registration.referrer.referral_code);
        }

        const { data: referrals, error: referralsError } = await supabase
          .from("registrations")
          .select("fullName, email, created_at")
          .eq("referred_by", registration.id);

        if (referralsError) throw referralsError;

        setReferredUsers(referrals || []);
      } else {
        setHasRegistration(false);
      }
    } catch (error) {
      console.error("Error fetching referral data:", error);
      toast({
        title: "Error",
        description: "Failed to load referral data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      // Get all referrals
      const { data: referrals, error: referralsError } = await supabase
        .from("registrations")
        .select("referred_by")
        .not('referred_by', 'is', null);

      if (referralsError) throw referralsError;

      // Get unique referrer IDs
      const referrerIds = [...new Set(referrals.map(ref => ref.referred_by))];

      if (referrerIds.length === 0) {
        setLeaderboard([]);
        return;
      }

      // Fetch referrer details
      const { data: referrers, error: referrersError } = await supabase
        .from("registrations")
        .select("id, fullName, email")
        .in('id', referrerIds);

      if (referrersError) throw referrersError;

      // Create a map of referrer details
      const referrerMap = {};
      referrers.forEach(referrer => {
        referrerMap[referrer.id] = {
          fullName: referrer.fullName,
          email: referrer.email
        };
      });

      // Count referrals per referrer
      const referrerCounts = {};
      referrals.forEach(ref => {
        const referrerId = ref.referred_by;
        if (!referrerCounts[referrerId]) {
          referrerCounts[referrerId] = {
            id: referrerId,
            count: 0,
            fullName: referrerMap[referrerId]?.fullName || 'Unknown',
            email: referrerMap[referrerId]?.email || 'Unknown'
          };
        }
        referrerCounts[referrerId].count++;
      });

      // Convert to array, sort by count descending, take top 5
      const leaderboardData = Object.values(referrerCounts)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode);
    toast({
      title: "Copied!",
      description: "Referral code copied to clipboard.",
    });
  };

  const shareReferralLink = () => {
    const url = `${window.location.origin}/register?ref=${referralCode}`;
    if (navigator.share) {
      navigator.share({
        title: "Join Qiskit Fall Fest 2025",
        text: "Use my referral code to register!",
        url: url,
      });
    } else {
      navigator.clipboard.writeText(url);
      toast({
        title: "Link Copied!",
        description: "Referral link copied to clipboard.",
      });
    }
  };

  const applyReferralCode = async () => {
    if (!friendReferralCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a referral code.",
        variant: "destructive",
      });
      return;
    }

    // Prevent self-referral
    if (friendReferralCode.trim() === referralCode) {
      toast({
        title: "Invalid Code",
        description: "You cannot use your own referral code.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Find referrer
      let referredBy = null;
      const { data: referrer } = await supabase
        .from("registrations")
        .select("id, user_id")
        .eq("referral_code", friendReferralCode.trim())
        .single();

      if (referrer) {
        // Double check it's not self-referral
        if (referrer.user_id === user.id) {
          toast({
            title: "Invalid Code",
            description: "You cannot use your own referral code.",
            variant: "destructive",
          });
          return;
        }
        referredBy = referrer.id;
      } else {
        toast({
          title: "Invalid Code",
          description: "The referral code you entered is invalid.",
          variant: "destructive",
        });
        return;
      }

      if (hasRegistration) {
        // Update existing registration
        const { error: updateError } = await supabase
          .from("registrations")
          .update({ referred_by: referredBy })
          .eq("user_id", user.id);

        if (updateError) {
          throw updateError;
        }
      } else {
        // Create new registration record
        const userReferralCode = btoa(user.id).substring(0, 8);

        const { error: registrationError } = await supabase.from("registrations").insert([
          {
            user_id: user.id,
            fullName: user.user_metadata?.full_name || user.email,
            email: user.email,
            referral_code: userReferralCode,
            referred_by: referredBy,
          },
        ]);

        if (registrationError) {
          throw registrationError;
        }
      }

      toast({
        title: "Referral Applied!",
        description: "Your referral code has been applied successfully.",
      });

      // Refresh data
      fetchReferralData();
    } catch (error) {
      console.error("Error applying referral code:", error);
      toast({
        title: "Error",
        description: "Failed to apply referral code. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background py-20"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold font-poppins mb-4">
              Refer & Earn
            </h1>
            <p className="text-lg text-muted-foreground">
              Share your referral code and invite friends to join Qiskit Fall Fest 2025
            </p>
          </div>

          {/* Main Referral Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Enter Friend's Referral Code Section */}
            <Card className="glass-card border border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Share2 className="h-5 w-5 mr-2 text-primary" />
                  Friend's Referral Code
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="friendReferralCode">Referral Code</Label>
                  <Input
                    id="friendReferralCode"
                    type="text"
                    value={friendReferralCode}
                    onChange={(e) => setFriendReferralCode(e.target.value)}
                    placeholder="Enter your friend's referral code"
                    className="font-mono"
                  />
                </div>
                <Button onClick={applyReferralCode} className="w-full">
                  Apply/Update Referral Code
                </Button>
                <p className="text-sm text-muted-foreground">
                  {currentFriendReferralCode
                    ? "Update your friend's referral code if needed."
                    : "Enter a referral code from a friend to earn rewards!"}
                </p>
              </CardContent>
            </Card>

            {/* Your Referral Code Section */}
            <Card className="glass-card border border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Share2 className="h-5 w-5 mr-2 text-primary" />
                  Your Referral Code
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {hasRegistration ? (
                  <>
                    <div>
                      <Label>Referral Code</Label>
                      <div className="flex gap-2">
                        <Input value={referralCode} readOnly className="font-mono" />
                        <Button onClick={copyToClipboard} variant="outline">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Button onClick={shareReferralLink} className="w-full">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Referral Link
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      Share this code with friends during registration to earn rewards!
                    </p>
                  </>
                ) : (
                  <p className="text-muted-foreground">
                    Apply a friend's referral code first to get your own referral code.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Referred Users Section */}
            <Card className="glass-card border border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-primary" />
                  People You've Referred
                </CardTitle>
              </CardHeader>
              <CardContent>
                {hasRegistration ? (
                  referredUsers.length === 0 ? (
                    <p className="text-muted-foreground">No referrals yet. Start sharing!</p>
                  ) : (
                    <div className="space-y-3">
                      {referredUsers.map((user, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div>
                            <p className="font-medium">{user.fullName}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(user.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  <p className="text-muted-foreground">
                    Apply a friend's referral code to start referring others.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Leaderboard Section - Full Width at Bottom */}
          <div className="max-w-2xl mx-auto">
            <Card className="glass-card border border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center justify-center">
                  <Trophy className="h-6 w-6 mr-3 text-primary" />
                  Top Referrers Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                {leaderboard.length === 0 ? (
                  <p className="text-muted-foreground text-center">No referrals yet. Be the first!</p>
                ) : (
                  <div className="space-y-4">
                    {leaderboard.map((referrer, index) => (
                      <div key={referrer.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                        <div className="flex items-center gap-4">
                          <span className={`text-2xl font-bold min-w-[40px] ${
                            index === 0 ? 'text-yellow-500' :
                            index === 1 ? 'text-gray-400' :
                            index === 2 ? 'text-amber-600' : 'text-muted-foreground'
                          }`}>
                            #{index + 1}
                          </span>
                          <div>
                            <p className="font-semibold text-lg">{referrer.fullName}</p>
                            <p className="text-sm text-muted-foreground">{referrer.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold text-primary">
                            {referrer.count}
                          </span>
                          <p className="text-xs text-muted-foreground">
                            referral{referrer.count !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Refer;