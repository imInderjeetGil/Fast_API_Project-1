let page = 1;
const limit = 5;


async function loadProducts(){
    const token = localStorage.getItem("token");
    const isAdmin = token ? JSON.parse(atob(token.split('.')[1])).role === "admin" : false;
    const res = await fetch(`/products?page=${page}&limit=${limit}`);
    const data = await res.json();

    const container = document.getElementById("product-list");
    container.innerHTML = "";

    data.forEach(p => {
        container.innerHTML += `
<div class="bg-white p-6 rounded-lg shadow mb-4">

    <h2 class="text-xl font-bold">${p.name}</h2>

    <p class="text-gray-600 mt-1">${p.description}</p>

    <p class="mt-2 font-semibold">Amount: $${p.price}</p>

    <p class="text-sm text-gray-500">Qty: ${p.quantity}</p>

    <div class="mt-4 flex gap-2">

    ${!isAdmin ? `
    </button><button onclick="addToCart(${p.id})"
    class="bg-green-500 text-white px-3 py-1 rounded">
    Add to Cart
    </button>
    ` : ''}

    ${isAdmin ? `
    <button onclick="editProduct(${p.id})"
    class="bg-blue-500 text-white px-3 py-1 rounded">
    Edit
    </button>

    <button onclick="deleteProduct(${p.id})"
    class="bg-red-500 text-white px-3 py-1 rounded">
    Delete
    </button>
    ` : ''}

    </div>

</div>
`;
    });
}

async function nextPage(){

    const res = await fetch(`/products?page=${page+1}&limit=${limit}`);
    const data = await res.json();

    if(data.length === 0){
        alert("No more products");
        return;
    }

    page++;
    loadProducts();
}

function prevPage(){
    if(page>1){
        page--;
        loadProducts();
    }
}

loadProducts();

async function deleteProduct(id){

    const token = localStorage.getItem("token");

    if(!token){
        alert("Login required");
        return;
    }

    if(!confirm("Delete this product?")) return;

    const res = await fetch(`/products/${id}`,{
        method:"DELETE",
        headers:{
            "Authorization":"Bearer " + token
        }
    });

    const data = await res.json();

    if(!res.ok){
        alert(data.detail || "Delete failed");
        return;
    }

    alert("Product deleted");

    loadProducts();
}


function editProduct(id){
    window.location = `/edit-product-ui?id=${id}`;
}


async function addToCart(productId){
    const token = localStorage.getItem("token");
    if(!token){
        alert("Please login first");
        window.location = "/login-ui";
        return;
    }

    const res = await fetch("/cart/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ product_id: productId, quantity: 1 })
    });

    const data = await res.json();

    if(!res.ok){
        alert(data.detail || "Failed to add to cart");
        return;
    }

    alert("Added to cart!");
}