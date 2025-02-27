document.addEventListener("DOMContentLoaded", () => {
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("absenceStart").setAttribute("min", today);
  document.getElementById("absenceEnd").setAttribute("min", today);

  // Automatically adjust the "End Date" based on "Start Date"
  const startDate = document.getElementById("absenceStart");
  const endDate = document.getElementById("absenceEnd");

  startDate.addEventListener("change", (e) => {
    const selectedDate = e.target.value;
    endDate.setAttribute("min", selectedDate);
  });
});
