var config = {
  baseBet: { value: 0.00000100, type: 'balance', label: 'base bet' },
  targetPayout: { value: 2, type: 'multiplier', label: 'target' },
  stopLoss: { value: 0.01, type: 'balance', label: 'stop loss limit' }
};

function main () {
  var currentBet = config.baseBet.value;
  var lossStreak = 0;
  var totalLosses = 0;

  engine.on('GAME_STARTING', function () {
    // Place our bet
    engine.bet(currentBet, config.targetPayout.value);
  });

  engine.on('GAME_ENDED', function () {
    var lastGame = engine.history.first();

    // Check if the bet was a win
    // In Stake Dice scripts, lastGame.cashedAt or verifying payout > 0 means a win.
    if (lastGame.cashedAt) {
      log.success('Won game! Resetting bet.');
      currentBet = config.baseBet.value;
      lossStreak = 0;
    } else {
      log.error('Lost game! Doubling bet...');
      currentBet *= 2;
      lossStreak += 1;
      totalLosses += currentBet;
    }

    // Safety Stop Loss
    if (currentBet > config.stopLoss.value) {
      log.error('Stop loss reached! Stopping script.');
      engine.stop();
    }
  });
}
