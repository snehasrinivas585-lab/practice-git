// ── ORDERS ────────────────────────────────────────────────────────
export const orders = [
  { id:'ORD001', customer:'Priya Sharma',   items:3, amount:2400, payment:'Online', status:'Delivered',  date:'2026-05-28' },
  { id:'ORD002', customer:'Rajesh Kumar',   items:1, amount:800,  payment:'COD',    status:'Pending',    date:'2026-05-29' },
  { id:'ORD003', customer:'Lakshmi Devi',   items:5, amount:4600, payment:'Online', status:'Processing', date:'2026-05-29' },
  { id:'ORD004', customer:'Arun Patel',     items:2, amount:1600, payment:'Online', status:'Shipped',    date:'2026-05-30' },
  { id:'ORD005', customer:'Sneha Reddy',    items:4, amount:3200, payment:'COD',    status:'Delivered',  date:'2026-05-27' },
  { id:'ORD006', customer:'Vikram Singh',   items:2, amount:2000, payment:'Online', status:'Cancelled',  date:'2026-05-26' },
  { id:'ORD007', customer:'Deepa Nair',     items:1, amount:600,  payment:'COD',    status:'Pending',    date:'2026-05-30' },
  { id:'ORD008', customer:'Kiran Rao',      items:6, amount:5500, payment:'Online', status:'Delivered',  date:'2026-05-25' },
  { id:'ORD009', customer:'Anita Gupta',    items:3, amount:2800, payment:'Online', status:'Shipped',    date:'2026-05-30' },
  { id:'ORD010', customer:'Suresh Babu',    items:2, amount:1200, payment:'COD',    status:'Processing', date:'2026-05-29' },
  { id:'ORD011', customer:'Meena Iyer',     items:1, amount:400,  payment:'Online', status:'Delivered',  date:'2026-05-24' },
  { id:'ORD012', customer:'Rohit Verma',    items:4, amount:3800, payment:'Online', status:'Pending',    date:'2026-05-30' },
]

// ── CUSTOMERS ─────────────────────────────────────────────────────
export const customers = [
  { id:'C001', name:'Priya Sharma',  email:'priya@gmail.com',   phone:'9876543210', orders:12, spent:14400, joined:'2025-01-15', status:'Active'   },
  { id:'C002', name:'Rajesh Kumar',  email:'rajesh@gmail.com',  phone:'9765432109', orders:5,  spent:4000,  joined:'2025-03-22', status:'Active'   },
  { id:'C003', name:'Lakshmi Devi',  email:'lakshmi@gmail.com', phone:'9654321098', orders:18, spent:22000, joined:'2024-11-10', status:'Active'   },
  { id:'C004', name:'Arun Patel',    email:'arun@gmail.com',    phone:'9543210987', orders:3,  spent:3200,  joined:'2026-01-05', status:'Active'   },
  { id:'C005', name:'Sneha Reddy',   email:'sneha@gmail.com',   phone:'9432109876', orders:9,  spent:11200, joined:'2025-06-18', status:'Inactive' },
  { id:'C006', name:'Vikram Singh',  email:'vikram@gmail.com',  phone:'9321098765', orders:7,  spent:8400,  joined:'2025-08-30', status:'Active'   },
  { id:'C007', name:'Deepa Nair',    email:'deepa@gmail.com',   phone:'9210987654', orders:2,  spent:1600,  joined:'2026-03-12', status:'Active'   },
  { id:'C008', name:'Kiran Rao',     email:'kiran@gmail.com',   phone:'9109876543', orders:21, spent:28000, joined:'2024-09-05', status:'Active'   },
]

// ── PRODUCTS (admin view) ─────────────────────────────────────────
export const adminProducts = [
  { id:'P001', name:'Boneless Chicken Pickle', category:'Non-Veg Pickles', price:1200, stock:45, status:'Active',   image:'/images/chicken-pickle.webp' },
  { id:'P002', name:'Ginger Pickle',           category:'Veg Pickles',     price:800,  stock:62, status:'Active',   image:'/images/ginger-pickle.jpg'   },
  { id:'P003', name:'Ariselu',                 category:'Sweets',          price:600,  stock:30, status:'Active',   image:'/images/ariselu.jpg'         },
  { id:'P004', name:'Atukulu Mixture',         category:'Hot & Snacks',    price:500,  stock:8,  status:'Active',   image:'/images/atukula-mixture.webp'},
  { id:'P005', name:'Gongura Pickle',          category:'Veg Pickles',     price:800,  stock:55, status:'Active',   image:'/images/ginger-pickle.jpg'   },
  { id:'P006', name:'Mutton Boneless',         category:'Non-Veg Pickles', price:2000, stock:20, status:'Active',   image:'/images/chicken-pickle.webp' },
  { id:'P007', name:'Sunnundalu',              category:'Sweets',          price:1000, stock:0,  status:'Inactive', image:'/images/ariselu.jpg'         },
  { id:'P008', name:'Jantikalu',               category:'Hot & Snacks',    price:500,  stock:5,  status:'Active',   image:'/images/atukula-mixture.webp'},
]

// ── PAYMENTS ──────────────────────────────────────────────────────
export const payments = [
  { id:'PAY001', orderId:'ORD001', customer:'Priya Sharma',  amount:2400, method:'Razorpay', status:'Paid',     date:'2026-05-28' },
  { id:'PAY002', orderId:'ORD002', customer:'Rajesh Kumar',  amount:800,  method:'COD',       status:'Pending',  date:'2026-05-29' },
  { id:'PAY003', orderId:'ORD003', customer:'Lakshmi Devi',  amount:4600, method:'UPI',       status:'Paid',     date:'2026-05-29' },
  { id:'PAY004', orderId:'ORD004', customer:'Arun Patel',    amount:1600, method:'Card',      status:'Paid',     date:'2026-05-30' },
  { id:'PAY005', orderId:'ORD005', customer:'Sneha Reddy',   amount:3200, method:'COD',       status:'Paid',     date:'2026-05-27' },
  { id:'PAY006', orderId:'ORD006', customer:'Vikram Singh',  amount:2000, method:'UPI',       status:'Refunded', date:'2026-05-26' },
  { id:'PAY007', orderId:'ORD007', customer:'Deepa Nair',    amount:600,  method:'COD',       status:'Pending',  date:'2026-05-30' },
  { id:'PAY008', orderId:'ORD008', customer:'Kiran Rao',     amount:5500, method:'Razorpay', status:'Paid',     date:'2026-05-25' },
  { id:'PAY009', orderId:'ORD009', customer:'Anita Gupta',   amount:2800, method:'Card',      status:'Failed',   date:'2026-05-30' },
]

// ── COUPONS ───────────────────────────────────────────────────────
export const coupons = [
  { id:'CUP001', code:'PUJI10',    discount:10, type:'Percentage', minOrder:500,  usageLimit:100, used:45, validTill:'2026-12-31', status:'Active'   },
  { id:'CUP002', code:'FLAT100',   discount:100,type:'Flat',       minOrder:1000, usageLimit:50,  used:50, validTill:'2026-06-30', status:'Expired'  },
  { id:'CUP003', code:'NEWUSER20', discount:20, type:'Percentage', minOrder:300,  usageLimit:200, used:88, validTill:'2026-09-30', status:'Active'   },
  { id:'CUP004', code:'PICKLE15',  discount:15, type:'Percentage', minOrder:800,  usageLimit:75,  used:12, validTill:'2026-08-15', status:'Active'   },
  { id:'CUP005', code:'SWEET50',   discount:50, type:'Flat',       minOrder:600,  usageLimit:30,  used:30, validTill:'2026-05-01', status:'Expired'  },
]

// ── ANALYTICS DATA ────────────────────────────────────────────────
export const revenueData = [
  { month:'Jan', revenue:42000 }, { month:'Feb', revenue:38000 },
  { month:'Mar', revenue:55000 }, { month:'Apr', revenue:48000 },
  { month:'May', revenue:62000 }, { month:'Jun', revenue:71000 },
  { month:'Jul', revenue:58000 }, { month:'Aug', revenue:65000 },
  { month:'Sep', revenue:80000 }, { month:'Oct', revenue:95000 },
  { month:'Nov', revenue:88000 }, { month:'Dec', revenue:120000 },
]

export const ordersData = [
  { month:'Jan', orders:35 }, { month:'Feb', orders:28 },
  { month:'Mar', orders:45 }, { month:'Apr', orders:38 },
  { month:'May', orders:52 }, { month:'Jun', orders:61 },
  { month:'Jul', orders:48 }, { month:'Aug', orders:55 },
  { month:'Sep', orders:70 }, { month:'Oct', orders:82 },
  { month:'Nov', orders:74 }, { month:'Dec', orders:98 },
]

export const topProducts = [
  { name:'Chicken Pickle', sales:245 },
  { name:'Ginger Pickle',  sales:198 },
  { name:'Ariselu',        sales:156 },
  { name:'Atukulu Mix',    sales:134 },
  { name:'Gongura Pickle', sales:112 },
]

export const categoryData = [
  { name:'Veg Pickles',     value:38 },
  { name:'Non-Veg Pickles', value:32 },
  { name:'Sweets',          value:18 },
  { name:'Hot & Snacks',    value:12 },
]

// ── DELIVERY ──────────────────────────────────────────────────────
export const deliveries = [
  { id:'DEL001', orderId:'ORD001', customer:'Priya Sharma',  address:'Banjara Hills, Hyderabad',   status:'Delivered',  expected:'2026-05-28', agent:'Ravi Kumar'   },
  { id:'DEL002', orderId:'ORD002', customer:'Rajesh Kumar',  address:'Koramangala, Bangalore',     status:'Pending',    expected:'2026-06-02', agent:'Unassigned'   },
  { id:'DEL003', orderId:'ORD003', customer:'Lakshmi Devi',  address:'Anna Nagar, Chennai',        status:'On the Way', expected:'2026-06-01', agent:'Suresh Babu'  },
  { id:'DEL004', orderId:'ORD004', customer:'Arun Patel',    address:'Satellite, Ahmedabad',       status:'On the Way', expected:'2026-06-01', agent:'Manoj Singh'  },
  { id:'DEL005', orderId:'ORD005', customer:'Sneha Reddy',   address:'Jubilee Hills, Hyderabad',   status:'Delivered',  expected:'2026-05-27', agent:'Ravi Kumar'   },
  { id:'DEL006', orderId:'ORD007', customer:'Deepa Nair',    address:'Indiranagar, Bangalore',     status:'Pending',    expected:'2026-06-03', agent:'Unassigned'   },
  { id:'DEL007', orderId:'ORD009', customer:'Anita Gupta',   address:'Dwarka, New Delhi',          status:'On the Way', expected:'2026-06-02', agent:'Pradeep Roy'  },
]

// ── REVIEWS ───────────────────────────────────────────────────────
export const reviews = [
  { id:'REV001', product:'Chicken Pickle',  customer:'Priya Sharma',  rating:5, review:'Absolutely divine! Best pickle I have ever tasted.', date:'2026-05-28', status:'Approved'  },
  { id:'REV002', product:'Ginger Pickle',   customer:'Rajesh Kumar',  rating:4, review:'Very fresh and authentic taste. Will order again.',   date:'2026-05-27', status:'Approved'  },
  { id:'REV003', product:'Ariselu',         customer:'Lakshmi Devi',  rating:5, review:'Festival favourite in our home now. Crispy perfection.',date:'2026-05-26',status:'Pending'   },
  { id:'REV004', product:'Atukulu Mixture', customer:'Arun Patel',    rating:3, review:'Good taste but packaging could be better.',           date:'2026-05-25', status:'Approved'  },
  { id:'REV005', product:'Gongura Pickle',  customer:'Sneha Reddy',   rating:5, review:'Authentic gongura taste, takes me back to childhood.',  date:'2026-05-24', status:'Pending'   },
  { id:'REV006', product:'Mutton Boneless', customer:'Kiran Rao',     rating:4, review:'Rich flavour, excellent quality. Highly recommend.',   date:'2026-05-23', status:'Approved'  },
]

// ── ADMINS ────────────────────────────────────────────────────────
export const admins = [
  { id:'A001', name:'Super Admin',   email:'admin@pujihomefoods.com',  role:'Super Admin', lastLogin:'2026-05-30 10:32', status:'Active'   },
  { id:'A002', name:'Divya Rao',     email:'divya@pujihomefoods.com',  role:'Admin',       lastLogin:'2026-05-29 15:44', status:'Active'   },
  { id:'A003', name:'Karthik Reddy', email:'karthik@pujihomefoods.com',role:'Admin',       lastLogin:'2026-05-28 09:10', status:'Active'   },
  { id:'A004', name:'Anjali Mehta',  email:'anjali@pujihomefoods.com', role:'Admin',       lastLogin:'2026-05-20 11:55', status:'Inactive' },
]

// ── CATEGORIES ────────────────────────────────────────────────────
export const adminCategories = [
  { id:'CAT001', name:'Veg Pickles',     description:'Fresh vegetarian pickles made with seasonal produce', status:'Active',   products:15 },
  { id:'CAT002', name:'Non-Veg Pickles', description:'Rich spicy non-vegetarian pickles',                   status:'Active',   products:7  },
  { id:'CAT003', name:'Sweets',          description:'Traditional homemade sweets and desserts',            status:'Active',   products:10 },
  { id:'CAT004', name:'Hot & Snacks',    description:'Crispy spicy traditional snacks',                     status:'Active',   products:11 },
]

// ── NOTIFICATIONS ─────────────────────────────────────────────────
export const notifications = [
  { id:1, msg:'New order #ORD012 received from Rohit Verma',         time:'2 min ago',  read:false },
  { id:2, msg:'Low stock alert: Atukulu Mixture (8 units left)',      time:'15 min ago', read:false },
  { id:3, msg:'Payment failed for order #ORD009',                     time:'1 hr ago',   read:false },
  { id:4, msg:'New review pending approval from Sneha Reddy',         time:'2 hrs ago',  read:true  },
  { id:5, msg:'Coupon FLAT100 has reached usage limit',               time:'5 hrs ago',  read:true  },
]
