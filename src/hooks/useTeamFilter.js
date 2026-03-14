import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useQuery } from '@tanstack/react-query';
import { teamsAPI } from '../services/api';

export default function useTeamFilter() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { currentTeam, setCurrentTeam } = useStore();
    const { data: teamsRes } = useQuery({ queryKey: ['teams'], queryFn: teamsAPI.getAll });
    const teams = teamsRes?.data || [];

    // On mount: read ?team= from URL and sync to store
    useEffect(() => {
        const teamParam = searchParams.get('team');
        if (teamParam && teams.some(t => t.id === teamParam || t._id === teamParam) && teamParam !== currentTeam?.id) {
            const matchedTeam = teams.find(t => t.id === teamParam || t._id === teamParam);
            setCurrentTeam({ id: matchedTeam._id || matchedTeam.id, name: matchedTeam.name });
        }
    }, [searchParams, teams]);

    // When currentTeam changes, update the URL
    useEffect(() => {
        if (currentTeam) {
            const current = searchParams.get('team');
            if (current !== currentTeam.id) {
                setSearchParams(prev => {
                    const next = new URLSearchParams(prev);
                    next.set('team', currentTeam.id);
                    return next;
                }, { replace: true });
            }
        }
    }, [currentTeam?.id]);
}
