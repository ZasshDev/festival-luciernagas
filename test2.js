const start = new Date("2026-06-10T00:00:00.000Z");
const end = new Date("2026-06-11T00:00:00.000Z");
const current = new Date(start);
while (current <= end) {
  if (current.getDay() === 2) console.log("Found Tuesday using getDay!");
  if (current.getUTCDay() === 2) console.log("Found Tuesday using getUTCDay!");
  current.setDate(current.getDate() + 1);
}
