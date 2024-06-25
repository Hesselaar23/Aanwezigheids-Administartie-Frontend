"use client"
import { Medewerker } from "@/lib/types";
import { useState, useEffect } from "react";
import config from '@/lib/ip_config.json';

export default function useMedewerkers() {
  const [medewerkers, setMedewerkers] = useState<Medewerker[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const ipAddress = config.ipAddress;

  useEffect(() => {
    async function fetchMedewerkers() {
      try {
        setLoading(true);
        const response = await fetch(`${ipAddress}/api/medewerkers/?pagination[page]=1&pagination[pageSize]=100`);
        const data = await response.json();
        setMedewerkers(data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching medewerkers:', error);
        setError('Failed to fetch data. Please try again.');
        setLoading(false);
      }
    }

    fetchMedewerkers();
  }, []);

  const updateMedewerker = async (medewerker: Medewerker) => {
    try {
      const response = await fetch(`${ipAddress}/api/medewerkers/${medewerker.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          data: {
            aanwezigheid: medewerker.attributes.aanwezigheid,
          } 
        }), 
      });

      if (!response.ok) {
        throw new Error('Failed to update medewerker');
      }

      const updatedMedewerker = await response.json();
      console.log(updatedMedewerker);

      console.log(updatedMedewerker);
      setMedewerkers(prevMedewerkers =>
        prevMedewerkers.map(m =>
          m.id === updatedMedewerker.data.id ? updatedMedewerker.data : m
        )
      );

      return updatedMedewerker;
    } catch (error) {
      console.error('Error updating medewerker:', error);
      setError('Failed to update medewerker. Please try again.');
    }
  };
  return { medewerkers, loading, error, updateMedewerker };
}