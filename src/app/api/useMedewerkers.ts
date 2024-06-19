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
        const response = await fetch(`http://${ipAddress}:1337/api/medewerkers/?pagination[page]=1&pagination[pageSize]=100`);
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
      const response = await fetch(`http://${ipAddress}:1337/api/medewerkers/${medewerker.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `9f0a1bea823651d2e8bfb00c5c4f2aecf5414608f0dd210ba7757d08a989edb9eef625b8f9e0ca611c91d1e969d07b06593d87fbaf9356159696b1d5198f29946f84f5022a257403d4c03eb311f4e811261cb7720fc49e4e2c414d5dde99cf64691087b2c54e55bf1050684b108919f26ecfe570ef680618b38fe12da97395ae`
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