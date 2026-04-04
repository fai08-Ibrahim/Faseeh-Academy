const reviewForm = document.getElementById("reviewForm");
const reviewSuccess = document.getElementById("reviewSuccess");
const submitAnother = document.getElementById("submitAnother");

if (reviewForm && reviewSuccess) {
  reviewForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!reviewForm.checkValidity()) {
      reviewForm.reportValidity();
      return;
    }

    reviewForm.hidden = true;
    reviewSuccess.hidden = false;
  });
}

if (submitAnother && reviewForm && reviewSuccess) {
  submitAnother.addEventListener("click", () => {
    reviewForm.reset();
    reviewSuccess.hidden = true;
    reviewForm.hidden = false;

    const firstInput = reviewForm.querySelector("input, select, textarea");
    if (firstInput) {
      firstInput.focus();
    }
  });
}
