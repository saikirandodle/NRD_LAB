const catalog = [
  { id: 1, name: 'Java Programming', price: 650 },
  { id: 2, name: 'Python Essentials', price: 720 },
  { id: 3, name: 'Web Technologies', price: 580 }
];

function loadCatalog() {
  const catalogContainer = document.getElementById('content');
  if (!catalogContainer) return;

  catalogContainer.innerHTML = `
    <div class="col-12">
      <h2 class="fw-bold mb-2">Featured Books</h2>
      <p class="text-muted">Choose your next read from our curated collection.</p>
    </div>
  `;

  catalog.forEach((product) => {
    const productCard = document.createElement('div');
    productCard.className = 'col-md-4';
    productCard.innerHTML = `
      <div class="card h-100 shadow-sm product-card">
        <div class="card-body">
          <h3 class="h5 card-title">${product.name}</h3>
          <p class="text-muted mb-3">Premium edition with practical examples.</p>
          <p class="fw-bold mb-3">₹${product.price}</p>
          <button class="btn btn-primary" onclick="addToCart(${product.id})">Add to Cart</button>
        </div>
      </div>
    `;
    catalogContainer.appendChild(productCard);
  });
}

function addToCart(productId) {
  const selectedProduct = catalog.find((product) => product.id === productId);
  if (selectedProduct) {
    alert(`${selectedProduct.name} added to cart`);
  }
}

function validateLogin() {
  const username = document.getElementById('exampleInputEmail1').value;
  const password = document.getElementById('exampleInputPassword1').value;

  if (username.trim() === '' || password.trim() === '') {
    alert('Please enter both username and password.');
    return false;
  }

  if (username.length > 4) {
    alert('Success');
  } else {
    alert('Username should have more than 6 characters');
  }
  return true;
}

loadCatalog();
   