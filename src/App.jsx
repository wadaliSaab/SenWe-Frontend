import React from 'react';
import AppNavigator from '@/navigation/AppNavigator';
import { Toaster } from 'sonner';




function App() {

   return (<>

  

 <Toaster 
  position="top-right"
  richColors
  closeButton
  duration={3000}/>

 <AppNavigator /> 
  </>
  
 )
 }

export default App;