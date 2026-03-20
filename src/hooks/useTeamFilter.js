import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useQuery } from '@tanstack/react-query';
import { teamsAPI } from '../services/api';

export default function useTeamFilter() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { currentTeam, setCurrentTeam } = useStore();
    const { data: teamsRes } = useQuery({
        queryKey: ['teams'],
        queryFn: teamsAPI.getAll,
        retry: false,
    });

    // Extract the actual teams array from the API response
    const teams = teamsRes?.data?.data || [];

    // On mount: read ?team= from URL and sync to store
    useEffect(() => {
        if (!teams || teams.length === 0) return;
        const teamParam = searchParams.get('team');
        if (teamParam && teamParam !== currentTeam?.id) {
            const matchedTeam = teams.find(t => (t._id || t.id) === teamParam);
            if (matchedTeam) {
                setCurrentTeam({ id: matchedTeam._id || matchedTeam.id, name: matchedTeam.name, color: matchedTeam.color });
            } else {
                // team param doesn't match any real team — remove the stale param
                setSearchParams(prev => {
                    const next = new URLSearchParams(prev);
                    next.delete('team');
                    return next;
                }, { replace: true });
                // Clear stale team from store
                if (currentTeam?.id === teamParam) {
                    setCurrentTeam(null);
                }
            }
        }
    }, [searchParams, teams]);

    // When currentTeam changes in the store, update the URL (only for real team IDs)
    useEffect(() => {
        if (currentTeam?.id) {
            const current = searchParams.get('team');
            if (current !== currentTeam.id) {
                setSearchParams(prev => {
                    const next = new URLSearchParams(prev);
                    next.set('team', currentTeam.id);
                    return next;
                }, { replace: true });
            }
        } else {
            // No team selected — remove the param
            const current = searchParams.get('team');
            if (current) {
                setSearchParams(prev => {
                    const next = new URLSearchParams(prev);
                    next.delete('team');
                    return next;
                }, { replace: true });
            }
        }
    }, [currentTeam?.id]);
}
