import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const Secret = () => {
  const [registrationCount, setRegistrationCount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegistrationCount = async () => {
      try {
        const { count, error } = await supabase
          .from("registrations")
          .select("*", { count: "exact", head: true });

        if (error) {
          throw error;
        }

        setRegistrationCount(count);
      } catch (error) {
        console.error("Error fetching registration count:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrationCount();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-primary-foreground text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Secret Admin Page</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <p className="text-2xl">
            Total Registrations: <strong>{registrationCount}</strong>
          </p>
        )}
      </div>
    </div>
  );
};

export default Secret;
