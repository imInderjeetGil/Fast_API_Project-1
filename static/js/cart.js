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

function checkout(){
    // Will be implemented in Phase 3
    alert("Checkout coming soon!");
}

loadCart();