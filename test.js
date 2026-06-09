const start = new Date("2026-06-09T00:00:00.000Z");
const end = new Date("2026-06-10T00:00:00.000Z");
const current = new Date(start);
while (current <= end) {
  console.log(current.toISOString(), current.getDay());
  if (current.getDay() === 2) console.log("Found Tuesday!");
  current.setDate(current.getDate() + 1);
}
