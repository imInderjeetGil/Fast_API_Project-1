async function loadOrders(){
    const token = localStorage.getItem("token");

    const res = await fetch("/orders/my-orders", {
        headers: { "Authorization": "Bearer " + token }
    });

    const data = await res.json();
    const container = document.getElementById("orders-list");
    const emptyMsg = document.getElementById("empty-msg");

    container.innerHTML = "";

    if(data.length === 0){
        emptyMsg.classList.remove("hidden");
        return;
    }

    for(const order of data){
        // Fetch product names for each item
        const itemsHtml = await Promise.all(order.items.map(async item => {
            const productRes = await fetch(`/products/${item.product_id}`);
            const product = await productRes.json();
            return `
                <div class="flex justify-between text-sm text-gray-600 py-1 border-b">
                    <span>${product.name} x ${item.quantity}</span>
                    <span>$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            `;
        }));

        container.innerHTML += `
<div class="bg-white p-6 rounded shadow mb-6">

    <div class="flex justify-between items-center mb-4">
        <h2 class="font-bold text-lg">Order #${order.id}</h2>
        <span class="text-sm px-3 py-1 rounded-full ${
            order.status === 'paid' ? 'bg-green-100 text-green-600' :
            order.status === 'cancelled' ? 'bg-red-100 text-red-600' :
            'bg-yellow-100 text-yellow-600'
        }">${order.status}</span>
    </div>

    <div class="mb-4">
        ${itemsHtml.join("")}
    </div>

    <div class="flex justify-between font-semibold">
        <span>Total</span>
        <span>$${order.total_amount.toFixed(2)}</span>
    </div>

    <p class="text-xs text-gray-400 mt-2">${new Date(order.created_at).toLocaleString()}</p>

</div>
`;
    }
}

loadOrders();