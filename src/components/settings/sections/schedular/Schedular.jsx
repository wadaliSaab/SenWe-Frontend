import React from "react";
import { useState } from "react";

import SchedularListView from "./views/SchedularListView";
import  SchedularDetailedView from "./views/SchedularDetailedView";



function Schedular() {
  const [listView, setListView] = useState(true);
  
  

 
    if (listView) {
     return <SchedularListView setListView={setListView} />
    } else {
       return<div className="flex-1 h-full min-h-0"><SchedularDetailedView setListView={setListView}/></div>  
      
    }
  
}

export default Schedular;
