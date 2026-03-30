const fs = require('fs');

const filePath = 'C:\\\\Users\\\\shoaib\\\\Downloads\\\\bet-archive (1).json';

try {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const totalBets = data.length;
  let totalWagered = 0;
  let totalPayout = 0;
  let wins = 0;
  let losses = 0;

  let maxWinStreak = 0;
  let maxLossStreak = 0;
  let currentWinStreak = 0;
  let currentLossStreak = 0;

  let conditions = {};

  for (const bet of data) {
    const d = bet.data || {};
    const amount = d.amount || 0;
    const payout = d.payout || 0;
    const stateDice = d.stateDice || {};
    const condition = stateDice.condition;
    
    if (condition) {
       conditions[condition] = (conditions[condition] || 0) + 1;
    }

    totalWagered += amount;
    totalPayout += payout;

    if (payout > 0) {
      wins++;
      currentWinStreak++;
      currentLossStreak = 0;
      if (currentWinStreak > maxWinStreak) maxWinStreak = currentWinStreak;
    } else {
      losses++;
      currentLossStreak++;
      currentWinStreak = 0;
      if (currentLossStreak > maxLossStreak) maxLossStreak = currentLossStreak;
    }
  }

  console.log(`Total Bets: ${totalBets}`);
  console.log(`Total Wagered: ${totalWagered.toFixed(8)} BNB`);
  console.log(`Total Payout:  ${totalPayout.toFixed(8)} BNB`);
  console.log(`Net Profit:    ${(totalPayout - totalWagered).toFixed(8)} BNB`);
  console.log(`Win Rate:      ${((wins / totalBets) * 100).toFixed(2)}%`);
  console.log(`Max Win Streak:  ${maxWinStreak}`);
  console.log(`Max Loss Streak: ${maxLossStreak}`);
  console.log(`Conditions:    ${JSON.stringify(conditions)}`);
} catch (e) {
  console.error('Error analyzing the file:', e.message);
}
