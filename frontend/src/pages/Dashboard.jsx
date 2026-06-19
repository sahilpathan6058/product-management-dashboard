import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./Dashboard.css";

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productForm, setProductForm] = useState({
    name: "",
    category: "",
    price: "",
  });
  const [formMessage, setFormMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({
    text: "",
    type: "",
  });

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username") || "";
  const role = (localStorage.getItem("role") || "").toUpperCase();
  const isAdmin = role === "ADMIN";

  useEffect(() => {
    if (!toast.text) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setToast({
        text: "",
        type: "",
      });
    }, 2500);

    return () => window.clearTimeout(timer);
  }, [toast]);

  function showToast(text, type) {
    setToast({
      text,
      type,
    });
  }

  async function fetchProducts() {
    setIsLoading(true);

    try {
      const response = await api.get("/products");
      setProducts(response.data);
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        handleLogout();
        return;
      }

      showToast("Failed to load products.", "error");
    } finally {
      setIsLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    navigate("/", { replace: true });
  }

  useEffect(() => {
    if (!token || !username || !role) {
      navigate("/", { replace: true });
      return;
    }

    async function loadProducts() {
      setIsLoading(true);

      try {
        const response = await api.get("/products");
        setProducts(response.data);
      } catch (error) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("username");
          localStorage.removeItem("role");
          navigate("/", { replace: true });
          return;
        }

        setToast({
          text: "Failed to load products.",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, [navigate, role, token, username]);

  const openAddModal = () => {
    if (!isAdmin) {
      return;
    }

    setEditingProductId(null);
    setProductForm({
      name: "",
      category: "",
      price: "",
    });
    setFormMessage("");
    setShowProductModal(true);
  };

  const openEditModal = (product) => {
    if (!isAdmin) {
      return;
    }

    setEditingProductId(product.id);
    setProductForm({
      name: product.name || "",
      category: product.category || "",
      price: product.price ?? "",
    });
    setFormMessage("");
    setShowProductModal(true);
  };

  const closeProductModal = () => {
    if (isSaving) {
      return;
    }

    setShowProductModal(false);
    setEditingProductId(null);
    setFormMessage("");
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setProductForm({
      ...productForm,
      [name]: value,
    });
  };

  const saveProduct = async (event) => {
    event.preventDefault();

    const payload = {
      name: productForm.name.trim(),
      category: productForm.category.trim(),
      price: Number(productForm.price),
    };

    if (
      !payload.name ||
      !payload.category ||
      productForm.price === "" ||
      Number.isNaN(payload.price) ||
      payload.price < 0
    ) {
      setFormMessage("Please enter valid product details.");
      return;
    }

    setIsSaving(true);
    setFormMessage("");

    try {
      if (editingProductId) {
        await api.put(`/products/${editingProductId}`, payload);
        showToast("Product updated", "success");
      } else {
        await api.post("/products", payload);
        showToast("Product added", "success");
      }

      setShowProductModal(false);
      setEditingProductId(null);
      await fetchProducts();
    } catch (error) {
      if (error.response?.status === 401) {
        handleLogout();
        return;
      }

      if (error.response?.status === 403) {
        setFormMessage("Access denied. Only admins can save products.");
      } else {
        setFormMessage("Failed to save the product.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const askDelete = (id) => {
    if (!isAdmin) {
      return;
    }

    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const closeDeleteConfirm = () => {
    setDeleteId(null);
    setShowDeleteConfirm(false);
  };

  const confirmDeleteProduct = async () => {
    if (!deleteId) {
      return;
    }

    try {
      await api.delete(`/products/${deleteId}`);
      closeDeleteConfirm();
      showToast("Product deleted", "error");
      fetchProducts();
    } catch (error) {
      closeDeleteConfirm();
      if (error.response?.status === 403) {
        showToast("Access denied. Only admins can delete products.", "error");
      } else {
        showToast("Failed to delete the product.", "error");
      }
    }
  };

  const categories = [
    ...new Set(products.map((product) => product.category).filter(Boolean)),
  ];
  const handleCategoryFilter = (nextCategory) => {
    setCategory(nextCategory);
    setCurrentPage(1);
  };
  const defaultCategories = [
    "Electronics",
    "Clothing",
    "Food",
    "Sports",
    "Accessories",
  ];
  const categoryOptions = [
    ...defaultCategories,
    ...categories.filter((item) => {
      return !defaultCategories.some(
        (defaultItem) => defaultItem.toLowerCase() === item.toLowerCase()
      );
    }),
  ];

  const filteredProducts = products.filter((product) => {
    const text = search.toLowerCase();
    const matchesSearch =
      product.name?.toLowerCase().includes(text) ||
      product.category?.toLowerCase().includes(text);
    const matchesCategory = category ? product.category === category : true;

    return matchesSearch && matchesCategory;
  });

  const pageSize = 6;
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredProducts.length);
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  const pageStart = filteredProducts.length === 0 ? 0 : startIndex + 1;

  const getCategoryClass = (value) => {
    const item = (value || "").toLowerCase();

    if (item === "electronics") {
      return "dashboard-cat-badge cat-electronics";
    }

    if (item === "clothing") {
      return "dashboard-cat-badge cat-clothing";
    }

    if (item === "food") {
      return "dashboard-cat-badge cat-food";
    }

    if (item === "sports") {
      return "dashboard-cat-badge cat-sports";
    }

    return "dashboard-cat-badge cat-default";
  };

  const getProductMark = (name) => {
    if (!name) {
      return "PR";
    }

    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((item) => item.charAt(0))
      .join("")
      .toUpperCase();
  };

  const formatDate = (value) => {
    if (!value) {
      return new Date().toLocaleDateString("en-IN");
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return date.toLocaleDateString("en-IN");
  };

  const getCreatedDate = (product) => {
    return product.createdAt || product.created_at || product.createdDate;
  };

  const formatPrice = (value) => {
    return Number(value || 0).toLocaleString("en-IN");
  };

  const roleLabel = isAdmin ? "Admin" : "User";
  const totalValue = products.reduce((total, product) => {
    return total + Number(product.price || 0);
  }, 0);

  return (
    <div
      className={
        isSidebarCollapsed
          ? "dashboard-shell sidebar-collapsed"
          : "dashboard-shell"
      }
    >
      <aside className="dashboard-sidebar">
        <div className="dashboard-sidebar-brand">
          <div className="dashboard-brand-icon">PM</div>
          <div className="dashboard-brand-details">
            <div className="dashboard-brand-name">ProductHub</div>
            <div className="dashboard-brand-sub">Inventory System</div>
          </div>
        </div>

        <div className="dashboard-sidebar-nav">
          <div className="dashboard-nav-section">Main</div>
          <button type="button" className="dashboard-nav-link active">
            <span className="dashboard-nav-icon">P</span>
            <span className="dashboard-nav-text">Products</span>
          </button>

          {isAdmin ? (
            <>
              <div className="dashboard-nav-section">Admin</div>
              <button
                type="button"
                className="dashboard-nav-link"
                onClick={openAddModal}
              >
                <span className="dashboard-nav-icon">+</span>
                <span className="dashboard-nav-text">Add product</span>
              </button>
            </>
          ) : null}

          <div className="dashboard-nav-section">Categories</div>
          <div className="dashboard-category-list">
            <button
              type="button"
              className={
                category === ""
                  ? "dashboard-category-filter active"
                  : "dashboard-category-filter"
              }
              onClick={() => handleCategoryFilter("")}
            >
              <span className="dashboard-category-dot all" />
              <span className="dashboard-category-name">All products</span>
              <span className="dashboard-category-count">{products.length}</span>
            </button>

            {categories.map((item) => {
              const count = products.filter((product) => product.category === item).length;

              return (
                <button
                  key={item}
                  type="button"
                  className={
                    category === item
                      ? "dashboard-category-filter active"
                      : "dashboard-category-filter"
                  }
                  onClick={() => handleCategoryFilter(item)}
                >
                  <span className={`dashboard-category-dot ${item.toLowerCase()}`} />
                  <span className="dashboard-category-name">{item}</span>
                  <span className="dashboard-category-count">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="dashboard-sidebar-footer">
          <div className="dashboard-user-chip">
            <div className={isAdmin ? "dashboard-avatar admin" : "dashboard-avatar user"}>
              {username.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="dashboard-user-details">
              <div className="dashboard-user-name">{username}</div>
              <div className="dashboard-user-role">
                {isAdmin ? "Administrator" : "Viewer"}
              </div>
            </div>
          </div>

          <button className="dashboard-logout-btn" onClick={handleLogout}>
            <span className="dashboard-logout-short">Out</span>
            <span className="dashboard-logout-text">Sign out</span>
          </button>
        </div>
      </aside>

      <div className="dashboard-main-content">
        <div className="dashboard-topbar">
          <div className="dashboard-topbar-left">
            <button
              type="button"
              className="dashboard-collapse-btn"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <svg
                className="dashboard-collapse-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3.5" y="4.5" width="17" height="15" rx="3" />
                <path d="M9 5v14" />
                {isSidebarCollapsed ? (
                  <path d="M13 9l3 3-3 3" />
                ) : (
                  <path d="M16 9l-3 3 3 3" />
                )}
              </svg>
            </button>
            <div>
              <div className="dashboard-topbar-title">Products</div>
              <div className="dashboard-topbar-sub">
                Product management dashboard
              </div>
            </div>
          </div>

          <div className="dashboard-topbar-right">
            <div className="dashboard-profile-wrap">
              <button
                type="button"
                className={isAdmin ? "dashboard-profile-card admin" : "dashboard-profile-card user"}
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                aria-expanded={showProfileMenu}
              >
                <span className={isAdmin ? "dashboard-profile-icon admin" : "dashboard-profile-icon user"}>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M20 21a8 8 0 0 0-16 0" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <div className="dashboard-profile-info">
                  <strong>{username}</strong>
                </div>
              </button>

              {showProfileMenu ? (
                <div className="dashboard-profile-menu">
                  <div className="dashboard-profile-menu-title">
                    Account details
                  </div>
                  <div className="dashboard-profile-row">
                    <span>Username</span>
                    <strong>{username}</strong>
                  </div>
                  <div className="dashboard-profile-row">
                    <span>Role</span>
                    <strong>{roleLabel}</strong>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="dashboard-page-body">
          <div className="dashboard-page-head">
            <div>
              <div className="dashboard-kicker">Product catalog</div>
              <h1>Products</h1>
              <p>{filteredProducts.length} visible of {products.length} records</p>
            </div>

            <div className="dashboard-head-actions">
              {isAdmin ? (
                <button className="dashboard-btn dashboard-btn-primary" onClick={openAddModal}>
                  Add Product
                </button>
              ) : null}
            </div>
          </div>

          {isAdmin ? (
            <div className="dashboard-stats-row">
              <div className="dashboard-stat-card">
                <div className="dashboard-stat-label">Total products</div>
                <div className="dashboard-stat-value">{products.length}</div>
                <div className="dashboard-stat-sub">In catalog</div>
              </div>

              <div className="dashboard-stat-card">
                <div className="dashboard-stat-label">Visible products</div>
                <div className="dashboard-stat-value green">
                  {filteredProducts.length}
                </div>
                <div className="dashboard-stat-sub">After filters</div>
              </div>

              <div className="dashboard-stat-card">
                <div className="dashboard-stat-label">Categories</div>
                <div className="dashboard-stat-value amber">
                  {categories.length}
                </div>
                <div className="dashboard-stat-sub">Available groups</div>
              </div>

              <div className="dashboard-stat-card">
                <div className="dashboard-stat-label">Catalog value</div>
                <div className="dashboard-stat-value red">Rs. {formatPrice(totalValue)}</div>
                <div className="dashboard-stat-sub">
                  Based on listed prices
                </div>
              </div>
            </div>
          ) : null}

          <div className="dashboard-table-toolbar">
            <div className="dashboard-search-box">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <select
              className="dashboard-filter-select"
              value={category}
              onChange={(event) => {
                handleCategoryFilter(event.target.value);
              }}
            >
              <option value="">All categories</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            {isAdmin ? (
              <button className="dashboard-btn dashboard-btn-primary" onClick={openAddModal}>
                New Product
              </button>
            ) : null}
          </div>

          <div className="dashboard-table-card">
            <div className="dashboard-table-header">
              <div>
                <h2>Product list</h2>
                <p>{isAdmin ? "Admin access enabled" : "View-only access"}</p>
              </div>
              <span className={isAdmin ? "dashboard-badge admin" : "dashboard-badge user"}>
                {roleLabel}
              </span>
            </div>

            <div className="dashboard-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Created</th>
                    {isAdmin ? <th>Actions</th> : null}
                  </tr>
                </thead>

                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={isAdmin ? 5 : 4}>
                        <div className="dashboard-no-results">Loading products...</div>
                      </td>
                    </tr>
                  ) : filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={isAdmin ? 5 : 4}>
                        <div className="dashboard-no-results">
                          <strong>No products found</strong>
                          {isAdmin ? (
                            <button
                              className="dashboard-btn dashboard-btn-primary"
                              onClick={openAddModal}
                            >
                              Add product
                            </button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedProducts.map((product) => (
                      <tr key={product.id}>
                        <td>
                          <div className="dashboard-product-cell">
                            <div className="dashboard-product-img">
                              {getProductMark(product.name)}
                            </div>
                            <div>
                              <div className="dashboard-product-name">{product.name}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={getCategoryClass(product.category)}>
                            {product.category}
                          </span>
                        </td>
                        <td className="dashboard-price-cell">
                          Rs. {formatPrice(product.price)}
                        </td>
                        <td>{formatDate(getCreatedDate(product))}</td>
                        {isAdmin ? (
                          <td>
                            <div className="dashboard-actions">
                              <button
                                className="dashboard-btn dashboard-btn-edit dashboard-btn-sm"
                                onClick={() => openEditModal(product)}
                              >
                                Edit
                              </button>
                              <button
                                className="dashboard-btn dashboard-btn-danger dashboard-btn-sm"
                                onClick={() => askDelete(product.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        ) : null}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="dashboard-pagination">
              <div className="dashboard-pagination-info">
                Showing {pageStart} - {endIndex} of {filteredProducts.length}
              </div>

              <div className="dashboard-pagination-actions">
                <button
                  type="button"
                  className="dashboard-page-btn"
                  onClick={() => setCurrentPage(safeCurrentPage - 1)}
                  disabled={safeCurrentPage === 1}
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                  (page) => (
                    <button
                      key={page}
                      type="button"
                      className={
                        safeCurrentPage === page
                          ? "dashboard-page-btn active"
                          : "dashboard-page-btn"
                      }
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  type="button"
                  className="dashboard-page-btn"
                  onClick={() => setCurrentPage(safeCurrentPage + 1)}
                  disabled={safeCurrentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showProductModal ? (
        <div className="dashboard-modal-overlay">
          <div className="dashboard-modal" role="dialog" aria-modal="true">
            <div className="dashboard-modal-header">
              <div>
                <div className="dashboard-modal-kicker">Admin product form</div>
                <div className="dashboard-modal-title">
                  {editingProductId ? "Edit product" : "Add product"}
                </div>
              </div>
              <button
                type="button"
                className="dashboard-modal-close"
                onClick={closeProductModal}
              >
                Close
              </button>
            </div>

            {formMessage ? (
              <div className="product-form-message">{formMessage}</div>
            ) : null}

            <form onSubmit={saveProduct}>
              <div className="dashboard-form-row">
                <div className="dashboard-modal-group">
                  <label htmlFor="productName">Product name *</label>
                  <input
                    id="productName"
                    type="text"
                    name="name"
                    placeholder="e.g. Wireless Mouse"
                    value={productForm.name}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="dashboard-modal-group">
                  <label htmlFor="productCategory">Category *</label>
                  <select
                    id="productCategory"
                    name="category"
                    value={productForm.category}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="">Select category</option>
                    {categoryOptions.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="dashboard-modal-group">
                <label htmlFor="productPrice">Price (Rs.) *</label>
                <input
                  id="productPrice"
                  type="number"
                  name="price"
                  min="0"
                  step="0.01"
                  placeholder="0"
                  value={productForm.price}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="dashboard-modal-actions">
                <button
                  type="button"
                  className="dashboard-btn dashboard-btn-plain"
                  onClick={closeProductModal}
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="dashboard-btn dashboard-btn-primary"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {showDeleteConfirm ? (
        <div className="dashboard-confirm-overlay">
          <div className="dashboard-confirm-box">
            <h3>Delete product?</h3>
            <p>
              This action cannot be undone. The product will be permanently removed
              from your catalog.
            </p>
            <div className="dashboard-confirm-actions">
              <button
                className="dashboard-btn dashboard-btn-plain"
                onClick={closeDeleteConfirm}
              >
                Cancel
              </button>
              <button
                className="dashboard-btn dashboard-btn-danger"
                onClick={confirmDeleteProduct}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {toast.text ? (
        <div className={`dashboard-toast show ${toast.type}`}>{toast.text}</div>
      ) : null}
    </div>
  );
}

export default Dashboard;
