'use client';

const MAX_PER_TEAM = 3;

export default function Page() {
  const teamCounts = [
    { team_id: 'rams', players_selected: 1 },
    { team_id: 'bills', players_selected: 3 },
  ];

  function remainingSlots(teamId: string) {
    const row = teamCounts.find(t => t.team_id === teamId);

    if (!row) {
      return MAX_PER_TEAM;
    }

    return MAX_PER_TEAM - row.players_selected;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Team Limits Test</h1>

      <p>Rams remaining: {remainingSlots('rams')}</p>
      <p>Bills remaining: {remainingSlots('bills')}</p>
    </div>
  );
}