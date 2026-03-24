function showAlert(message, type) {
    const box = document.getElementById("alert-box");
    box.textContent = message;
    box.style.display = "block";
    if (type === "success") {
        box.style.background = "#dcfce7";
        box.style.color = "#166534";
        box.style.border = "1px solid #bbf7d0";
    } else {
        box.style.background = "#fee2e2";
        box.style.color = "#991b1b";
        box.style.border = "1px solid #fecaca";
    }
    box.scrollIntoView({ behavior: "smooth", block: "center" });
}

async function submitApplication() {
    const fields = [
        "full_name", "father_name", "date_of_birth", "gender", "category",
        "email", "phone", "address", "qualification", "institution",
        "specialization", "cgpa", "department", "duration_weeks", "mode", "available_from"
    ];

    for (const field of fields) {
        const el = document.getElementById(field);
        if (!el || !el.value.trim()) {
            showAlert("Please fill in all required fields.", "error");
            el && el.scrollIntoView({ behavior: "smooth", block: "center" });
            el && (el.style.borderColor = "#ef4444");
            return;
        }
        el.style.borderColor = "#e2e8f0";
    }

    if (!document.getElementById("declaration").checked) {
        showAlert("Please accept the declaration to proceed.", "error");
        return;
    }

    const phone = document.getElementById("phone").value.trim();
    if (!/^\d{10,15}$/.test(phone)) {
        showAlert("Please enter a valid phone number (10-15 digits).", "error");
        document.getElementById("phone").style.borderColor = "#ef4444";
        return;
    }

    const btn = document.getElementById("submit-btn");
    btn.disabled = true;
    btn.textContent = "Submitting…";

    const payload = {
        full_name: document.getElementById("full_name").value.trim(),
        father_name: document.getElementById("father_name").value.trim(),
        date_of_birth: document.getElementById("date_of_birth").value,
        gender: document.getElementById("gender").value,
        category: document.getElementById("category").value,
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        address: document.getElementById("address").value.trim(),
        qualification: document.getElementById("qualification").value,
        institution: document.getElementById("institution").value.trim(),
        specialization: document.getElementById("specialization").value.trim(),
        cgpa: document.getElementById("cgpa").value.trim(),
        department: document.getElementById("department").value,
        duration_weeks: parseInt(document.getElementById("duration_weeks").value),
        mode: document.getElementById("mode").value,
        available_from: document.getElementById("available_from").value
    };

    try {
        const res = await fetch("/applications/apply", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (!res.ok) {
            const detail = Array.isArray(data.detail)
                ? data.detail.map(e => e.msg).join(", ")
                : (data.detail || "Submission failed. Please try again.");
            showAlert(detail, "error");
            btn.disabled = false;
            btn.textContent = "Submit Application →";
            return;
        }

        showAlert(
            `✅ Application submitted successfully! Your reference ID is #${data.id}. We will contact you at ${data.email}.`,
            "success"
        );
        btn.textContent = "Application Submitted ✓";

    } catch (err) {
        showAlert("Network error. Please check your connection and try again.", "error");
        btn.disabled = false;
        btn.textContent = "Submit Application →";
    }
}
