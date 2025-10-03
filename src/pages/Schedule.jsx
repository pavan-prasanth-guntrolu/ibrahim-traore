import {
  Clock,
  MapPin,
  User,
  Users,
  BookOpen,
  Info,
  Star,
  Layers,
} from "lucide-react";
import scheduleData from "../data/schedule.json";

const Schedule = () => {
  const getSessionIcon = (type) => {
    switch (type) {
      case "keynote":
        return <Star className="w-4 h-4 text-yellow-400" />;
      case "workshop":
        return <Users className="w-4 h-4 text-blue-400" />;
      case "tutorial":
        return <BookOpen className="w-4 h-4 text-green-400" />;
      case "presentation":
        return <Info className="w-4 h-4 text-purple-400" />;
      case "panel":
        return <Layers className="w-4 h-4 text-pink-400" />;
      case "ceremony":
        return <Info className="w-4 h-4 text-indigo-400" />;
      case "hackathon":
        return <Users className="w-4 h-4 text-red-400" />;
      case "social":
        return <Users className="w-4 h-4 text-orange-400" />;
      case "competition":
        return <Star className="w-4 h-4 text-cyan-400" />;
      case "registration":
        return <Info className="w-4 h-4 text-teal-400" />;
      case "break":
        return <Clock className="w-4 h-4 text-gray-400" />;
      default:
        return <Info className="w-4 h-4 text-gray-400" />;
    }
  };

  const renderSession = (session, isSub = false) => (
    <div
      key={session.id}
      className={`group border ${
        isSub ? "ml-8 bg-slate-800/30" : "bg-slate-800/40"
      } border-slate-700 hover:border-purple-400 transition-all duration-300 p-6 rounded-2xl hover:bg-slate-800/60 cursor-pointer mb-4`}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          <div className="p-2 bg-slate-700/40 rounded-lg">
            {getSessionIcon(session.type)}
          </div>
          <div>
            <h3 className="text-lg font-bold mb-1">{session.title}</h3>
            <p className="text-slate-400 text-sm mb-2">{session.description}</p>
            <div className="flex flex-wrap gap-4 text-sm text-slate-400">
              {session.time && (
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-300" />
                  {session.time}
                </span>
              )}
              {session.location && (
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-cyan-300" />
                  {session.location}
                </span>
              )}
              {session.speakers && (
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4 text-green-300" />
                  {Array.isArray(session.speakers)
                    ? session.speakers.join(", ")
                    : session.speakers}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {session.subSessions && session.subSessions.length > 0 && (
        <div className="mt-4 border-l-2 border-purple-400 pl-4">
          {session.subSessions.map((sub) => renderSession(sub, true))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900/20 to-slate-900 text-white">
      <br />
      <br />
      <div className="py-16 px-6 max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-4 bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
          Event Schedule
        </h1>
        <p className="text-center text-slate-400 mb-12 text-lg">
          Explore hands-on workshops, insightful talks, and advanced sessions.
        </p>
        <br />
        <br />
        {/* {scheduleData.map((day) => (
          <div key={day.date} className="mb-16">
            <h2 className="text-3xl font-semibold mb-2 text-center text-purple-300">
              {day.date} ({day.day}) – {day.title}
            </h2>
            <p className="text-center text-slate-400 italic mb-8">
              {day.theme}
            </p>

            <div className="space-y-6">
              {day.sessions.map((session) => renderSession(session))}
            </div>
          </div>
        ))} */}
        <div className="text-center text-2xl  w-70  p-2 rounded-lg  text-white ">
          <span className="bg-white text-black p-3 rounded-lg">
            <a
              href="https://docs.google.com/document/d/11UcNU8jXEmsaqHjMS7DYCdFn6pcprI8ar2HqfSh5WRg/edit?usp=sharing"
              target="__blank"
            >
              View Full Schedule
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
