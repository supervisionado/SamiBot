// Alert module

type Alert = {
  userId: number;
  symbol: string;
  target: number;
  direction: "above" | "below";
  triggered: boolean;
};

export class AlertManager {
  private alerts: Alert[] = [];

  addAlert(userId: number, symbol: string, target: number) {
    const direction = "above"; // simple for now

    this.alerts.push({
      userId,
      symbol,
      target,
      direction,
      triggered: false
    });
  }

  checkAlerts(
    symbol: string,
    price: number,
    notify: (userId: number, message: string) => void
  ) {
    this.alerts.forEach(alert => {
      if (alert.triggered) return;
      if (alert.symbol !== symbol) return;

      if (
        (alert.direction === "above" && price >= alert.target) ||
        (alert.direction === "below" && price <= alert.target)
      ) {
        alert.triggered = true;

        notify(
          alert.userId,
          `🚨 Alert hit for ${symbol}!\nPrice: $${price}\nTarget: $${alert.target}`
        );
      }
    });
  }
}