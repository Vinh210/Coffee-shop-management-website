// Mock Data
const mockData = {
  users: [
    {
      id: "1",
      username: "admin",
      password: "admin123",
      full_name: "Admin System",
      role: "Admin",
      email: "admin@coffee.com",
    },
    {
      id: "2",
      username: "manager",
      password: "manager123",
      full_name: "Nguyễn Văn A",
      role: "Manager",
      email: "manager@coffee.com",
    },
    {
      id: "3",
      username: "barista",
      password: "barista123",
      full_name: "Phạm Văn D",
      role: "Barista",
      email: "barista@coffee.com",
    },
  ],
  branches: [
    {
      id: "1",
      name: "Chi nhánh Quận 1",
      address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
      phone: "0901234567",
      manager: "Nguyễn Văn A",
      revenue: 45000000,
      orders: 127,
    },
    {
      id: "2",
      name: "Chi nhánh Quận 3",
      address: "456 Võ Văn Tần, Quận 3, TP.HCM",
      phone: "0901234568",
      manager: "Trần Thị B",
      revenue: 38000000,
      orders: 98,
    },
    {
      id: "3",
      name: "Chi nhánh Bình Thạnh",
      address: "789 Điện Biên Phủ, Bình Thạnh, TP.HCM",
      phone: "0901234569",
      manager: "Lê Văn C",
      revenue: 52000000,
      orders: 143,
    },
  ],
  products: [
    {
      id: "1",
      name: "Espresso",
      price: 35000,
      category: "Cà phê nóng",
      emoji: "☕",
    },
    {
      id: "2",
      name: "Cappuccino",
      price: 45000,
      category: "Cà phê nóng",
      emoji: "☕",
    },
    {
      id: "3",
      name: "Latte",
      price: 45000,
      category: "Cà phê nóng",
      emoji: "☕",
    },
    {
      id: "4",
      name: "Americano",
      price: 40000,
      category: "Cà phê nóng",
      emoji: "☕",
    },
    {
      id: "5",
      name: "Cà Phê Sữa Đá",
      price: 35000,
      category: "Cà phê lạnh",
      emoji: "🧊",
    },
    {
      id: "6",
      name: "Iced Latte",
      price: 50000,
      category: "Cà phê lạnh",
      emoji: "🧊",
    },
    {
      id: "7",
      name: "Cold Brew",
      price: 55000,
      category: "Cà phê lạnh",
      emoji: "🧊",
    },
    {
      id: "8",
      name: "Matcha Latte",
      price: 50000,
      category: "Trà & Khác",
      emoji: "🍵",
    },
    {
      id: "9",
      name: "Bánh Croissant",
      price: 35000,
      category: "Bánh ngọt",
      emoji: "🥐",
    },
    {
      id: "10",
      name: "Bánh Muffin",
      price: 30000,
      category: "Bánh ngọt",
      emoji: "🧁",
    },
  ],
  orders: [
    {
      id: "ORD001",
      branch: "Chi nhánh Quận 1",
      user: "Phạm Văn D",
      total: 125000,
      status: "completed",
      payment: "cash",
      date: "2026-03-09 08:30",
    },
    {
      id: "ORD002",
      branch: "Chi nhánh Quận 1",
      user: "Phạm Văn D",
      total: 95000,
      status: "preparing",
      payment: "e_wallet",
      date: "2026-03-09 09:15",
    },
    {
      id: "ORD003",
      branch: "Chi nhánh Quận 3",
      user: "Trần Thị B",
      total: 180000,
      status: "completed",
      payment: "bank_transfer",
      date: "2026-03-09 07:45",
    },
  ],
};

// App State
const app = {
  currentUser: null,
  currentPage: "dashboard",
  cart: [],

  init() {
    this.checkAuth();
    this.setupEventListeners();
  },

  checkAuth() {
    const user = localStorage.getItem("currentUser");
    if (user) {
      this.currentUser = JSON.parse(user);
      this.showApp();
    } else {
      this.showLogin();
    }
  },

  setupEventListeners() {
    document.getElementById("loginForm").addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleLogin();
    });
  },

  handleLogin() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const user = mockData.users.find(
      (u) => u.username === username && u.password === password,
    );

    if (user) {
      const { password, ...userWithoutPassword } = user;
      this.currentUser = userWithoutPassword;
      localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));
      this.showApp();
    } else {
      document.getElementById("loginError").textContent =
        "Tên đăng nhập hoặc mật khẩu không đúng";
      document.getElementById("loginError").classList.remove("hidden");
    }
  },

  logout() {
    this.currentUser = null;
    localStorage.removeItem("currentUser");
    this.cart = [];
    this.showLogin();
  },

  showLogin() {
    document.getElementById("loginPage").classList.remove("hidden");
    document.getElementById("appContainer").classList.add("hidden");
  },

  showApp() {
    document.getElementById("loginPage").classList.add("hidden");
    document.getElementById("appContainer").classList.remove("hidden");
    this.updateUserInfo();
    this.renderNavigation();
    this.navigateTo("dashboard");
  },

  updateUserInfo() {
    if (this.currentUser) {
      const initials = this.currentUser.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2);
      document.getElementById("userAvatar").textContent = initials;
      document.getElementById("userName").textContent =
        this.currentUser.full_name;
      document.getElementById("userEmail").textContent = this.currentUser.email;
    }
  },

  renderNavigation() {
    const nav = [
      { id: "dashboard", name: "Dashboard", icon: "📊" },
      { id: "pos", name: "POS Bán Hàng", icon: "🛒" },
      { id: "orders", name: "Đơn Hàng", icon: "📋" },
      { id: "products", name: "Sản Phẩm", icon: "☕" },
      { id: "branches", name: "Chi Nhánh", icon: "🏪" },
    ];

    const navHtml = nav
      .map(
        (item) => `
                    <div class="nav-item ${this.currentPage === item.id ? "active" : ""}" 
                         onclick="app.navigateTo('${item.id}')">
                        <span>${item.icon}</span>
                        <span>${item.name}</span>
                    </div>
                `,
      )
      .join("");

    document.getElementById("sidebarNav").innerHTML = navHtml;
  },

  navigateTo(page) {
    this.currentPage = page;
    this.renderNavigation();
    this.renderPage();
    this.closeSidebar();
  },

  toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("open");
  },

  closeSidebar() {
    document.getElementById("sidebar").classList.remove("open");
  },

  renderPage() {
    const content = document.getElementById("mainContent");

    switch (this.currentPage) {
      case "dashboard":
        content.innerHTML = this.renderDashboard();
        break;
      case "pos":
        content.innerHTML = this.renderPOS();
        break;
      case "orders":
        content.innerHTML = this.renderOrders();
        break;
      case "products":
        content.innerHTML = this.renderProducts();
        break;
      case "branches":
        content.innerHTML = this.renderBranches();
        break;
    }
  },

  renderDashboard() {
    const totalRevenue = mockData.branches.reduce(
      (sum, b) => sum + b.revenue,
      0,
    );
    const totalOrders = mockData.branches.reduce((sum, b) => sum + b.orders, 0);

    return `
                    <div class="page-header">
                        <h1>Dashboard</h1>
                        <p>Tổng quan hoạt động chuỗi cửa hàng</p>
                    </div>
                    
                    <div class="stats-grid">
                        <div class="stat-card">
                            <h3>Doanh thu hôm nay</h3>
                            <div class="value amber">${(totalRevenue / 1000000).toFixed(1)}M</div>
                        </div>
                        <div class="stat-card">
                            <h3>Đơn hàng</h3>
                            <div class="value">${totalOrders}</div>
                        </div>
                        <div class="stat-card">
                            <h3>Chi nhánh</h3>
                            <div class="value">${mockData.branches.length}</div>
                        </div>
                        <div class="stat-card">
                            <h3>Sản phẩm</h3>
                            <div class="value">${mockData.products.length}</div>
                        </div>
                    </div>

                    <div class="card">
                        <h2>Hiệu suất chi nhánh</h2>
                        <div class="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Chi nhánh</th>
                                        <th>Địa chỉ</th>
                                        <th>Doanh thu</th>
                                        <th>Đơn hàng</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${mockData.branches
                                      .map(
                                        (b) => `
                                        <tr>
                                            <td><strong>${b.name}</strong></td>
                                            <td>${b.address}</td>
                                            <td>${(b.revenue / 1000000).toFixed(2)}M</td>
                                            <td>${b.orders}</td>
                                        </tr>
                                    `,
                                      )
                                      .join("")}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="card">
                        <h2>Đơn hàng gần đây</h2>
                        <div class="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Mã đơn</th>
                                        <th>Chi nhánh</th>
                                        <th>Số tiền</th>
                                        <th>Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${mockData.orders
                                      .map(
                                        (o) => `
                                        <tr>
                                            <td><strong>${o.id}</strong></td>
                                            <td>${o.branch}</td>
                                            <td>${o.total.toLocaleString("vi-VN")}đ</td>
                                            <td>
                                                <span class="badge badge-${o.status === "completed" ? "green" : "yellow"}">
                                                    ${o.status === "completed" ? "Hoàn thành" : "Đang pha chế"}
                                                </span>
                                            </td>
                                        </tr>
                                    `,
                                      )
                                      .join("")}
                                </tbody>
                            </table>
                        </div>
                    </div>
                `;
  },

  renderPOS() {
    return `
                    <div class="page-header">
                        <h1>POS - Bán Hàng</h1>
                        <p>Tạo đơn hàng tại quầy</p>
                    </div>

                    <div class="pos-layout">
                        <div>
                            <div class="filters">
                                <button class="filter-btn active" onclick="app.filterProducts('all')">Tất cả</button>
                                <button class="filter-btn" onclick="app.filterProducts('Cà phê nóng')">Cà phê nóng</button>
                                <button class="filter-btn" onclick="app.filterProducts('Cà phê lạnh')">Cà phê lạnh</button>
                                <button class="filter-btn" onclick="app.filterProducts('Trà & Khác')">Trà & Khác</button>
                                <button class="filter-btn" onclick="app.filterProducts('Bánh ngọt')">Bánh ngọt</button>
                            </div>
                            <div class="products-grid" id="productsGrid">
                                ${mockData.products
                                  .map(
                                    (p) => `
                                    <div class="product-card" onclick="app.addToCart('${p.id}')">
                                        <div class="product-image">${p.emoji}</div>
                                        <div class="product-name">${p.name}</div>
                                        <div class="product-category">${p.category}</div>
                                        <div class="product-price">${p.price.toLocaleString("vi-VN")}đ</div>
                                    </div>
                                `,
                                  )
                                  .join("")}
                            </div>
                        </div>
                        
                        <div class="cart-panel" id="cartPanel">
                            ${this.renderCart()}
                        </div>
                    </div>
                `;
  },

  renderCart() {
    const total = this.cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    return `
                    <h2>Đơn hàng (${this.cart.length})</h2>
                    <div class="cart-items">
                        ${
                          this.cart.length === 0
                            ? '<p style="text-align:center;color:#999;padding:2rem 0">Chưa có sản phẩm</p>'
                            : this.cart
                                .map(
                                  (item, index) => `
                                <div class="cart-item">
                                    <div class="cart-item-info">
                                        <div class="cart-item-name">${item.name}</div>
                                        <div class="cart-item-price">${item.price.toLocaleString("vi-VN")}đ</div>
                                    </div>
                                    <div class="cart-item-controls">
                                        <button class="btn-qty" onclick="app.updateCartQty(${index}, -1)">-</button>
                                        <span style="min-width:20px;text-align:center">${item.quantity}</span>
                                        <button class="btn-qty" onclick="app.updateCartQty(${index}, 1)">+</button>
                                        <button class="btn-qty" onclick="app.removeFromCart(${index})" style="color:red">×</button>
                                    </div>
                                </div>
                            `,
                                )
                                .join("")
                        }
                    </div>
                    
                    <div class="cart-total">
                        <div class="cart-total-row">
                            <span class="cart-total-label">Tổng cộng:</span>
                            <span class="cart-total-value">${total.toLocaleString("vi-VN")}đ</span>
                        </div>
                    </div>

                    <button class="btn btn-primary" onclick="app.checkout()" ${this.cart.length === 0 ? "disabled" : ""}>
                        Thanh toán
                    </button>
                `;
  },

  addToCart(productId) {
    const product = mockData.products.find((p) => p.id === productId);
    const existingItem = this.cart.find((item) => item.id === productId);

    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.cart.push({ ...product, quantity: 1 });
    }

    document.getElementById("cartPanel").innerHTML = this.renderCart();
  },

  updateCartQty(index, change) {
    this.cart[index].quantity += change;
    if (this.cart[index].quantity <= 0) {
      this.cart.splice(index, 1);
    }
    document.getElementById("cartPanel").innerHTML = this.renderCart();
  },

  removeFromCart(index) {
    this.cart.splice(index, 1);
    document.getElementById("cartPanel").innerHTML = this.renderCart();
  },

  checkout() {
    if (this.cart.length === 0) return;

    const total = this.cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    alert(`Đơn hàng đã được tạo!\nTổng: ${total.toLocaleString("vi-VN")}đ`);
    this.cart = [];
    document.getElementById("cartPanel").innerHTML = this.renderCart();
  },

  filterProducts(category) {
    // Update active filter button
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.classList.remove("active");
      if (
        btn.textContent === category ||
        (category === "all" && btn.textContent === "Tất cả")
      ) {
        btn.classList.add("active");
      }
    });

    // Filter products
    const filtered =
      category === "all"
        ? mockData.products
        : mockData.products.filter((p) => p.category === category);
    document.getElementById("productsGrid").innerHTML = filtered
      .map(
        (p) => `
                    <div class="product-card" onclick="app.addToCart('${p.id}')">
                        <div class="product-image">${p.emoji}</div>
                        <div class="product-name">${p.name}</div>
                        <div class="product-category">${p.category}</div>
                        <div class="product-price">${p.price.toLocaleString("vi-VN")}đ</div>
                    </div>
                `,
      )
      .join("");
  },

  renderOrders() {
    return `
                    <div class="page-header">
                        <h1>Quản lý Đơn Hàng</h1>
                        <p>Theo dõi tất cả đơn hàng</p>
                    </div>

                    <div class="stats-grid">
                        <div class="stat-card">
                            <h3>Tổng đơn</h3>
                            <div class="value">${mockData.orders.length}</div>
                        </div>
                        <div class="stat-card">
                            <h3>Hoàn thành</h3>
                            <div class="value" style="color:#16a34a">${mockData.orders.filter((o) => o.status === "completed").length}</div>
                        </div>
                        <div class="stat-card">
                            <h3>Đang xử lý</h3>
                            <div class="value" style="color:#ca8a04">${mockData.orders.filter((o) => o.status === "preparing").length}</div>
                        </div>
                        <div class="stat-card">
                            <h3>Tổng doanh thu</h3>
                            <div class="value amber">${(mockData.orders.reduce((sum, o) => sum + o.total, 0) / 1000000).toFixed(1)}M</div>
                        </div>
                    </div>

                    <div class="card">
                        <h2>Danh sách đơn hàng</h2>
                        <div class="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Mã đơn</th>
                                        <th>Chi nhánh</th>
                                        <th>Nhân viên</th>
                                        <th>Thời gian</th>
                                        <th>Số tiền</th>
                                        <th>Thanh toán</th>
                                        <th>Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${mockData.orders
                                      .map(
                                        (o) => `
                                        <tr>
                                            <td><strong>${o.id}</strong></td>
                                            <td>${o.branch}</td>
                                            <td>${o.user}</td>
                                            <td>${o.date}</td>
                                            <td><strong>${o.total.toLocaleString("vi-VN")}đ</strong></td>
                                            <td>${o.payment === "cash" ? "Tiền mặt" : o.payment === "bank_transfer" ? "Chuyển khoản" : "Ví điện tử"}</td>
                                            <td>
                                                <span class="badge badge-${o.status === "completed" ? "green" : "yellow"}">
                                                    ${o.status === "completed" ? "Hoàn thành" : "Đang pha chế"}
                                                </span>
                                            </td>
                                        </tr>
                                    `,
                                      )
                                      .join("")}
                                </tbody>
                            </table>
                        </div>
                    </div>
                `;
  },

  renderProducts() {
    return `
                    <div class="header-actions">
                        <div class="page-header">
                            <h1>Quản lý Sản Phẩm</h1>
                            <p>Quản lý menu và giá sản phẩm</p>
                        </div>
                    </div>

                    <div class="stats-grid">
                        <div class="stat-card">
                            <h3>Cà phê nóng</h3>
                            <div class="value">${mockData.products.filter((p) => p.category === "Cà phê nóng").length}</div>
                        </div>
                        <div class="stat-card">
                            <h3>Cà phê lạnh</h3>
                            <div class="value">${mockData.products.filter((p) => p.category === "Cà phê lạnh").length}</div>
                        </div>
                        <div class="stat-card">
                            <h3>Trà & Khác</h3>
                            <div class="value">${mockData.products.filter((p) => p.category === "Trà & Khác").length}</div>
                        </div>
                        <div class="stat-card">
                            <h3>Bánh ngọt</h3>
                            <div class="value">${mockData.products.filter((p) => p.category === "Bánh ngọt").length}</div>
                        </div>
                    </div>

                    <div class="card">
                        <h2>Danh sách sản phẩm</h2>
                        <div class="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Sản phẩm</th>
                                        <th>Danh mục</th>
                                        <th>Giá</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${mockData.products
                                      .map(
                                        (p) => `
                                        <tr>
                                            <td>
                                                <div style="display:flex;align-items:center;gap:0.75rem">
                                                    <span style="font-size:1.5rem">${p.emoji}</span>
                                                    <strong>${p.name}</strong>
                                                </div>
                                            </td>
                                            <td>${p.category}</td>
                                            <td><strong style="color:var(--amber-800)">${p.price.toLocaleString("vi-VN")}đ</strong></td>
                                        </tr>
                                    `,
                                      )
                                      .join("")}
                                </tbody>
                            </table>
                        </div>
                    </div>
                `;
  },

  renderBranches() {
    return `
                    <div class="header-actions">
                        <div class="page-header">
                            <h1>Quản lý Chi Nhánh</h1>
                            <p>Quản lý thông tin các chi nhánh cửa hàng</p>
                        </div>
                    </div>

                    <div class="stats-grid">
                        <div class="stat-card">
                            <h3>Tổng chi nhánh</h3>
                            <div class="value">${mockData.branches.length}</div>
                        </div>
                        <div class="stat-card">
                            <h3>Tổng doanh thu hôm nay</h3>
                            <div class="value amber">${(mockData.branches.reduce((sum, b) => sum + b.revenue, 0) / 1000000).toFixed(1)}M</div>
                        </div>
                        <div class="stat-card">
                            <h3>Tổng đơn hàng hôm nay</h3>
                            <div class="value">${mockData.branches.reduce((sum, b) => sum + b.orders, 0)}</div>
                        </div>
                    </div>

                    <div class="card">
                        <h2>Danh sách chi nhánh</h2>
                        <div class="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Chi nhánh</th>
                                        <th>Địa chỉ</th>
                                        <th>Số điện thoại</th>
                                        <th>Quản lý</th>
                                        <th>Doanh thu</th>
                                        <th>Đơn hàng</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${mockData.branches
                                      .map(
                                        (b) => `
                                        <tr>
                                            <td><strong>${b.name}</strong></td>
                                            <td>${b.address}</td>
                                            <td>${b.phone}</td>
                                            <td>${b.manager}</td>
                                            <td><strong style="color:var(--amber-800)">${(b.revenue / 1000000).toFixed(1)}M</strong></td>
                                            <td><strong>${b.orders}</strong></td>
                                        </tr>
                                    `,
                                      )
                                      .join("")}
                                </tbody>
                            </table>
                        </div>
                    </div>
                `;
  },
};

// Initialize app
app.init();
