import json

file_path = r"c:\Users\shoaib\Downloads\bet-archive (1).json"
try:
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    total_bets = len(data)
    total_wagered = sum(b.get("data", {}).get("amount", 0) for b in data)
    total_payout = sum(b.get("data", {}).get("payout", 0) for b in data)
    wins = sum(1 for b in data if b.get("data", {}).get("payout", 0) > 0)
    
    max_w_s = 0
    max_l_s = 0
    cur_w = 0
    cur_l = 0
    for b in data:
        if b.get("data", {}).get("payout", 0) > 0:
            cur_w += 1
            cur_l = 0
            if cur_w > max_w_s: max_w_s = cur_w
        else:
            cur_l += 1
            cur_w = 0
            if cur_l > max_l_s: max_l_s = cur_l

    print(f"Total Bets: {total_bets}")
    print(f"Total Wagered (BNB): {total_wagered:.8f}")
    print(f"Total Payout (BNB): {total_payout:.8f}")
    profit = total_payout - total_wagered
    print(f"Profit (BNB): {profit:.8f}")
    print(f"Win Rate: {wins/total_bets*100:.2f}%")
    print(f"Max Win Streak: {max_w_s}")
    print(f"Max Loss Streak: {max_l_s}")
except Exception as e:
    print(f"Error: {e}")
