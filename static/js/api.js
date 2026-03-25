function getToken(){
    return localStorage.getItem("token");
}

async function apiRequest(url,method="GET",data=null){
    const headers = {
        "Content-Type":"application/json"
    }

    const token = getToken();
    if (token){
        headers["Authorization"] = "Bearer " + token;
    }

    const res = await fetch(url,{
        method:method,
        headers: headers,
        body: data? JSON.stringify(data) : null
    });

    const result = await res.json();

    if(!res.ok){
        throw new Error(result.detail || "Request failed");
    }

    return result;

}


async function addProduct(){

    const product = {
        name: document.getElementById("name").value,
        description: document.getElementById("desc").value,
        price: parseFloat(document.getElementById("price").value),
        quantity: parseInt(document.getElementById("qty").value),
        image_url: document.getElementById("image_url").value || null
    }

    if(!product.name || !product.description || !product.price || !product.quantity){
    alert("All fields are required");
    return;
}

    try{
        const res = await fetch("/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + (localStorage.getItem("token") || "")
            },
            body: JSON.stringify(product),
            redirect: "manual"  // ← Add this
        });

        if (res.ok) {
            alert("Product added!");
            window.location.href = "/products-ui";
        } else if (res.status === 307 || res.status === 303) {
            // Redirect response - go to products page
            window.location.href = "/products-ui";
        } else {
            const error = await res.json();
            alert(error.detail || "Failed to add product");
        }
    } catch(err){
        alert("Error: " + err.message);
    }
}