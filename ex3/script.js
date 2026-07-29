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

function validateRegisterEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email.trim() === '') return 'Email is required.';
  if (!emailPattern.test(email)) return 'Please enter a valid email address.';
  return '';
}

function validateRegisterPassword(password) {
  if (password.trim() === '') return 'Password is required.';
  if (password.length < 8) return 'Password must be at least 8 characters long.';
  if (!/[A-Z]/.test(password)) return 'Password must include at least one uppercase letter.';
  if (!/[a-z]/.test(password)) return 'Password must include at least one lowercase letter.';
  if (!/[0-9]/.test(password)) return 'Password must include at least one number.';
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return 'Password must include at least one special character.';
  }
  return '';
}

function setupRegisterValidation() {
  const registerForm = document.getElementById('registerForm');
  if (!registerForm) return;

  registerForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const emailInput = document.getElementById('exampleInputEmail1');
    const passwordInput = document.getElementById('exampleInputPassword1');
    const emailError = document.getElementById('registerEmailError');
    const passwordError = document.getElementById('registerPasswordError');

    const emailMessage = validateRegisterEmail(emailInput.value);
    const passwordMessage = validateRegisterPassword(passwordInput.value);

    emailInput.classList.remove('is-invalid', 'is-valid');
    passwordInput.classList.remove('is-invalid', 'is-valid');

    if (emailMessage) {
      emailInput.classList.add('is-invalid');
      emailError.textContent = emailMessage;
    } else {
      emailInput.classList.add('is-valid');
      emailError.textContent = '';
    }

    if (passwordMessage) {
      passwordInput.classList.add('is-invalid');
      passwordError.textContent = passwordMessage;
    } else {
      passwordInput.classList.add('is-valid');
      passwordError.textContent = '';
    }

    if (!emailMessage && !passwordMessage) {
      alert('Registration validation successful.');
      registerForm.reset();
      emailInput.classList.remove('is-valid');
      passwordInput.classList.remove('is-valid');
    }
  });
}

loadCatalog();
setupRegisterValidation();
   