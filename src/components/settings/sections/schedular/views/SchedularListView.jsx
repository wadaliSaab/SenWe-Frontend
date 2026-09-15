import React, { useEffect } from "react";
import { toast } from "sonner";
import { useSocket } from "../../../../../hooks/useSocket";
import MessageCard from "@/components/ui/MessageCard";
import { useProfileStore } from "@/hooks/useProfileStore";
import { PlusIcon } from "lucide-react";
import { getScheduledMessages , cancelScheduleMessage} from "../../../../../services/scheduleMessageService";
import { scheduledCardMapper } from "../../../../../utils/scheduledCardMapper";
import {apiRequest} from "../../../../../utils/apiRequest";

function SchedularListView({ setListView }) {
  const { scheduledMessages, setScheduledMessages, setSettingActions } = useProfileStore();

 const socket = useSocket();
 
  const handleClickNew = () => {

    setListView(false);
  };

  const Actions = [
    {
      id: "new",
      icon: PlusIcon,
      label: "new",
      active: "",
      onClick: () => handleClickNew(),
    },
  ];

  useEffect(() => {
    setSettingActions(Actions);
    return ()=>{

      setSettingActions([])
    }
  }, []);

    
    
    useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await getScheduledMessages();
        setScheduledMessages(res);
        
      } catch (e) {
        console.error(e);
      }
    };

    fetchMessages();
  }, []);
useEffect(() => {
  if (!socket) return;

  const handleScheduledSent = ({ scheduledMessageId }) => {
    setScheduledMessages((prev) =>
      prev.filter((m) => m._id !== scheduledMessageId)
    );
    toast.success("Scheduled message sent");
  };

  socket.on("scheduled-message-sent", handleScheduledSent);

  return () => {
    socket.off("scheduled-message-sent", handleScheduledSent);
  };
}, [socket]);

  const handleAction = async(id, action) => {
    

   
    if (action === "cancel") {
     const res = await apiRequest(() => cancelScheduleMessage(id));
      if(res?.success){
        const newScheduledMessages =scheduledMessages.filter((m) => m._id !== id);
        setScheduledMessages(newScheduledMessages);
      }else{
        console.error(res.error);
      }
      
    }
  };

  return (
    <div className="h-screen w-full bg-[#0a0e1a]">
      <div className="h-full w-full overflow-y-auto hide-scrollbar min-h-0 px-6 py-8"> <div className=" mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scheduledMessages?.map((raw) => {
          const cardProps = scheduledCardMapper(raw);
          return (
            <MessageCard
              key={cardProps.id}
              {...cardProps}
              onAction={(action) => handleAction(cardProps.id, action)}
            />
          );
        })}
      </div></div>
     
    </div>
  );
}

export default SchedularListView;