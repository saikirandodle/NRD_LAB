const catalog = [
    {id:1, name:'Product1', price:20},
    {id:2, name:'Product2', price:30},
    {id:3, name:'Product3', price:25},
    ];
    //Function to load the catalog 
    function loadCatalog() {
    const catalogContainer=document.getElementById('content'); 
    catalogContainer.innerHTML = '<h2>Cart</h2>'; 
    catalog.forEach(product => {
    const productCard=document.createElement('div');
     productCard.classList.add('product-card'); productCard.innerHTML = `
    <h3>${product.name}</h3>
    <p>$${product.price}</p>
    <button onclick="addToCart(${product.id})">AddtoCart</button>
    `; 
    catalogContainer.appendChild(productCard);
    });
    }
    //Function to add a product to the cart 
    //Implement cart functionality here
    function addToCart(productId) {
    console.log(`Product ${productId} added to cart`);
    }
    
    // Initial load 
    loadCatalog();

   
  
   
   