async function loadCart(){
    const token = localStorage.getItem("token");

    const res = await fetch("/cart/",{
        headers: {"Authorization": "Bearer " + token}
    });

    const data = await res.json();
    const container = document.getElementById("cart-list");
    const summary = document.getElementById("cart-summary");
    const emptyMsg = document.getElementById("empty-msg");

    container.innerHTML = "";
    summary.classList.add("hidden");
    emptyMsg.classList.add("hidden");
    document.getElementById("cart-total").textContent = "0";

    if(data.length == 0){
        emptyMsg.classList.remove("hidden");
        return;
    }

    summary.classList.remove("hidden");

    let total = 0;

    for(const item of data){
        const productRes = await fetch(`/products/${item.product_id}`);
        const product = await productRes.json();

        total += product.price*item.quantity;

        container.innerHTML += `
        <div class="bg-white p-4 rounded shadow mb-4 flex justify-between items-center">
    <div>
        <h2 class="font-bold">${product.name}</h2>
        <p class="text-gray-500 text-sm">$${product.price} x ${item.quantity}</p>
    </div>
    <div class="flex items-center gap-4">
        <p class="font-semibold">$${(product.price * item.quantity).toFixed(2)}</p>
        <button onclick="removeFromCart(${item.id})"
        class="bg-red-500 text-white px-3 py-1 rounded text-sm">
        Remove
        </button>
    </div>
</div>
        `
    }
    document.getElementById("cart-total").textContent = total.toFixed(2);
}

async function removeFromCart(cartItemId){
    const token = localStorage.getItem("token");

    const res = await fetch(`/cart/${cartItemId}`, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + token }
    });

    if(res.ok){
        loadCart();
    } else {
        alert("Failed to remove item");
    }
}

async function checkout(){
    const token = localStorage.getItem("token");

    if(!confirm("Proceed to payment?")) return;

    // Step 1 — Create order in our DB + Razorpay
    const res = await fetch("/payments/create-order", {
        method: "POST",
        headers: { "Authorization": "Bearer " + token }
    });

    const data = await res.json();

    if(!res.ok){
        alert(data.detail || "Failed to create order");
        return;
    }

    // Step 2 — Open Razorpay popup
    const options = {
        key: data.razor,  // Replace with your Key ID
        amount: data.amount,
        currency: data.currency,
        order_id: data.razorpay_order_id,
        name: "My Store",
        description: "Order Payment",
        handler: async function(response){
            // Step 3 — Verify payment on backend
            const verifyRes = await fetch("/payments/verify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    order_id: data.order_id
                })
            });

            const verifyData = await verifyRes.json();

            if(!verifyRes.ok){
                alert(verifyData.detail || "Payment verification failed");
                return;
            }

            window.location = "/payment-success";
        },
        prefill: {
            email: ""
        },
        theme: {
            color: "#22c55e"
        }
    };

    const rzp = new Razorpay(options);
    rzp.open();
}

loadCart();