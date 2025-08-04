const books = [
  {
    id: "xml-bible",
    title: "XML Bible",
    author: "Elliotte Rusty Harold",
    publication: "IDG Books",
    price: 40.5,
    category: "CSE",
    image: "images/XML Bible.jfif"
  },
  {
    id: "java-2",
    title: "Java 2",
    author: "Herbert Schildt",
    publication: "Tata McGraw Hill",
    price: 35.5,
    category: "CSE",
    image: "images/Java 2.jfif"
  },
  {
    id: "html-24",
    title: "HTML in 24 hours",
    author: "Dick Oliver",
    publication: "SAMS",
    price: 50,
    category: "ECE",
    image: "images/HTML in 24 hours.jfif"
  },
  {
    id: "ai-book",
    title: "Artificial Intelligence",
    author: "Vinod Chandra S.S. & Anand Hareendran S.",
    publication: "PHI",
    price: 63,
    category: "EEE",
    image: "images/AI Author.jfif"
  },
  {
    id: "civil-sample",
    title: "Basic Civil Engineering",
    author: "Satheesh Gopi",
    publication: "Pearson",
    price: 55,
    category: "CIVIL",
    image: "images/Civil Engineering Basics.jfif"
  },
  {
    id:"c-prog",
    title:"c programing",
    author:"Biswadi pal",
    publication:"Person",
    price:99,
    catagory:"CSE",
    image:"images/c prog.jfif"
  },
  {
    id:"abc-of-ee",
    title:"ABC of EE",
    author:"S.Chanth",
    publication:"Person",
    price:135,
    catagory:"EEE",
    image:"images/abc of ee.jfif"
  },
];

function getCart() {
  const raw = localStorage.getItem("cart");
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  document.querySelectorAll("#cart-count").forEach(el => (el.textContent = count));
}

function addToCart(bookId) {
  const cart = getCart();
  const existing = cart.find((c) => c.id === bookId);
  if (existing) existing.qty += 1;
  else {
    const b = books.find((bk) => bk.id === bookId);
    cart.push({ id: bookId, qty: 1, title: b.title, price: b.price });
  }
  saveCart(cart);
  alert("Added to cart: " + books.find((b) => b.id === bookId).title);
}

function renderBooks(filterCat = "all") {
  const grid = document.getElementById("books-grid");
  if (!grid) return;

  grid.innerHTML = "";
  const filtered = filterCat === "all" ? books : books.filter((b) => b.category === filterCat);
  filtered.forEach((b) => {
    const card = document.createElement("div");
    card.className = "book-card";
    card.innerHTML = `
  <div class="book-cover">
    <img src="${b.image}" alt="${b.title}" class="book-img" />
  </div>
  <div class="book-info">
    <h4>${b.title}</h4>
    <p><strong>Author:</strong> ${b.author}</p>
    <p><strong>Publication:</strong> ${b.publication}</p>
    <p class="price">Rs ${b.price.toFixed(2)}</p>
  </div>
  <button class="add-btn" data-id="${b.id}">Add to Cart</button>
`;
    grid.appendChild(card);
  });

  document.querySelectorAll(".add-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      addToCart(btn.dataset.id);
    });
  });
}

function setupCategoryButtons() {
  document.querySelectorAll(".cat-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const cat = btn.dataset.cat;
      document.querySelectorAll(".cat-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderBooks(cat);
    });
  });
}

function renderCartPage() {
  const cart = getCart();
  const container = document.getElementById("cart-items");
  const summary = document.getElementById("cart-summary");
  if (!container || !summary) return;

  container.innerHTML = "";
  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    summary.innerHTML = "";
    return;
  }

  let total = 0;
  cart.forEach((item) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "cart-item";

    const lineTotal = item.qty * item.price;
    total += lineTotal;

    const bookDetails = books.find(b => b.id === item.id) || {};

    itemDiv.innerHTML = `
      <div class="cart-item-image">
        <img src="${bookDetails.image || ''}" alt="${item.title}" class="book-img" style="width:auto; height:150px; object-fit:contain; border:1px solid #ccc; padding:5px; background:#fff;" />

      </div>
      <div class="cart-item-details">
        <h4>${item.title}</h4>
        <p>Price: Rs ${item.price.toFixed(2)}</p>
        <p>Quantity: ${item.qty}</p>
        <p>Subtotal: Rs ${lineTotal.toFixed(2)}</p>
      </div>
      <div>
        <button class="remove-btn" data-id="${item.id}">Remove</button>
      </div>
    `;

    container.appendChild(itemDiv);
  });

  summary.innerHTML = `
    <div><strong>Total:</strong> Rs ${total.toFixed(2)}</div>
    <button class="checkout-btn">Checkout</button>
  `;

  document.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const updated = getCart().filter((c) => c.id !== btn.dataset.id);
      saveCart(updated);
      renderCartPage(); // re-render after removing
    });
  });
}
