import React, { useEffect, useState, useRef } from "react";
import AppInput from "../../../../ui/AppInput";
import AppText from "../../../../ui/AppText";
import { Users, Calendar, X } from "lucide-react";
import { searchUsers } from "../../../../../services/userService";

function FormArea({ setSendAt, setReceiver }) {
  const [query, setQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  

  const debounceRef = useRef(null);
  

  useEffect(() => {
    if (selectedUser || !query.trim()) {
      setSuggestions([]);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await searchUsers(query.trim());
        setSuggestions(res.users || res.data || res); 
        
      } catch (err) {
        console.error("User search failed:", err);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(debounceRef.current);
  }, [query, selectedUser]);

  useEffect(() => {
    if (date && time) {
      setSendAt(`${date}T${time}`);
    }
  }, [date, time, setSendAt]);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setQuery(user.username || user.email);
    setSuggestions([]);
    setReceiver(user._id); 
  };

  const handleClearSelection = () => {
    setSelectedUser(null);
    setQuery("");
    setReceiver("");
    setSuggestions([]);
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    if (selectedUser) {
      setSelectedUser(null);
      setReceiver("");
    }
  };

 

  return (
    <div className="form-area-scope space-y-2">
      <style>{`
        .form-area-scope input[type="date"]::-webkit-calendar-picker-indicator,
        .form-area-scope input[type="time"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
          opacity: 0.8;
          cursor: pointer;
        }
        .form-area-scope input[type="date"]:hover::-webkit-calendar-picker-indicator,
        .form-area-scope input[type="time"]:hover::-webkit-calendar-picker-indicator {
          opacity: 1;
        }
      `}</style>

      <div className="flex items-center gap-3 relative ">
        <div className="flex w-14 items-center gap-1.5 shrink-0">
          <Users size={14} className="text-text-secondary" />
          <AppText variant="label2">To</AppText>
        </div>
        <div className="flex-1 relative">
          <AppInput
            name="to"
            placeholder="Recipient name or email"
            value={query}
            onChange={handleInputChange}
            autoComplete="off"
          />

          {selectedUser && (
            <button
              type="button"
              onClick={handleClearSelection}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
            >
              <X size={14} />
            </button>
          )}

          {query.trim() && !selectedUser && (
            <div className="absolute z-20 mt-1 w-full max-h-56 overflow-y-auto rounded-xl border border-shadow/60 bg-background-secondary shadow-lg">
              {loading && (
                <div className="p-2 text-center">
                  <AppText variant="meta">Searching...</AppText>
                </div>
              )}

              {!loading && suggestions.length === 0 && (
                <div className="p-2 text-center">
                  <AppText variant="meta">No users found</AppText>
                </div>
              )}

              {!loading &&
                suggestions.map((user) => (
                  <div
                    key={user._id}
                    onClick={() => handleSelectUser(user)}
                    className="flex items-center gap-2 p-2 cursor-pointer hover:bg-background-hover"
                  >
                    <img
                      src={user.avatar }
                      alt=""
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                      <AppText variant="label2">{user.username}</AppText>
                      <AppText variant="meta">{user.email}</AppText>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Date / Time */}
      <div className="flex flex-col gap-3 rounded-2xl border border-shadow/60 bg-background-secondary p-3 md:flex-row md:items-end md:p-4">
        <div className="flex-1">
          <AppInput
            label="Date"
            name="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <AppInput
            label="Time"
            name="time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
        {date && time && (
          <div className="flex items-center gap-1.5 pb-2 sm:pb-2.5 shrink-0">
            <Calendar size={13} className="text-accent" />
            <AppText variant="meta">
              {new Date(`${date}T${time}`).toLocaleString(undefined, {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </AppText>
          </div>
        )}
      </div>
    </div>
  );
}

export default FormArea;