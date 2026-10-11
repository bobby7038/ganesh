export const COMMITTEE_ROLES = [
  {
    id: "admin",
    name: "System Administrator",
    badgeLabel: "👑 Admin",
    description: "Full control over committee settings, user creation, data reset, and complete financial audit.",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
    color: "#2563eb"
  },
  {
    id: "collector",
    name: "Chanda Collector",
    badgeLabel: "📖 Collector",
    description: "Authorized field officer for door-to-door Chanda collection and issuing WhatsApp receipts.",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    color: "#059669"
  },
  {
    id: "spender",
    name: "Expense Manager",
    badgeLabel: "🧾 Spender",
    description: "Treasurer officer responsible for logging event expenses, bills, sculptor advance, and vendor receipts.",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
    color: "#d97706"
  },
  {
    id: "luckydraw",
    name: "Lucky Draw & Auction Member",
    badgeLabel: "🎯 Lucky Draw",
    description: "Event officer managing Laddu Auction bidding, lucky coupon sales, and prize distribution.",
    badgeClass: "bg-purple-50 text-purple-700 border-purple-200",
    color: "#7e22ce"
  },
  {
    id: "reader",
    name: "Audit Viewer",
    badgeLabel: "👁️ Reader",
    description: "Read-only access for committee auditors and residents to inspect transparent financial reports.",
    badgeClass: "bg-slate-100 text-slate-700 border-slate-300",
    color: "#475569"
  },
  {
    id: "volunteer",
    name: "Event Volunteer",
    badgeLabel: "🪔 Volunteer",
    description: "On-field support officer managing daily Pooja, Annadhanam, Mandapam security, and Prasadam distribution.",
    badgeClass: "bg-sky-50 text-sky-700 border-sky-200",
    color: "#0284c7"
  }
];

export const getRoleById = (roleId) => {
  return COMMITTEE_ROLES.find(r => r.id === roleId) || {
    id: roleId,
    name: roleId,
    badgeLabel: roleId,
    badgeClass: "bg-slate-100 text-slate-700 border-slate-300"
  };
};

export const getUserRoles = (user) => {
  if (!user) return [];
  if (Array.isArray(user.roles) && user.roles.length > 0) {
    return user.roles;
  }
  return user.role ? [user.role] : ['reader'];
};
