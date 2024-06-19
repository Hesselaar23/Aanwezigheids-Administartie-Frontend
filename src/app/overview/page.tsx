'use client'
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import useMedewerkers from "../api/useMedewerkers";
import { Medewerker } from "@/lib/types";
import config from '@/lib/ip_config.json';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";




export default function Overview() {
  const { medewerkers, loading, error, updateMedewerker } = useMedewerkers();
  const ipAddress = config.ipAddress;
  const [cardColors, setCardColors] = useState<{ [key: string]: string }>({});
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = async (medewerker: Medewerker) => {
    let newStatus: 'aanwezig' | 'afwezig' | 'extern';
    if (medewerker.attributes.aanwezigheid === 'extern') {
      newStatus = 'aanwezig';
    } else {
      newStatus = medewerker.attributes.aanwezigheid === 'aanwezig' ? 'afwezig' : 'aanwezig';
    }
  
    const updatedMedewerker = {
      ...medewerker,
      attributes: {
          ...medewerker.attributes,
         aanwezigheid: newStatus,
        id : medewerker.id
      },
    }; 

    updateMedewerker(updatedMedewerker);
    
  };
  
  useEffect(() => {
    const updatedCardColors: { [key: string]: string } = {};
    medewerkers.forEach((medewerker) => {
      let color: string;
      if (medewerker.attributes.aanwezigheid === 'aanwezig') {
        color = '#E0045C';
      } else if (medewerker.attributes.aanwezigheid === 'extern') {
        color = '#04B4E0';
      } else {
        color = '#ffffff';
      }
      updatedCardColors[medewerker.id] = color;
    });
    setCardColors(updatedCardColors);
  }, [medewerkers]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error)  {
    return <div>{error}</div>;
  }
  
  const data = medewerkers.sort((a, b) => a.attributes.voornaam.localeCompare(b.attributes.voornaam));
  const chunkSize = 7;
  const rowCount = Math.round(data.length / chunkSize);
  const remainderCount = data.length % rowCount;
  const divCount = remainderCount === 0 ? 0 : rowCount - remainderCount;

  const chunks = data.reduce((prev, curr, i) => {
    i = Math.floor(i / rowCount);
    if (!prev[i]) prev[i] = [];
    prev[i].push(curr);
    return prev;
  }, []); 
  const RenderMedewerker = (({medewerker} : {medewerker : Medewerker}) => {

    const color = cardColors[medewerker.id] || '#ffffff'; 
    const textColor = medewerker.attributes.aanwezigheid === 'afwezig' ? '#000000' : '#ffffff'; 
  
  return (
    <Card key={medewerker.id} className="flex-auto m-2 select-none" style={{ backgroundColor: color }} onClick={() => handleClick(medewerker)}>
      <CardHeader className="flex items-center justify-center h-full">
        <CardTitle style={{ color: textColor, fontSize: '1vw', whiteSpace: 'nowrap' }}>
          {`${medewerker.attributes.voornaam} ${medewerker.attributes.tussenvoegsels || ''} ${medewerker.attributes.achternaam}`}
        </CardTitle>
      </CardHeader>
    </Card>
  );
})

  return (
    <div className="font-bold h-screen flex flex-col items-center select-none">
      <div className="w-full flex justify-between items-center px-4 py-2">
        <div className="flex items-center">
          <img src={`http://${ipAddress}:1337/uploads/kega_logo_b6a3f0a522.png`} className="h-20 w-auto" />
          <img src={`http://${ipAddress}:1337/uploads/keephub_logo_cf719ef978.png`} className="h-20 w-auto" />
        </div>
        <div className="flex items-center">
          <h1 className="text-6xl" onClick={() => setIsOpen(true)}>Aanwezigheid</h1>
        </div>
        <div className="flex items-center"> 
          <h1 className="mr-4 text-2xl">Aantal <br/> aanwezigen</h1>
          <div className="text-4xl text-custom-pink rounded-full h-20 w-20 flex items-center justify-center border-4 border-custom-pink">
            {medewerkers.filter(medewerker => medewerker.attributes.aanwezigheid === 'aanwezig').length}
          </div>
        </div>
      </div>
      <div className="flex gap-1 justify-center w-screen h-screen">
        {chunks.map((chunk, index) => (
          <div className="flex flex-col gap-1 flex-grow" style={{flex: 1}}>
            {chunk.map((medewerker : Medewerker) => <RenderMedewerker medewerker={medewerker} />)}
            {index === chunks.length - 1 && Array.from({ length: divCount }).map((_, i) => 
              <div key={i} className="rounded-lg border text-card-foreground flex-auto m-2 select-none" >
                <div className="flex-col space-y-1.5 p-4 flex items-center justify-center h-full">
                  <h3 className="text-2xl font-semibold leading-none tracking-tight" style={{color: 'white', fontSize: '1vw', whiteSpace: 'nowrap'}}>Div</h3>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <AlertDialog open={isOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Want to enter fullscreen?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              if (document.exitFullscreen) {
                document.exitFullscreen();
              }
              setIsOpen(false)
              }}>NO</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
        } 
        setIsOpen(false);
      }}>Yes</AlertDialogAction>  
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
