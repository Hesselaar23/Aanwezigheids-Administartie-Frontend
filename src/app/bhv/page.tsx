'use client'
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import useMedewerkers from "../api/useMedewerkers";
import { Checkbox } from "@/components/ui/checkbox";
import { Medewerker } from "@/lib/types";
import { Label } from '@/components/ui/label';

export default function bhv() {

  const { medewerkers } = useMedewerkers();
  const aanwezigen = medewerkers.filter(medewerker => medewerker.attributes.aanwezigheid === 'aanwezig');

  const [save, setSave] = useState<string[]>([]);
  const [flagged, setFlagged] = useState<string[]>([]);

  const RenderMedewerker = ({medewerker, color} : {medewerker : Medewerker , color : string}) => {

  return (
    <Card key={medewerker.id} className=" h-20em ml-2 mr-2 mb-1" style={{ backgroundColor: color }} >
      <CardHeader>
        <CardTitle  style={{ fontSize: '1-em', whiteSpace: 'nowrap' }}>
          <div className="flex max-sm:flex-col justify-between w-full gap-2">
            {`${medewerker.attributes.voornaam} ${medewerker.attributes.tussenvoegsels || ''} ${medewerker.attributes.achternaam}`}
            <div className="flex gap-4 justify-end">
              <div className="flex items-center space-x-2">
                <Label htmlFor={`save[${medewerker.id}]`} >Aanwezig</Label>
                <Checkbox 
                  id={`save[${medewerker.id}]`} 
                  checked={save.includes(medewerker.id)} 
                  onCheckedChange={(s) => {
                    setSave(s ? [...save, medewerker.id] : save.filter(id => id != medewerker.id));
                    if (s) setFlagged(flagged.filter((id) => id != medewerker.id));
                  }} 
                />
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor={`flagg[${medewerker.id}]`}>Markeer</Label>
                <Checkbox 
                  id={`flagg[${medewerker.id}]`}  
                  checked={flagged.includes(medewerker.id)} 
                  onCheckedChange={(f) => {
                    setFlagged(f ? [...flagged, medewerker.id] : flagged.filter(id => id != medewerker.id));
                    if (f) setSave(save.filter((id) => id != medewerker.id));
                  }} 
                />
              </div>
            </div>
          </div>

        </CardTitle>
      </CardHeader>
    </Card>
  );
}

  return (
    <div className="font-bold h-screen flex flex-col items-center">
          <h1 className=" text-4xl mb-4 text-center">Ontruiming van {aanwezigen.length} aanwezigen</h1>
      <div className="grid grid-cols-1 w-full">
        {aanwezigen.filter((m) => flagged.includes(m.id)).map((medewerker) => <RenderMedewerker medewerker={medewerker} color = "rgba(255, 0, 0, 0.5)" />)}
        {aanwezigen.filter((m) => !save.includes(m.id) && !flagged.includes(m.id)).map((medewerker) => <RenderMedewerker medewerker={medewerker} color = "#d9d9d9" />)}
        {aanwezigen.filter((m) => save.includes(m.id)).map((medewerker) => <RenderMedewerker medewerker={medewerker} color = "rgba(0, 255, 0, 0.3)" />)}
      </div>
    </div>
  );
}
